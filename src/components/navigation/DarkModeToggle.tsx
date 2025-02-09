import { MoonIcon, SunIcon } from "../icons/ThemeIcons";

type Props = {
  isDark: boolean;
  onToggle: () => void;
};

export default function DarkModeToggle({ isDark, onToggle }: Props) {
  return (
    <div className="flex items-center">
      <button
        onClick={onToggle}
        className="ml-4 p-2 rounded-md text-gray-800 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400 transition-colors duration-200"
        aria-label="ダークモード切り替え"
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );
}
