import { works } from "@/data/works";
import { WorkCard } from "./area-works/WorkCard";

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
            <WorkCard key={work.title} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
