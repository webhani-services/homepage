import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SESClient } from "@aws-sdk/client-ses";

type ContactData = {
  name: string;
  email: string;
  message: string;
};

// SES クライアントの初期化
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const data: ContactData = await request.json();
    const { name, email, message } = data;

    // Create Nodemailer transporter using AWS SES
    const transporter = nodemailer.createTransport({
      SES: { ses: sesClient, aws: { SendRawEmail: true } },
    });

    // Email content
    const mailOptions = {
      from: process.env.AWS_SES_FROM_EMAIL,
      to: email,
      subject: "【お問い合わせ】自動返信メール",
      text: `
        ${name} 様

        お問い合わせありがとうございます。
        以下の内容で承りました。

        ━━━━━━━━━━━━━━━━━━━━━━━━
        ■お名前
        ${name}

        ■メールアドレス
        ${email}

        ■お問い合わせ内容
        ${message}
        ━━━━━━━━━━━━━━━━━━━━━━━━

        内容を確認の上、担当者より回答させていただきます。
        しばらくお待ちくださいますようお願いいたします。

        ※このメールは自動送信されています。
        ※このメールに返信いただいても回答できません。

        ━━━━━━━━━━━━━━━━━━━━━━━━
        株式会社 Webhani
        URL: https://www.webhani.com/
        ━━━━━━━━━━━━━━━━━━━━━━━━
      `,
      html: `
        <div style="font-family: sans-serif;">
          <p>${name} 様</p>
          <p>お問い合わせありがとうございます。<br>以下の内容で承りました。</p>

          <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5;">
            <p><strong>■お名前</strong><br>${name}</p>
            <p><strong>■メールアドレス</strong><br>${email}</p>
            <p><strong>■お問い合わせ内容</strong><br>${message.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>

          <p>内容を確認の上、担当者より回答させていただきます。<br>
          しばらくお待ちくださいますようお願いいたします。</p>

          <p style="color: #666;">
            ※このメールは自動送信されています。<br>
            ※このメールに返信いただいても回答できません。
          </p>

          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">

          <div style="color: #666;">
            株式会社 Webhani<br>
            URL: <a href="https://www.webhani.com/">https://www.webhani.com/</a>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "メールを送信しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { message: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
