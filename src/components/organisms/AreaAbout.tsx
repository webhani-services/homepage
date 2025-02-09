import Image from "next/image";

export default function AreaAbout() {
  return (
    <section
      id="about"
      className="section-padding bg-gradient-to-b from-yellow-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">企業情報</h2>
        </div>

        <div className="relative">
          {/* 背景デコレーション */}
          <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 w-24 h-full">
            <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-yellow-200 to-transparent"></div>
          </div>

          {/* メインコンテンツ */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* 左側：基本情報 */}
              <div className="lg:col-span-1 p-8 lg:border-r border-gray-100 bg-yellow-50/50">
                <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center">
                  <span className="w-1 h-6 bg-yellow-400 mr-3"></span>
                  基本情報
                </h3>
                <dl className="space-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      社名
                    </dt>
                    <dd className="text-gray-900">株式会社 Webhani</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      設立日
                    </dt>
                    <dd className="text-gray-900">2016年1月1日</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      代表者
                    </dt>
                    <dd className="text-gray-900">金 容暈</dd>
                  </div>
                </dl>
              </div>

              {/* 右側：事業内容 */}
              <div className="lg:col-span-2 p-8 bg-white">
                <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center">
                  <span className="w-1 h-6 bg-yellow-400 mr-3"></span>
                  事業内容
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
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
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/50 transition-colors duration-300"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {service.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
