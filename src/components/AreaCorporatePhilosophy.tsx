"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const principles = [
  { id: "01", key: "innovation" },
  { id: "02", key: "quality" },
];

export default function AreaCorporatePhilosophy() {
  const t = useTranslations("philosophy");
  const revealRef = useScrollReveal();

  return (
    <section
      id="corporate-philosophy"
      className="section-padding bg-[var(--surface-muted)] dark:bg-[var(--dark-surface)] relative"
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="reveal text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
              Philosophy
            </span>
            <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-6">
              {t("title")}
            </h2>
            <p className="reveal reveal-delay-2 text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
              {t("description")}
            </p>
            <div className="space-y-6">
              {principles.map((principle, index) => (
                <div key={principle.id} className={`reveal reveal-delay-${index + 3} flex items-start gap-5`}>
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <span className="text-white font-bold text-sm">
                      {principle.id}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                      {t(`principles.${principle.key}.title`)}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                      {t(`principles.${principle.key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-2 relative h-[400px] lg:h-[520px]">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-200/30 to-transparent dark:from-amber-900/20 rounded-3xl" />
            <Image
              src="/images/about/team.jpg"
              alt={t("image.alt")}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
