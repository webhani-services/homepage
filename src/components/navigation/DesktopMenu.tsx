import { useState } from "react";
import Link from "next/link";
import { NavigationItem } from "@/types/navigation";
import { ThemeToggle } from "./ThemeToggle";

export const DesktopMenu = ({
  navigation,
  theme,
}: {
  navigation: NavigationItem[];
  theme: string | undefined;
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
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
            <DropdownMenu
              items={item.children}
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            />
          )}
        </div>
      ))}
      <ThemeToggle />
    </div>
  );
};

const DropdownMenu = ({
  items,
  onMouseEnter,
  onMouseLeave,
}: {
  items: NavigationItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <div
    className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {items.map((item) => (
      <Link
        key={item.name}
        href={item.href}
        className="block px-4 py-2 text-sm text-gray-700 dark:text-yellow-300 hover:text-yellow-500 dark:hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {item.name}
      </Link>
    ))}
  </div>
);
