import { NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { z } from "zod";

// --- Environment validation ---
const requiredEnvVars = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_SES_TO_EMAIL",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
}

// SES クライアントの初期化
const ses = new SESClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// --- Rate limiter ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_REQUEST_BODY_SIZE = 10_000; // 10KB

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of Array.from(rateLimitMap)) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

// --- Validation ---
const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  message: z.string().min(1).max(5000),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Strip control characters and limit length for safe use in email subject */
function sanitizeForSubject(str: string): string {
  return str.replace(/[\r\n\t\x00-\x1f]/g, "").slice(0, 100);
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらく経ってからお試しください。" },
        { status: 429 }
      );
    }

    // Request body size check
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_SIZE) {
      return NextResponse.json(
        { error: "リクエストが大きすぎます。" },
        { status: 413 }
      );
    }

    const body = await request.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "入力内容に不備があります。" },
        { status: 400 }
      );
    }
    const { name, email, message } = result.data;

    // HTMLメールテンプレート
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .content {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      border: 1px solid #e9ecef;
    }
    .field {
      margin-bottom: 15px;
    }
    .field-label {
      font-weight: bold;
      color: #495057;
    }
    .message-content {
      white-space: pre-wrap;
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>新しいお問い合わせが届きました</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">お名前:</div>
        <div>${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="field-label">メールアドレス:</div>
        <div>${escapeHtml(email)}</div>
      </div>
      <div class="field">
        <div class="field-label">お問い合わせ内容:</div>
        <div class="message-content">${escapeHtml(message)}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // プレーンテキスト版（HTMLメールをサポートしないクライアント用）
    const textBody = `
新しいお問い合わせ

お名前: ${name}
メールアドレス: ${email}

お問い合わせ内容:
${message}
    `;

    const toEmail = process.env.AWS_SES_TO_EMAIL;
    if (!toEmail) {
      console.error("AWS_SES_TO_EMAIL is not configured");
      return NextResponse.json(
        { error: "エラーが発生しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    const sanitizedName = sanitizeForSubject(name);

    const params = {
      Source: toEmail,
      ReplyToAddresses: [email],
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: `[お問い合わせ] ${sanitizedName}様からのメッセージ`,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    await ses.send(command);

    return NextResponse.json(
      { message: "お問い合わせを送信しました。" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error sending email:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "エラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
