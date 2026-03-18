import { getLocale } from "next-intl/server";
import { getPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import Link from "next/link";

export const metadata = {
  title: "Blog | webhani Inc.",
  description: "Technical blog posts from webhani",
};

export default async function BlogListPage() {
  const locale = await getLocale();
  const posts = getPosts(locale);

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

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No posts yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.frontmatter.slug}
                frontmatter={post.frontmatter}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
