import Image from "next/image";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/hero-bg.jpg"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b" />
    </div>
  );
}
