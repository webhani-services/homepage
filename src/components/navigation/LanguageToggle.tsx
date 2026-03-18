"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const languages = [
  { code: "en", label: "EN" },
  { code: "ko", label: "KO" },
  { code: "ja", label: "JA" },
] as const;

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
}

export default function LanguageToggle() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    setLocaleCookie(newLocale);
    startTransition(() => {
      router.refresh();
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
            ${isPending ? "opacity-50 cursor-wait" : ""}
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
