import Image from "next/image";

const works = [
  {
    title: "企業向けクラウド基盤構築",
    category: "クラウド",
    image: "/images/works/cloud.jpg",
  },
  {
    title: "ECサイトリニューアル",
    category: "Web開発",
    image: "/images/works/ec.jpg",
  },
  {
    title: "業務効率化システム開発",
    category: "システム開発",
    image: "/images/works/system.jpg",
  },
];

export default function AreaWorks() {
  return (
    <section id="works" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-primary text-center">実績</h2>
        <p className="paragraph text-center mb-12">
          お客様のビジネスの成功を支えた実績をご紹介します
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work, index) => (
            <div
              key={work.title}
              className="group relative overflow-hidden rounded-lg fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative h-64">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <span className="text-sm font-medium mb-2">
                      {work.category}
                    </span>
                    <h3 className="text-xl font-bold text-center px-4">
                      {work.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
