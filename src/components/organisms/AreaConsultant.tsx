import AreaTemplate from "@/components/templates/AreaTemplate";
import Image from "next/image";

export default function AreaConsultant() {
  return (
    <AreaTemplate isEven={false} sectionId={"area-consultant"}>
      <div className="flex flex-auto pb-5">
        <div className="item-center mt-3 sm:px-9 lg:px-18">
          <h2 className="text-4xl text-center">コンサールタント</h2>
          <p className="text-xl pt-6">
            最適なウェブ開発戦略をご提案。ニーズに合わせたカスタムソリューションでビジネスの成功を支援。最新技術の導入やセキュリティ対策にも力を入れ、お客様のオンラインプレゼンスを最大化します。エキスパートのコンサルティングで、効果的かつ効率的なウェブソリューションを構築し、競争力を向上させましょう
          </p>
          <div className="flex justify-center pt-5 sm:pt-20">
            <button className="px-18 py-5 rounded-2xl border-2 border-rose-500 bg-white text-rose-500 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-xl font-semibold">
              無料で相談する
            </button>
          </div>
        </div>
      </div>
    </AreaTemplate>
  );
}
