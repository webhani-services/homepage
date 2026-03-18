"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import BlogCard from "@/components/blog/BlogCard";
import { getRevealDelayClass } from "@/lib/constants";
import type { BlogFrontmatter } from "@/lib/blog";

type AreaBlogProps = {
  posts: BlogFrontmatter[];
};

export default function AreaBlog({ posts }: AreaBlogProps) {
  const t = useTranslations("blog");
  const revealRef = useScrollReveal();

  return (
    <section
      id="blog"
      className="section-padding bg-white dark:bg-[var(--dark-bg)]"
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="reveal text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
            Blog
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {t("title")}
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="reveal text-center text-gray-500 dark:text-gray-400">
            {t("noPosts")}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((frontmatter, index) => (
                <div
                  key={frontmatter.slug}
                  className={`reveal ${getRevealDelayClass(index)}`}
                >
                  <BlogCard frontmatter={frontmatter} />
                </div>
              ))}
            </div>

            <div className="reveal reveal-delay-3 text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline transition-colors"
              >
                {t("viewAll")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
