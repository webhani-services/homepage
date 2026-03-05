import { MoonIcon, SunIcon } from "../icons/ThemeIcons";
import { useTranslations } from "next-intl";

type Props = {
  isDark: boolean;
  onToggle: () => void;
};

export default function DarkModeToggle({ isDark, onToggle }: Props) {
  const t = useTranslations("navigation");

  return (
    <div className="flex items-center">
      <button
        onClick={onToggle}
        className="ml-4 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors duration-200"
        aria-label={t("darkModeToggle")}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );
}
