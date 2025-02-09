import Image from "next/image";
import { Service } from "@/data/services";

type ServiceCardProps = {
  service: Service;
  index: number;
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <div
      id={service.id}
      className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transform
        hover:-translate-y-1 transition-all duration-300 fade-in"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="w-16 h-16 mb-4 mx-auto">
        <Image src={service.icon} alt={service.title} width={64} height={64} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
        {service.title}
      </h3>
      <p className="text-gray-600 text-center">{service.description}</p>
    </div>
  );
}
