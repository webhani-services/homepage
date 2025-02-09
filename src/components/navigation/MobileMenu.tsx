import Link from "next/link";
import { NavigationItem, NavigationChild } from "@/components/navigation/types";

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
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-black shadow-lg">
        {items.map((item) => (
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
                {item.children.map((child: NavigationChild) => (
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

        <button
          onClick={onToggleDarkMode}
          className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
        >
          {isDark ? "ライトモード" : "ダークモード"}
        </button>
      </div>
    </div>
  );
}
