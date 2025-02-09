import Image from "next/image";
import { useTranslations } from "next-intl";

// サービスデータを別の定数として分離
type Service = {
  title: string;
  description: string;
  icon: string;
  id: string;
};

const SERVICE_IDS = [
  {
    icon: "/images/services/web-development.svg",
    id: "webDevelopment",
  },
  {
    icon: "/images/services/consulting.svg",
    id: "consulting",
  },
  {
    icon: "/images/services/education.svg",
    id: "education",
  },
  {
    icon: "/images/services/digital-content.svg",
    id: "digitalContent",
  },
  {
    icon: "/images/services/outsourcing.svg",
    id: "outsourcing",
  },
];

// サービスカードのコンポーネントを分離
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
    className="bg-white dark:bg-black p-8 rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 fade-in dark:shadow-gray-800"
    style={{ animationDelay: `${index * 0.2}s` }}
  >
    <div className="w-16 h-16 mb-4 mx-auto">
      <Image
        src={icon}
        alt={t(`areaServices.services.${id}.title`)}
        width={64}
        height={64}
      />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-yellow-300 mb-3 text-center">
      {t(`areaServices.services.${id}.title`)}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-center">
      {t(`areaServices.services.${id}.description`)}
    </p>
  </div>
);

// メインコンポーネント
export default function AreaServices() {
  const t = useTranslations();

  return (
    <section id="services" className="section-padding dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-primary text-center dark:text-yellow-300">
          {t("areaServices.title")}
        </h2>
        <p className="paragraph text-center mb-12 dark:text-gray-400">
          {t("areaServices.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
