import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { LOCALES } from "@/lib/constants";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export type BlogStatus = "draft" | "published" | "private";

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  status: BlogStatus;
  tags: string[];
  thumbnail?: string;
  author: string;
  slug: string;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string;
}

export function getPosts(locale: string): BlogPost[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        frontmatter: data as BlogFrontmatter,
        content,
      };
    })
    .filter((post) => {
      if (process.env.NODE_ENV === "production") {
        return post.frontmatter.status === "published";
      }
      return post.frontmatter.status !== "private";
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getPostBySlug(
  locale: string,
  slug: string
): BlogPost | null {
  const posts = getPosts(locale);
  return posts.find((p) => p.frontmatter.slug === slug) ?? null;
}

export function getAllSlugs(): { locale: string; slug: string }[] {
  return LOCALES.flatMap((locale) =>
    getPosts(locale).map((post) => ({
      locale,
      slug: post.frontmatter.slug,
    }))
  );
}
