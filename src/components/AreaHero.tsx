"use client";
import Image from "next/image";

// ヒーローセクションのデータ
const heroData = {
  backgroundImage: {
    src: "/images/hero-bg.jpg",
    alt: "Hero background",
  },
  title: "革新的なITソリューションで\nビジネスの未来を創造する",
  subtitle:
    "システム開発からITコンサルティングまで\nお客様のデジタル変革をトータルサポート",
  button: {
    text: "お問い合わせ",
    targetId: "contact",
  },
};

export default function AreaHero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroData.backgroundImage.src}
          alt={heroData.backgroundImage.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
          {heroData.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < heroData.title.split("\n").length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p
          className="text-xl md:text-2xl mb-8 fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {heroData.subtitle.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < heroData.subtitle.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>
        <button
          onClick={() => {
            document.getElementById(heroData.button.targetId)?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-medium
          py-3 px-12 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {heroData.button.text}
        </button>
      </div>

      {/* スクロールインジケーター */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
