import Link from "next/link";
import Image from "next/image";
import type { BlogFrontmatter } from "@/lib/blog";

type BlogCardProps = {
  frontmatter: BlogFrontmatter;
};

export default function BlogCard({ frontmatter }: BlogCardProps) {
  const { title, description, date, tags, thumbnail, slug, status } =
    frontmatter;

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-white dark:bg-[var(--dark-surface-elevated)] transition-transform duration-300 group-hover:-translate-y-1">
        {thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-6">
          {status === "draft" && (
            <span className="inline-block mb-2 px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
              DRAFT
            </span>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium tracking-wide text-amber-600 dark:text-amber-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
            {description}
          </p>

          <time className="text-xs text-gray-400 dark:text-gray-500">
            {date}
          </time>
        </div>
      </article>
    </Link>
  );
}
