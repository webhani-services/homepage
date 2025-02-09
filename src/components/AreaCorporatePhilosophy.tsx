import Image from "next/image";
import { useTranslations } from "next-intl";

// 企業理念の原則データを定義
const principles = [
  {
    id: "01",
    key: "innovation",
  },
  {
    id: "02",
    key: "quality",
  },
];

export default function AreaCorporatePhilosophy() {
  const t = useTranslations("philosophy");

  return (
    <section
      id="corporate-philosophy"
      className="section-padding bg-gray-50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <h2 className="heading-primary dark:text-yellow-300">
              {t("title")}
            </h2>
            <p className="paragraph dark:text-gray-400 mb-6">
              {t("description")}
            </p>
            <div className="space-y-4">
              {principles.map((principle) => (
                <div key={principle.id} className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-300 dark:bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 dark:text-gray-100 font-bold">
                      {principle.id}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold mb-2 dark:text-yellow-300">
                      {t(`principles.${principle.key}.title`)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t(`principles.${principle.key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative h-[400px] lg:h-[500px] fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Image
              src="/images/about/team.jpg"
              alt={t("image.alt")}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
