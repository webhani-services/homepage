import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const languages = [
  { code: "en", label: "EN" },
  { code: "ko", label: "KO" },
  { code: "ja", label: "JA" },
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
    <div className="flex items-center divide-x divide-gray-300 dark:divide-gray-700">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLocaleChange(lang.code)}
          disabled={isPending}
          className={`px-2 text-sm transition-colors duration-200
            ${
              currentLocale === lang.code
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : "text-gray-500 hover:text-amber-600 dark:text-gray-500 dark:hover:text-amber-400"
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
