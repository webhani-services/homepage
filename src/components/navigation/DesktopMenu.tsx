import Link from "next/link";
import { NavigationItem, NavigationChild } from "@/components/navigation/types";

type Props = {
  items: NavigationItem[];
  activeDropdown: string | null;
  setActiveDropdown: (name: string | null) => void;
  isDark: boolean;
};

export default function DesktopMenu({
  items,
  activeDropdown,
  setActiveDropdown,
  isDark,
}: Props) {
  return (
    <div className="flex items-center space-x-8 ml-auto">
      {items.map((item) => (
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
              {item.children.map((child: NavigationChild) => (
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
  );
}
