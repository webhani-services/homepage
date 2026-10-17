import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AreaAbout from "@/components/AreaAbout";
import AreaCorporatePhilosophy from "@/components/AreaCorporatePhilosophy";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  const tPhilosophy = await getTranslations("philosophy");
  return {
    title: `${t("title")} | webhani`,
    description: tPhilosophy("description"),
    openGraph: {
      title: `${t("title")} | webhani`,
      description: tPhilosophy("description"),
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Section headings start at h2; give the page its own h1 */}
      <h1 className="sr-only">{t("title")}</h1>
      <AreaCorporatePhilosophy />
      <AreaAbout />
    </div>
  );
}
