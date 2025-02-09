import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // cookieから言語設定を読み取る
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");

  // デフォルトは日本語
  const locale = localeCookie?.value || "ja";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
