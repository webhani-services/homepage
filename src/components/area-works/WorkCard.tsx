import Image from "next/image";
import { Work } from "@/data/works";

type WorkCardProps = {
  work: Work;
  index: number;
};

export function WorkCard({ work, index }: WorkCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg fade-in"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="relative h-72 lg:h-80">
        <Image
          src={work.image}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col items-center justify-center h-full text-white">
            <span className="text-sm font-medium mb-2">{work.category}</span>
            <h3 className="text-xl font-bold text-center px-4">{work.title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
