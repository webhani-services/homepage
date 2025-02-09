import { useTheme } from "next-themes";
import { MdLightMode, MdDarkMode } from "react-icons/md";

export const ThemeToggle = ({ isMobile }: { isMobile?: boolean }) => {
  const { theme, setTheme } = useTheme();

  if (isMobile) {
    return (
      <div className="flex items-center justify-start gap-2 px-3 py-2">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-50 transition-colors duration-200
            ${theme === "light" ? "text-yellow-500" : "text-gray-700"}`}
        >
          <MdLightMode className="w-5 h-5" />
          <span>ライト</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-50 transition-colors duration-200
            ${theme === "dark" ? "text-yellow-500" : "text-gray-700"}`}
        >
          <MdDarkMode className="w-5 h-5" />
          <span>ダーク</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 transition-colors duration-1000 ${
        theme === "light"
          ? "text-gray-700 hover:text-yellow-800"
          : "text-yellow-300 hover:text-yellow-600"
      }`}
      aria-label="テーマ切り替え"
    >
      {theme === "dark" ? (
        <MdDarkMode className="w-5 h-5" />
      ) : (
        <MdLightMode className="w-5 h-5" />
      )}
    </button>
  );
};
