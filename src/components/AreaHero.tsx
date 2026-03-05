"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AreaHero() {
  const t = useTranslations("hero");

  const backgroundImageSrc = "/images/hero-bg.jpg";

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImageSrc}
          alt={t("backgroundImage.alt")}
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="inline-block mb-6 fade-in">
          <span className="text-amber-400 text-sm md:text-base font-medium tracking-[0.25em] uppercase">
            webhani Inc.
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 fade-in leading-[1.15] tracking-tight"
            style={{ animationDelay: "0.15s" }}>
          {t("title")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                {i < t("title").split("\n").length - 1 && <br />}
              </span>
            ))}
        </h1>
        <p
          className="text-lg md:text-xl mb-10 fade-in text-white/80 max-w-2xl mx-auto leading-relaxed"
          style={{ animationDelay: "0.3s" }}
        >
          {t("subtitle")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                {i < t("subtitle").split("\n").length - 1 && <br />}
              </span>
            ))}
        </p>
        <div className="fade-in" style={{ animationDelay: "0.45s" }}>
          <button
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="group relative inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold
            py-4 px-10 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-400/30"
          >
            {t("button")}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
