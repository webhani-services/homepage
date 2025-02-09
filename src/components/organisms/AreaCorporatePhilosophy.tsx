import Image from "next/image";

export default function AreaAbout() {
  return (
    <section id="corporate-philosophy" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <h2 className="heading-primary">企業理念</h2>
            <p className="paragraph mb-6">
              私たちは、テクノロジーの力で社会に貢献し、
              お客様とともに新しい価値を創造することを目指しています。
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold">01</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold mb-2">技術革新</h3>
                  <p className="text-gray-600">
                    最新技術を積極的に取り入れ、革新的なソリューションを提供します。
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold">02</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold mb-2">品質重視</h3>
                  <p className="text-gray-600">
                    高品質なサービスの提供を通じて、お客様の信頼を獲得します。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative h-[400px] lg:h-[500px] fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Image
              src="/images/about/team.jpg"
              alt="Our Team"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
