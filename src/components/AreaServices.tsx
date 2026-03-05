"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
    className={`reveal reveal-delay-${(index % 3) + 1} group relative bg-white dark:bg-[var(--dark-surface-elevated)] p-8 rounded-2xl
    border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800
    transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5`}
  >
    <div className="w-14 h-14 mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
      <Image
        src={icon}
        alt={t(`areaServices.services.${id}.title`)}
        width={64}
        height={64}
        className="w-full h-full"
      />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
      {t(`areaServices.services.${id}.title`)}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
      {t(`areaServices.services.${id}.description`)}
    </p>
  </div>
);

export default function AreaServices() {
  const t = useTranslations();
  const revealRef = useScrollReveal();

  return (
    <section id="services" className="section-padding bg-white dark:bg-[var(--dark-bg)] relative" ref={revealRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="reveal text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
            Services
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {t("areaServices.title")}
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t("areaServices.description")}
          </p>
        </div>

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
