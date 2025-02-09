"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { MdLightMode, MdDarkMode, MdBrightness6 } from "react-icons/md";

const navigation = [
  { name: "企業情報", href: "#about" },
  { name: "企業理念", href: "#corporate-philosophy" },
  {
    name: "サービス",
    href: "#services",
    children: [
      { name: "Webアプリケーション開発", href: "#web-development" },
      { name: "ITコンサルティング", href: "#consulting" },
      { name: "IT教育", href: "#education" },
      { name: "デジタルコンテンツ開発", href: "#digital-content" },
      { name: "受託開発", href: "#outsourcing" },
    ],
  },
  { name: "実績", href: "#works" },
  { name: "お問い合わせ", href: "#contact" },
];

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // マウント状態を確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // スクロール監視
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 初期レンダリング時はデフォルトのスタイルを返す
  if (!mounted) {
    return (
      <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-sm bg-yellow-300/95">
        {/* 最小限の初期コンテンツ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-[200px] h-[60px]" />{" "}
              {/* ロゴのプレースホルダー */}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-sm ${
        isScrolled
          ? theme === "dark"
            ? "bg-black shadow-md"
            : "bg-yellow-300 shadow-md"
          : theme === "dark"
          ? "bg-black/95"
          : "bg-yellow-300/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={
                  theme === "dark"
                    ? "/images/logo/full-logo-dark.svg"
                    : "/images/logo/full-logo-transparent.svg"
                }
                alt="webhani Inc."
                width={200}
                height={60}
                priority
                className="bg-transparent"
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </Link>
          </div>

          {/* デスクトップメニュー */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-gray-700 dark:text-yellow-300 hover:text-yellow-500 dark:hover:text-yellow-500 font-medium transition-colors duration-200 py-2"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {theme === "dark" ? (
                    <span className="text-yellow-300 hover:text-yellow-500">
                      {item.name}
                    </span>
                  ) : (
                    <span className="text-gray-700 hover:text-yellow-500">
                      {item.name}
                    </span>
                  )}
                </Link>
                {item.children && activeDropdown === item.name && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-yellow-300 hover:text-yellow-500 dark:hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-50 transition-colors duration-200
                  ${theme === "light" ? "text-yellow-500" : "text-gray-700"}`}
                   */}
            {/* テーマ切り替えボタン - デスクトップ */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 transition-colors duration-1000 ${
                theme === "light"
                  ? "text-gray-700 hover:text-yellow-800"
                  : "text-yellow-300 hover:text-yellow-600"
              }`}
              aria-label="テーマ切り替え"
            >
              {theme === "dark" ? (
                <MdDarkMode className="w-5 h-5" />
              ) : (
                <MdLightMode className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* モバイルメニューボタン */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">メニューを開く</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-yellow-300 hover:text-yellow-500 focus:text-yellow-500 dark:hover:text-yellow-500 dark:focus:text-yellow-500"
                  onClick={() => {
                    if (!item.children) {
                      setIsOpen(false);
                    }
                  }}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-yellow-500 focus:text-yellow-500 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* テーマ切り替えボタン - モバイル */}
            <div className="flex items-center justify-start gap-2 px-3 py-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-50 transition-colors duration-200
                  ${theme === "light" ? "text-yellow-500" : "text-gray-700"}`}
              >
                <MdLightMode className="w-5 h-5" />
                <span>ライト</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-50 transition-colors duration-200
                  ${theme === "dark" ? "text-yellow-500" : "text-gray-700"}`}
              >
                <MdDarkMode className="w-5 h-5" />
                <span>ダーク</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
