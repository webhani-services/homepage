import AreaTemplate from "../templates/AreaTemplate";

export default function AreaSystemDevelopment() {
  return (
    <AreaTemplate isEven={false} sectionId={"area-system-development"}>
      <div className="flex flex-col items-center pt-12">
        <h2 className="text-4xl align-center">システム開発</h2>
        <hr className="border-4 my-3 border-rose-500 w-12 rounded" />
        <h2 className="text-3xl">ビジネス成長を加速するウェブ開発戦略</h2>
        <p className="leading-8 pt-4 text-xl">
          当社は技術とデザインの融合で、魅力的かつ効果的なウェブサイトを提供します。
        </p>
        <p className="text-xl">最新技術、クリエイティブなデザインを通じて、</p>
        <p className="text-xl">
          お客様のビジネスニーズに最適なデジタルプレゼンスを構築します。
        </p>
        <p className="text-xl">
          時間通りのデリバリーと継続的なサポートで、成功への道を共に歩みましょう。お気軽にご相談ください。
        </p>
      </div>
    </AreaTemplate>
  );
}
