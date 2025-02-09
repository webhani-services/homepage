export function HeroContent() {
  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="relative z-10 text-center text-white px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
        革新的なITソリューションで
        <br />
        ビジネスの未来を創造する
      </h1>
      <p
        className="text-xl md:text-2xl mb-8 fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        システム開発からITコンサルティングまで
        <br />
        お客様のデジタル変革をトータルサポート
      </p>
      <button
        onClick={handleContactClick}
        className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-medium
        py-3 px-12 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md fade-in"
        style={{ animationDelay: "0.4s" }}
        aria-label="お問い合わせフォームへ移動"
      >
        お問い合わせ
      </button>
    </div>
  );
}
