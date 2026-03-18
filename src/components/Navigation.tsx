"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/MobileMenu";
import DarkModeToggle from "./navigation/DarkModeToggle";
import LanguageToggle from "./navigation/LanguageToggle";

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
      nameKey: "services",
      href: "/#services",
      children: [
        { nameKey: "webDevelopment", href: "/#web-development" },
        { nameKey: "consulting", href: "/#consulting" },
        { nameKey: "education", href: "/#education" },
        { nameKey: "digitalContent", href: "/#digital-content" },
        { nameKey: "outsourcing", href: "/#outsourcing" },
        { nameKey: "llmServices", href: "/#llm-services" },
      ],
    },
    { nameKey: "philosophy", href: "/#corporate-philosophy" },
    { nameKey: "about", href: "/#about" },
    { nameKey: "works", href: "/#works" },
    { nameKey: "blog", href: "/blog" },
    { nameKey: "contact", href: "/#contact" },
  ],
};

// ユーティリティ関数を拡張
const navigationUtils = {
  getScrolledStyle: (isScrolled: boolean) => ({
    background: isScrolled
      ? "bg-white/95 dark:bg-[var(--dark-bg)]/95"
      : "bg-white/80 dark:bg-[var(--dark-bg)]/80",
    additionalClasses: isScrolled ? "shadow-sm shadow-black/5" : "",
  }),

  toggleDarkMode: () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
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

    document.documentElement.classList.toggle("dark", isDarkMode);
    // Initial state sync with DOM - required for hydration
    queueMicrotask(() => setIsDark(isDarkMode));

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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { background, additionalClasses } = useMemo(
    () => navigationUtils.getScrolledStyle(isScrolled),
    [isScrolled]
  );

  const handleToggleDarkMode = () => {
    navigationUtils.toggleDarkMode();
    setIsDark(!isDark);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-sm ${background} ${additionalClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={isDark ? navigationData.logo.dark.src : navigationData.logo.light.src}
                alt={isDark ? navigationData.logo.dark.alt : navigationData.logo.light.alt}
                width={isDark ? navigationData.logo.dark.width : navigationData.logo.light.width}
                height={isDark ? navigationData.logo.dark.height : navigationData.logo.light.height}
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
            <DesktopMenu
              items={navigationData.menuItems}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <DarkModeToggle isDark={isDark} onToggle={handleToggleDarkMode} />
            </div>
          </div>

          {/* モバイルメニューボタン */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
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

      <MobileMenu
        items={navigationData.menuItems}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isDark={isDark}
        onToggleDarkMode={handleToggleDarkMode}
      />
    </nav>
  );
}
