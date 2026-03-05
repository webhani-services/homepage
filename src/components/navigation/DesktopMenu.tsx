import Link from "next/link";
import { NavigationItem, NavigationChild } from "@/components/navigation/types";
import { useTranslations } from "next-intl";

type Props = {
  items: NavigationItem[];
  activeDropdown: string | null;
  setActiveDropdown: (name: string | null) => void;
};

export default function DesktopMenu({
  items,
  activeDropdown,
  setActiveDropdown,
}: Props) {
  const t = useTranslations("navigation");

  return (
    <div className="flex items-center space-x-8 ml-auto">
      {items.map((item) => (
        <div key={item.nameKey} className="relative group">
          <Link
            href={item.href}
            className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors duration-200 py-2 text-sm"
            onMouseEnter={() => setActiveDropdown(item.nameKey)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {t(item.nameKey)}
          </Link>
          {item.children && activeDropdown === item.nameKey && (
            <div
              className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl shadow-black/10 border border-gray-100 dark:border-gray-800 py-2"
              onMouseEnter={() => setActiveDropdown(item.nameKey)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.children.map((child: NavigationChild) => (
                <Link
                  key={child.nameKey}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors duration-200 rounded-lg mx-1"
                >
                  {t(child.nameKey)}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
