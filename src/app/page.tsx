import { getLocale } from "next-intl/server";
import AreaBlog from "@/components/AreaBlog";
import AreaContact from "@/components/AreaContact";
import AreaHero from "@/components/AreaHero";
import AreaServices from "@/components/AreaServices";
import AreaStatement from "@/components/AreaStatement";
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
      <AreaStatement />
      <AreaServices />
      <AreaWorks />
      <AreaBlog posts={latestPosts} />
      <AreaContact />
    </div>
  );
}
