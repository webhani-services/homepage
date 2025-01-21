import Image from "next/image";

const services = [
  {
    title: "Webアプリケーション開発",
    description:
      "最新技術を活用した高品質なWebアプリケーション開発を提供。スケーラブルで保守性の高いシステムを構築します。",
    icon: "/images/services/web-development.svg",
    id: "web-development",
  },
  {
    title: "ITコンサルティング",
    description:
      "お客様のビジネス課題を解決するための最適なIT戦略を提案。デジタルトランスフォーメーションを支援します。",
    icon: "/images/services/consulting.svg",
    id: "consulting",
  },
  {
    title: "IT教育",
    description:
      "実践的なIT教育プログラムを提供。最新技術のトレーニングから、チーム全体のスキルアップまでサポートします。",
    icon: "/images/services/education.svg",
    id: "education",
  },
  {
    title: "デジタルコンテンツ開発",
    description:
      "WebサイトやアプリのUIデザイン、コンテンツ制作まで、魅力的なデジタル体験を創造します。",
    icon: "/images/services/digital-content.svg",
    id: "digital-content",
  },
  {
    title: "受託開発",
    description:
      "お客様のニーズに合わせた柔軟な開発体制で、高品質なシステムを提供。プロジェクト管理から運用保守まで一貫してサポートします。",
    icon: "/images/services/outsourcing.svg",
    id: "outsourcing",
  },
];

export default function AreaServices() {
  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-primary text-center">サービス</h2>
        <p className="paragraph text-center mb-12">
          お客様のビジネスの成長を支援する多様なサービスを提供しています
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              id={service.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-16 h-16 mb-4 mx-auto">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={64}
                  height={64}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
