import { NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// SES クライアントの初期化
const ses = new SESClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

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
        <div>${name}</div>
      </div>
      <div class="field">
        <div class="field-label">メールアドレス:</div>
        <div>${email}</div>
      </div>
      <div class="field">
        <div class="field-label">お問い合わせ内容:</div>
        <div class="message-content">${message}</div>
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

    const params = {
      Source: email,
      Destination: {
        ToAddresses: [process.env.AWS_SES_TO_EMAIL || 'contact@webhani.com'],
      },
      Message: {
        Subject: {
          Data: `[お問い合わせ] ${name}様からのメッセージ`,
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
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "エラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
