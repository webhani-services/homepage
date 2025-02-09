"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ナビゲーションで使用するデータを定義
const navigationData = {
  logo: {
    light: {
      src: "/images/logo/full-logo-transparent.svg",
      alt: "webhani Inc.",
      width: 200,
      height: 60,
    },
    dark: {
      src: "/images/logo/full-logo-dark.svg",
      alt: "webhani Inc.",
      width: 200,
      height: 60,
    },
  },
  menuItems: [
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
    { name: "企業理念", href: "#corporate-philosophy" },
    { name: "企業情報", href: "#about" },
    { name: "実績", href: "#works" },
    { name: "お問い合わせ", href: "#contact" },
  ],
};

// ユーティリティ関数を拡張
const navigationUtils = {
  getScrolledStyle: (isScrolled: boolean) => ({
    background: isScrolled
      ? "bg-yellow-300 dark:bg-black"
      : "bg-yellow-300/95 dark:bg-black",
    additionalClasses: isScrolled ? "shadow-md" : "",
  }),

  // ダークモード切り替え用の関数を追加
  toggleDarkMode: () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  },

  // システムの設定に従う
  useSystemTheme: () => {
    localStorage.removeItem("theme");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // ダークモードの初期化と監視
  useEffect(() => {
    // 初期状態の設定
    const isDarkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);

    // システムのカラースキーム変更を監視
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!("theme" in localStorage)) {
        setIsDark(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { background, additionalClasses } =
    navigationUtils.getScrolledStyle(isScrolled);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-sm ${background} ${additionalClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                {...(isDark
                  ? navigationData.logo.dark
                  : navigationData.logo.light)}
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
          <div className="hidden md:flex md:items-center md:space-x-8 justify-between flex-1">
            <div className="flex items-center space-x-8">
              {navigationData.menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="text-gray-800 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium transition-colors duration-200 py-2"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.name}
                  </Link>
                  {item.children && activeDropdown === item.name && (
                    <div
                      className="absolute left-0 mt-2 w-64 bg-white dark:bg-black rounded-md shadow-lg py-1"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-800 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ダークモードトグルボタン */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  navigationUtils.toggleDarkMode();
                  setIsDark(!isDark);
                }}
                className="ml-4 p-2 rounded-md text-gray-800 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
                aria-label="ダークモード切り替え"
              >
                {isDark ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* モバイルメニューボタン */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-400"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-black shadow-lg">
            {navigationData.menuItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
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
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* ダークモードトグル */}
            <button
              onClick={() => {
                navigationUtils.toggleDarkMode();
                setIsDark(!isDark);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
            >
              {isDark ? "ライトモード" : "ダークモード"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
