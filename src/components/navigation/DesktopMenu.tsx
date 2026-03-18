import Link from "next/link";
import { NavigationItem } from "@/components/navigation/types";
import { useTranslations } from "next-intl";

type Props = {
  items: NavigationItem[];
};

export default function DesktopMenu({ items }: Props) {
  const t = useTranslations("navigation");

  return (
    <div className="flex items-center space-x-8 ml-auto">
      {items.map((item) => (
        <Link
          key={item.nameKey}
          href={item.href}
          className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors duration-200 py-2 text-sm"
        >
          {t(item.nameKey)}
        </Link>
      ))}
    </div>
  );
}
