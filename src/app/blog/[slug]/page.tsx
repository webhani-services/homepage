import { getLocale } from "next-intl/server";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { notFound } from "next/navigation";
import BlogHeader from "@/components/blog/BlogHeader";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getPostBySlug(locale, slug);
  if (!post) return {};

  return {
    title: `${post.frontmatter.title} | webhani Blog`,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updatedAt,
      authors: [post.frontmatter.author],
      tags: post.frontmatter.tags,
      images: post.frontmatter.thumbnail
        ? [post.frontmatter.thumbnail]
        : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.updatedAt ?? post.frontmatter.date,
    author: {
      "@type": "Organization",
      name: post.frontmatter.author,
    },
    keywords: post.frontmatter.tags,
    ...(post.frontmatter.thumbnail && {
      image: post.frontmatter.thumbnail,
    }),
  };

  return (
    <section className="section-padding bg-[var(--surface-muted)] dark:bg-[var(--dark-bg)] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            ← Blog
          </Link>
        </div>

        <BlogHeader frontmatter={post.frontmatter} />

        <article className="prose prose-lg dark:prose-invert prose-headings:tracking-tight prose-a:text-amber-600 dark:prose-a:text-amber-400 max-w-none">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [rehypePrettyCode, { theme: "github-dark-default", keepBackground: true }],
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ],
              },
            }}
          />
        </article>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/blog"
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </section>
  );
}
