import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const languages = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
] as const;

export default function LanguageToggle() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      // 現在のURLを維持したまま言語だけ切り替える
      router.refresh();
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    });
  };

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLocaleChange(lang.code)}
          disabled={isPending}
          className={`px-2 py-1 text-sm rounded-md transition-colors duration-200
            ${
              currentLocale === lang.code
                ? "bg-yellow-300 text-gray-900 dark:bg-yellow-600 dark:text-white"
                : "text-gray-600 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
