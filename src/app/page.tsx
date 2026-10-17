import { getLocale } from "next-intl/server";
import AreaAbout from "@/components/AreaAbout";
import AreaBlog from "@/components/AreaBlog";
import AreaContact from "@/components/AreaContact";
import AreaCorporatePhilosophy from "@/components/AreaCorporatePhilosophy";
import AreaHero from "@/components/AreaHero";
import AreaProducts from "@/components/AreaProducts";
import AreaServices from "@/components/AreaServices";
import AreaWorks from "@/components/AreaWorks";
import { getPosts } from "@/lib/blog";

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
