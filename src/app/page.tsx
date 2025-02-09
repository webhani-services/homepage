import AreaHero from "@/components/AreaHero";
import AreaServices from "@/components/AreaServices";
import AreaAbout from "@/components/AreaAbout";
import AreaWorks from "@/components/AreaWorks";
import AreaContact from "@/components/AreaContact";
import AreaCorporatePhilosophy from "@/components/AreaCorporatePhilosophy";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AreaHero />
      {/* 会社概要 */}
      <AreaAbout />
      {/* 企業理念 */}
      <AreaCorporatePhilosophy />
      {/* サービス */}
      <AreaServices />
      {/* 作品 */}
      <AreaWorks />
      {/* お問い合わせ */}
      <AreaContact />
    </div>
  );
}
