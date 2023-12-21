import AreaTemplate from "@/components/templates/AreaTemplate";
import Image from "next/image";

export default function AreaConsultant() {
  return (
    <AreaTemplate isEven={false} sectionId={"area-consultant"}>
      <div className="grid grid-flow-col pt-10 px-10 gap-6 pb-12">
        <div>
          <h2 className="text-4xl">コンサールタント</h2>
          <p className="text-xl pt-6">
            最適なウェブ開発戦略をご提案。ニーズに合わせたカスタムソリューションでビジネスの成功を支援。最新技術の導入やセキュリティ対策にも力を入れ、お客様のオンラインプレゼンスを最大化します。エキスパートのコンサルティングで、効果的かつ効率的なウェブソリューションを構築し、競争力を向上させましょう
          </p>
          <div className="pt-20">
            <button className="px-18 py-5 rounded-2xl border-2 border-rose-500 bg-white text-rose-500 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-xl font-semibold">
              無料で相談する
            </button>
          </div>
        </div>
        <div className="flex content-center">
          <Image
            src="/consultant/consultant.png"
            alt="home-01"
            className="dark:invert"
            width={518}
            height={450}
          />
        </div>
      </div>
    </AreaTemplate>
  );
}
