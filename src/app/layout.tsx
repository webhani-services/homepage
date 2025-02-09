import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { Noto_Sans_JP, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Footer from "@/components/Footer";
import "./globals.css";

// 使用したいフォントの設定
const inter = Inter({ subsets: ["latin"] });

const noto = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "webhani Inc. | システム開発・ITコンサルティング",
  description: "革新的なITソリューションを提供する株式会社webhani",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang="ja">
      <body className={`${noto.className} ${inter.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
