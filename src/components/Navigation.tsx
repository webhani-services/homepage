"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { NAVIGATION_ITEMS } from "@/constants/navigation";

const useScrollPosition = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
};

export default function Navigation() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isScrolled = useScrollPosition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <InitialNavigation />;
  }

  const navBackgroundClass = getNavigationBackgroundClass(isScrolled, theme);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-sm ${navBackgroundClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Logo theme={theme} />
          <DesktopMenu navigation={NAVIGATION_ITEMS} theme={theme} />
          <MobileMenuButton
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            theme={theme}
          />
        </div>
      </div>
      <MobileMenu
        isOpen={isOpen}
        navigation={NAVIGATION_ITEMS}
        setIsOpen={setIsOpen}
      />
    </nav>
  );
}

const InitialNavigation = () => (
  <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-sm bg-yellow-300/95">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center">
          <div className="w-[200px] h-[60px]" />
        </div>
      </div>
    </div>
  </nav>
);

const Logo = ({ theme }: { theme: string | undefined }) => (
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
        style={{ objectFit: "contain", objectPosition: "center" }}
      />
    </Link>
  </div>
);

const MobileMenuButton = ({
  isOpen,
  setIsOpen,
  theme,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  theme: string | undefined;
}) => (
  <div className="flex items-center md:hidden">
    <button
      type="button"
      className={`inline-flex items-center justify-center p-2 rounded-md  ${
        theme === "dark"
          ? "text-yellow-300  hover:text-yellow-500"
          : "text-gray-700 hover:text-black"
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="sr-only">メニューを開く</span>
      {!isOpen ? <MenuIcon /> : <CloseIcon />}
    </button>
  </div>
);

const MenuIcon = () => (
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
);

const CloseIcon = () => (
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
);

const getNavigationBackgroundClass = (
  isScrolled: boolean,
  theme: string | undefined
) => {
  if (isScrolled) {
    return theme === "dark" ? "bg-black shadow-md" : "bg-yellow-300 shadow-md";
  }
  return theme === "dark" ? "bg-black/95" : "bg-yellow-300/95";
};
