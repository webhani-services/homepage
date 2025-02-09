import type { Metadata } from "next";
import Navigation from "@/components/organisms/Navigation";
import { Noto_Sans_JP, Inter } from "next/font/google";
import Footer from "@/components/organisms/Footer";
import { ThemeProvider } from "next-themes";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${noto.className} ${inter.className}`}>
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
