import AreaHero from "@/components/organisms/AreaHero";
import AreaServices from "@/components/organisms/AreaServices";
import AreaAbout from "@/components/organisms/AreaAbout";
import AreaWorks from "@/components/organisms/AreaWorks";
import AreaContact from "@/components/organisms/AreaContact";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AreaHero />
      <AreaServices />
      <AreaAbout />
      <AreaWorks />
      <AreaContact />
    </div>
  );
}
