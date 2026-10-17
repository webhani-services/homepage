"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getRevealDelayClass } from "@/lib/constants";

const SERVICE_IDS = [
  { icon: "/images/services/web-development.svg", id: "webDevelopment" },
  { icon: "/images/services/consulting.svg", id: "consulting" },
  { icon: "/images/services/education.svg", id: "education" },
  { icon: "/images/services/digital-content.svg", id: "digitalContent" },
  { icon: "/images/services/outsourcing.svg", id: "outsourcing" },
  { icon: "/images/services/llm-ai.svg", id: "llmServices" },
];

type ServiceCardProps = {
  icon: string;
  id: string;
  index: number;
  t: (path: string) => string;
};

const ServiceCard = ({ icon, id, index, t }: ServiceCardProps) => (
  <div
    key={id}
    id={id}
    className={`reveal ${getRevealDelayClass(index)} group relative bg-white dark:bg-[var(--dark-surface-elevated)] p-8 rounded-2xl
    border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800
    transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5`}
  >
    <div className="w-14 h-14 mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
      <Image
        src={icon}
        alt={t(`services.${id}.title`)}
        width={64}
        height={64}
        className="w-full h-full"
      />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
      {t(`services.${id}.title`)}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
      {t(`services.${id}.description`)}
    </p>
  </div>
);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_IDS.map((service, index) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              id={service.id}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
