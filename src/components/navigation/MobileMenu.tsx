import Link from "next/link";
import { NavigationItem, NavigationChild } from "@/components/navigation/types";
import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";

type Props = {
  items: NavigationItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
};

export default function MobileMenu({
  items,
  isOpen,
  setIsOpen,
  isDark,
  onToggleDarkMode,
}: Props) {
  const t = useTranslations("navigation");

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-black shadow-lg">
        {/* メインメニュー */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
          {items.map((item) => (
            <div key={item.nameKey}>
              <Link
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
                onClick={() => {
                  if (!item.children) {
                    setIsOpen(false);
                  }
                }}
              >
                {t(item.nameKey)}
              </Link>
              {item.children && (
                <div className="pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.nameKey}
                      href={child.href}
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(child.nameKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 設定メニュー */}
        <div className="pt-2 space-y-2">
          <div className="px-3 py-2 flex justify-center">
            <LanguageToggle />
          </div>
          <button
            onClick={onToggleDarkMode}
            className="w-full text-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors duration-200"
          >
            {isDark ? t("lightMode") : t("darkMode")}
          </button>
        </div>
      </div>
    </div>
  );
}
