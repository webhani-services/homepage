import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { LOCALES } from "@/lib/constants";

const BASE_URL = "https://webhani.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = LOCALES.flatMap((locale) =>
    getPosts(locale).map((post) => ({
      url: `${BASE_URL}/blog/${post.frontmatter.slug}`,
      lastModified: new Date(
        post.frontmatter.updatedAt ?? post.frontmatter.date
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // 重複スラグを除去（多言語で同じslugが存在するため）
  const uniqueBlogEntries = blogEntries.filter(
    (entry, index, self) =>
      index === self.findIndex((e) => e.url === entry.url)
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...uniqueBlogEntries,
  ];
}
