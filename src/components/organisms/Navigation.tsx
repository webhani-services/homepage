"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { MdLightMode, MdDarkMode, MdBrightness6 } from "react-icons/md";

const navigation = [
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
];

export default function Navigation() {
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // スクロール監視の追加
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // クリックアウトサイドの処理を追加
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setIsThemeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-sm ${
        isScrolled ? "bg-yellow-300 shadow-md" : "bg-yellow-300/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/full-logo-transparent.svg"
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
                  className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 py-2"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.name}
                </Link>
                {item.children && activeDropdown === item.name && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* テーマ切り替えボタン - デスクトップ */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                aria-label="テーマ設定"
              >
                {theme === "dark" ? (
                  <MdDarkMode className="w-5 h-5" />
                ) : theme === "light" ? (
                  <MdLightMode className="w-5 h-5" />
                ) : (
                  <MdBrightness6 className="w-5 h-5" />
                )}
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1">
                  <button
                    onClick={() => {
                      setTheme("system");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition-colors duration-200
                      ${
                        theme === "system" ? "text-yellow-600" : "text-gray-700"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <MdBrightness6 className="w-5 h-5" />
                      <span>System theme</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("light");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition-colors duration-200
                      ${
                        theme === "light" ? "text-yellow-600" : "text-gray-700"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <MdLightMode className="w-5 h-5" />
                      <span>Light theme</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition-colors duration-200
                      ${
                        theme === "dark" ? "text-yellow-600" : "text-gray-700"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <MdDarkMode className="w-5 h-5" />
                      <span>Dark theme</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* モバイルメニューボタン */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
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
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50"
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
                  ${theme === "light" ? "text-yellow-600" : "text-gray-700"}`}
              >
                <MdLightMode className="w-5 h-5" />
                <span>ライト</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-50 transition-colors duration-200
                  ${theme === "dark" ? "text-yellow-600" : "text-gray-700"}`}
              >
                <MdDarkMode className="w-5 h-5" />
                <span>ダーク</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-50 transition-colors duration-200
                  ${theme === "system" ? "text-yellow-600" : "text-gray-700"}`}
              >
                <MdBrightness6 className="w-5 h-5" />
                <span>自動</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
