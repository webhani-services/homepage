import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { getPosts } from "@/lib/blog";
import BlogList from "@/components/blog/BlogList";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: `${t("title")} | webhani Inc.`,
    description: t("description"),
    openGraph: {
      title: `${t("title")} | webhani Inc.`,
      description: t("description"),
    },
  };
}

export default async function BlogListPage() {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const posts = getPosts(locale);

  const frontmatters = posts.map((p) => p.frontmatter);
  const allTags = Array.from(new Set(frontmatters.flatMap((p) => p.tags))).sort();

  const translations = {
    searchPlaceholder: t("searchPlaceholder"),
    allTags: t("allTags"),
    noResults: t("noResults"),
    prev: t("prev"),
    next: t("next"),
  };

  return (
    <section className="section-padding bg-[var(--surface-muted)] dark:bg-[var(--dark-bg)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            ← Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Blog
          </h1>
        </div>

        <Suspense fallback={null}>
          <BlogList
            posts={frontmatters}
            allTags={allTags}
            translations={translations}
          />
        </Suspense>
      </div>
    </section>
  );
}
