import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/organisms/Navigation";
import { Noto_Sans_JP } from "next/font/google";
import Footer from "@/components/organisms/Footer";

// 使用したいフォントの設定
const noto = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "Webhani",
  description: "Webhani inc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${noto.className}`}>
        <Navigation />
        <main className="mt-22">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
