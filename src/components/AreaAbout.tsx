import Image from "next/image";

// 基本情報データ
const companyInfo = {
  name: "株式会社 Webhani",
  establishedDate: "2016年1月1日",
  representative: "金 容暈",
};

// 事業内容データ
const services = [
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
] as const;

// 基本情報コンポーネント
const CompanyBasicInfo = () => (
  <div className="lg:col-span-1 p-8 lg:border-r border-gray-100 ">
    <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center">
      <span className="w-1 h-6 mr-3"></span>
      基本情報
    </h3>
    <dl className="space-y-6">
      <div>
        <dt className="text-sm font-medium text-gray-500 mb-1">社名</dt>
        <dd className="text-gray-900">{companyInfo.name}</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500 mb-1">設立日</dt>
        <dd className="text-gray-900">{companyInfo.establishedDate}</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500 mb-1">代表者</dt>
        <dd className="text-gray-900">{companyInfo.representative}</dd>
      </div>
    </dl>
  </div>
);

// 事業内容コンポーネント
const ServiceList = () => (
  <div className="lg:col-span-2 p-8 bg-white">
    <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center">
      <span className="w-1 h-6 bg-yellow-400 mr-3"></span>
      事業内容
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/50 transition-colors duration-300"
        >
          <h4 className="font-medium text-gray-900 mb-2">{service.title}</h4>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
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
              <CompanyBasicInfo />
              <ServiceList />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
