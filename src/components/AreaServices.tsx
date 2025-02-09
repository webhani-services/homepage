import { services } from "@/data/services";
import { ServiceCard } from "./area-services/ServiceCard";

export default function AreaServices() {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-primary text-center">サービス</h2>
        <p className="paragraph text-center mb-12">
          お客様のビジネスの成長を支援する多様なサービスを提供しています
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
