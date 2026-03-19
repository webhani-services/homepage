import { getLocale } from "next-intl/server";
import { getPosts } from "@/lib/blog";
import AreaHero from "@/components/AreaHero";
import AreaServices from "@/components/AreaServices";
import AreaAbout from "@/components/AreaAbout";
import AreaProducts from "@/components/AreaProducts";
import AreaWorks from "@/components/AreaWorks";
import AreaBlog from "@/components/AreaBlog";
import AreaContact from "@/components/AreaContact";
import AreaCorporatePhilosophy from "@/components/AreaCorporatePhilosophy";

export default async function Home() {
  const locale = await getLocale();
  const latestPosts = getPosts(locale)
    .slice(0, 3)
    .map((post) => post.frontmatter);

  return (
    <div className="flex min-h-screen flex-col">
      <AreaHero />
      <AreaServices />
      <AreaCorporatePhilosophy />
      <AreaAbout />
      <AreaProducts />
      <AreaWorks />
      <AreaBlog posts={latestPosts} />
      <AreaContact />
    </div>
  );
}
