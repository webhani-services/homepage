type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className = "mb-16",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {/* Decorative: the h2 carries the meaningful heading */}
      <span
        aria-hidden="true"
        className="reveal block text-5xl md:text-7xl xl:text-8xl font-normal leading-none tracking-[-0.04em] text-gray-900 dark:text-gray-100"
      >
        {eyebrow}
      </span>
      <h2 className="reveal reveal-delay-1 mt-6 text-lg md:text-xl font-semibold text-amber-700 dark:text-amber-400">
        {title}
      </h2>
      {description && (
        <p className="reveal reveal-delay-2 mt-4 text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
