"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { BlogFrontmatter } from "@/lib/blog";
import { getRevealDelayClass } from "@/lib/constants";

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
        <SectionHeading
          eyebrow="Blog"
          title={t("title")}
          description={t("description")}
        />

        {posts.length === 0 ? (
          <p className="reveal text-gray-500 dark:text-gray-400">
            {t("noPosts")}
          </p>
        ) : (
          <>
            <ul className="border-t border-gray-200 dark:border-gray-800">
              {posts.map((post, index) => (
                <li
                  key={post.slug}
                  className={`reveal ${getRevealDelayClass(index)} border-b border-gray-200 dark:border-gray-800`}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 items-center"
                  >
                    {post.thumbnail && (
                      <div className="md:col-span-3 relative aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={post.thumbnail}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div
                      className={
                        post.thumbnail ? "md:col-span-9" : "md:col-span-12"
                      }
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                        {post.status === "draft" && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20">
                            DRAFT
                          </span>
                        )}
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </h3>
                      <time
                        dateTime={post.date}
                        className="mt-3 block text-sm text-gray-400 dark:text-gray-500"
                      >
                        {post.date}
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="reveal reveal-delay-3 mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold hover:underline transition-colors"
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
