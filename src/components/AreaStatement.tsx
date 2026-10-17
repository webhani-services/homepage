"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AreaStatement() {
  const t = useTranslations("philosophy");
  const revealRef = useScrollReveal();

  return (
    <section
      id="about"
      className="section-padding bg-[var(--surface-muted)] dark:bg-[var(--dark-surface)]"
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="About"
          title={t("title")}
          description={t("description")}
          className="mb-10"
        />
        <Link
          href="/about"
          className="reveal reveal-delay-3 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-8 py-3 text-sm font-medium text-white dark:text-gray-900 hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors"
        >
          {t("readMore")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
