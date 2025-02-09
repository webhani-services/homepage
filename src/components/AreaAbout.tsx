import Image from "next/image";
import { useTranslations } from "next-intl";

// 基本情報データ
const companyInfo = {
  name: "株式会社 Webhani",
  establishedDate: "2016年1月1日",
  representative: "金 容暈",
};

// 事業内容データ
const services = [
  "webDev",
  "consulting",
  "infrastructure",
  "education",
  "digitalContent",
  "outsourcing",
] as const;

// 基本情報コンポーネント
const CompanyBasicInfo = () => {
  const t = useTranslations("about");

  return (
    <div className="lg:col-span-1 p-8 lg:border-r border-gray-100 dark:border-gray-800">
      <h3 className="font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
        <span className="w-1 h-6 bg-yellow-400 mr-3"></span>
        <span className="text-3xl dark:text-yellow-300">
          {t("basicInfo.title")}
        </span>
      </h3>
      <dl className="space-y-6">
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t("basicInfo.companyName")}
          </dt>
          <dd className="text-gray-900 dark:text-yellow-300">
            {companyInfo.name}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t("basicInfo.established")}
          </dt>
          <dd className="text-gray-900 dark:text-yellow-300">
            {companyInfo.establishedDate}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t("basicInfo.representative")}
          </dt>
          <dd className="text-gray-900 dark:text-yellow-300">
            {companyInfo.representative}
          </dd>
        </div>
      </dl>
    </div>
  );
};

// 事業内容コンポーネント
const ServiceList = () => {
  const t = useTranslations("about");

  return (
    <div className="lg:col-span-2 p-8 bg-white dark:bg-black">
      <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-gray-100 flex items-center">
        <span className="w-1 h-6 bg-yellow-400 mr-3"></span>
        <span className="text-3xl dark:text-yellow-300">
          {t("services.title")}
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service}
            className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-yellow-200 dark:hover:border-yellow-900 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20 transition-colors duration-300"
          >
            <h4 className="font-medium text-gray-900 dark:text-yellow-300 mb-2">
              {t(`services.items.${service}.title`)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
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

  return (
    <section
      id="about"
      className="section-padding bg-white dark:bg-black dark:text-yellow-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-yellow-300">
            {t("title")}
          </h2>
        </div>

        <div className="relative">
          <div className="bg-white dark:bg-black rounded-2xl overflow-hidden">
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
