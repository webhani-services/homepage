"use client";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  "webDev",
  "consulting",
  "infrastructure",
  "education",
  "digitalContent",
  "outsourcing",
] as const;

const CompanyBasicInfo = () => {
  const t = useTranslations("about");

  const companyInfo = {
    name: t("basicInfo.companyNameValue"),
    establishedDate: t("basicInfo.establishedValue"),
    representative: t("basicInfo.representativeValue"),
  };

  return (
    <div className="lg:col-span-1 p-8 lg:border-r border-gray-100 dark:border-gray-800">
      <h3 className="font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
        <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mr-3"></span>
        <span className="text-2xl">{t("basicInfo.title")}</span>
      </h3>
      <dl className="space-y-6">
        {[
          { label: t("basicInfo.companyName"), value: companyInfo.name },
          { label: t("basicInfo.established"), value: companyInfo.establishedDate },
          { label: t("basicInfo.representative"), value: companyInfo.representative },
        ].map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              {item.label}
            </dt>
            <dd className="text-gray-900 dark:text-gray-200 font-medium">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const ServiceList = () => {
  const t = useTranslations("about");

  return (
    <div className="lg:col-span-2 p-8">
      <h3 className="font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
        <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mr-3"></span>
        <span className="text-2xl">{t("services.title")}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service}
            className="p-4 rounded-xl border border-gray-100 dark:border-gray-800
            hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/50 dark:hover:bg-amber-900/10
            transition-all duration-300"
          >
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1.5 text-sm">
              {t(`services.items.${service}.title`)}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {t(`services.items.${service}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AreaAbout() {
  const t = useTranslations("about");
  const revealRef = useScrollReveal();

  return (
    <section
      id="about"
      className="section-padding bg-white dark:bg-[var(--dark-bg)]"
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="reveal text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
            About
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {t("title")}
          </h2>
        </div>

        <div className="reveal reveal-delay-2 relative">
          <div className="bg-white dark:bg-[var(--dark-surface)] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <CompanyBasicInfo />
              <ServiceList />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
