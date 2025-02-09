import Image from "next/image";
import { useTranslations } from "next-intl";

// データ部分を分離
const WORKS_DATA = [
  {
    id: "cloudInfra",
    image: "/images/works/cloud.jpg",
  },
  {
    id: "ecSite",
    image: "/images/works/ec.jpg",
  },
  {
    id: "businessSystem",
    image: "/images/works/system.jpg",
  },
] as const;

// WorkCardコンポーネントを作成して表示ロジックを分離
type WorkCardProps = {
  work: (typeof WORKS_DATA)[number];
  index: number;
  t: ReturnType<typeof useTranslations>;
};

const WorkCard = ({ work, index, t }: WorkCardProps) => (
  <div
    className="group relative overflow-hidden rounded-lg fade-in"
    style={{ animationDelay: `${index * 0.2}s` }}
  >
    <div className="relative h-72 lg:h-80">
      <Image
        src={work.image}
        alt={t(`works.items.${work.id}.title`)}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col items-center justify-center h-full text-white">
          <span className="text-sm font-medium mb-2 text-yellow-300">
            {t(`works.items.${work.id}.category`)}
          </span>
          <h3 className="text-xl font-bold text-center px-4 text-gray-100">
            {t(`works.items.${work.id}.title`)}
          </h3>
        </div>
      </div>
    </div>
  </div>
);

// メインコンポーネント
export default function AreaWorks() {
  const t = useTranslations();

  return (
    <section id="works" className="section-padding bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-primary text-center dark:text-yellow-300">
          {t("works.title")}
        </h2>
        <p className="paragraph text-center mb-12 dark:text-gray-400">
          {t("works.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORKS_DATA.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
