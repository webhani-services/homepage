"use client";

import { ScrollIndicator } from "./area-hero/ScrollIndicator";
import { HeroContent } from "./area-hero/HeroContent";
import { HeroBackground } from "./area-hero/HeroBackground";

export default function AreaHero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <HeroBackground />
      <HeroContent />
      <ScrollIndicator />
    </section>
  );
}
