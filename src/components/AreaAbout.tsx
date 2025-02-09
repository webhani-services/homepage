type ServiceItem = {
  title: string;
  description: string;
};

const COMPANY_SERVICES: ServiceItem[] = [
  {
    title: "Webアプリケーション開発",
    description: "最新技術を活用した高品質なWeb開発",
  },
  {
    title: "システムコンサルティング",
    description: "お客様のビジネスに最適なソリューション提案",
  },
  {
    title: "ITインフラ構築・運用",
    description: "安定性と拡張性を重視したインフラ設計",
  },
  {
    title: "IT教育",
    description: "次世代のIT人材育成をサポート",
  },
  {
    title: "デジタルコンテンツ開発",
    description: "魅力的なデジタルコンテンツの制作",
  },
  {
    title: "受託開発",
    description: "要件定義から運用まで一貫したサポート",
  },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center">
    <span className="w-1 h-6 bg-yellow-400 mr-3"></span>
    {children}
  </h3>
);

const CompanyInfo = () => (
  <div className="lg:col-span-1 p-8 lg:border-r border-gray-100">
    <SectionTitle>基本情報</SectionTitle>
    <dl className="space-y-6">
      <InfoItem label="社名" value="株式会社 Webhani" />
      <InfoItem label="設立日" value="2016年1月1日" />
      <InfoItem label="代表者" value="金 容暈" />
    </dl>
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
    <dd className="text-gray-900">{value}</dd>
  </div>
);

const ServiceCard = ({ title, description }: ServiceItem) => (
  <div className="p-4 rounded-lg border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/50 transition-colors duration-300">
    <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const Services = () => (
  <div className="lg:col-span-2 p-8 bg-white">
    <SectionTitle>事業内容</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {COMPANY_SERVICES.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  </div>
);

export default function AreaAbout() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">企業情報</h2>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <CompanyInfo />
              <Services />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
