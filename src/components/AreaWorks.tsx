"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WORKS_DATA = [
  { id: "cloudInfra", image: "/images/works/cloud.jpg" },
  { id: "ecSite", image: "/images/works/ec.jpg" },
  { id: "businessSystem", image: "/images/works/system.jpg" },
  { id: "aiChatbot", image: "/images/works/ai-chatbot.jpg" },
] as const;

type WorkCardProps = {
  work: (typeof WORKS_DATA)[number];
  index: number;
  t: (
    key:
      | `works.items.${(typeof WORKS_DATA)[number]["id"]}.title`
      | `works.items.${(typeof WORKS_DATA)[number]["id"]}.category`
  ) => string;
};

const WorkCard = ({ work, index, t }: WorkCardProps) => (
  <div
    className={`reveal reveal-delay-${(index % 3) + 1} group relative overflow-hidden rounded-2xl`}
  >
    <div className="relative h-72 lg:h-80">
      <Image
        src={work.image}
        alt={t(`works.items.${work.id}.title`)}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Default gradient at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content - always visible at bottom, enhanced on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <span className="text-amber-400 text-xs font-semibold tracking-[0.15em] uppercase mb-2 block
          transform transition-transform duration-500 group-hover:-translate-y-1">
          {t(`works.items.${work.id}.category`)}
        </span>
        <h3 className="text-lg font-bold leading-snug
          transform transition-transform duration-500 group-hover:-translate-y-1">
          {t(`works.items.${work.id}.title`)}
        </h3>
      </div>
    </div>
  </div>
);

export default function AreaWorks() {
  const t = useTranslations();
  const revealRef = useScrollReveal();

  return (
    <section id="works" className="section-padding bg-[var(--surface-muted)] dark:bg-[var(--dark-surface)]" ref={revealRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="reveal text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
            Works
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {t("works.title")}
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t("works.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORKS_DATA.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
