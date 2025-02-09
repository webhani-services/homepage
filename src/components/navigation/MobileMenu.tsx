import Link from "next/link";
import { NavigationItem } from "@/types/navigation";
import { ThemeToggle } from "./ThemeToggle";

export const MobileMenu = ({
  isOpen,
  navigation,
  setIsOpen,
}: {
  isOpen: boolean;
  navigation: NavigationItem[];
  setIsOpen: (value: boolean) => void;
}) => {
  if (!isOpen) return null;

  return (
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
        <ThemeToggle isMobile />
      </div>
    </div>
  );
};
