import type { BlogFrontmatter } from "@/lib/blog";

type BlogHeaderProps = {
  frontmatter: BlogFrontmatter;
};

export default function BlogHeader({ frontmatter }: BlogHeaderProps) {
  const { title, date, updatedAt, tags, author, status } = frontmatter;

  return (
    <header className="mb-12">
      {status === "draft" && (
        <span className="inline-block mb-4 px-3 py-1 text-sm font-semibold rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
          DRAFT
        </span>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-sm font-medium tracking-wide text-amber-600 dark:text-amber-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-6">
        {title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>{author}</span>
        <span>·</span>
        <time>{date}</time>
        {updatedAt && (
          <>
            <span>·</span>
            <span>Updated {updatedAt}</span>
          </>
        )}
      </div>
    </header>
  );
}
