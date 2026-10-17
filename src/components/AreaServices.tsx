"use client";
import { useTranslations } from "next-intl";
import ProductList from "@/components/ProductList";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getRevealDelayClass } from "@/lib/constants";

const SERVICE_IDS = [
  "webDevelopment",
  "consulting",
  "education",
  "digitalContent",
  "outsourcing",
  "llmServices",
] as const;

export default function AreaServices() {
  const t = useTranslations("areaServices");
  const revealRef = useScrollReveal();

  return (
    <section
      id="services"
      className="section-padding bg-white dark:bg-[var(--dark-bg)] relative"
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Services"
          title={t("title")}
          description={t("description")}
        />

        <ol className="border-t border-gray-200 dark:border-gray-800">
          {SERVICE_IDS.map((id, index) => (
            <li
              key={id}
              id={id}
              className={`reveal ${getRevealDelayClass(index)} grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-8 border-b border-gray-200 dark:border-gray-800`}
            >
              <span className="md:col-span-1 text-sm font-medium tabular-nums text-amber-700 dark:text-amber-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="md:col-span-4 text-xl font-medium text-gray-900 dark:text-gray-100">
                {t(`services.${id}.title`)}
              </h3>
              <p className="md:col-span-7 text-gray-500 dark:text-gray-400 leading-relaxed">
                {t(`services.${id}.description`)}
              </p>
            </li>
          ))}
        </ol>

        <ProductList />
      </div>
    </section>
  );
}
