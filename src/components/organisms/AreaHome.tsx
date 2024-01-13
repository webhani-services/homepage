import AreaTemplate from "@/components/templates/AreaTemplate";
import Image from "next/image";
import Link from "next/link";

export default function AreaHome() {
  return (
    <AreaTemplate isEven={false} sectionId={"area-intr"}>
      <div className="sm:px-10 lg:px-20 xl:px-40 2xl:px-56">
        <h1>
          <div className="flex flex-col items-center mt-10">
            <div className="text-5xl">アイデアからウェブの現実まで、</div>
            <div className="text-5xl">一歩先を行く。</div>
          </div>
        </h1>

        <div className="flex items-center mt-10 md:px-32">
          <span className="text-2xl">
            アイデアからウェブの現実まで、創造性と技術で先駆的な一歩。未知の領域を切り拓き、ユーザー体験の革新を牽引します。
          </span>
        </div>

        <div className="flex flex-nowrap justify-center space-x-3 pt-5 pb-10">
          <div>
            <Image
              src="/home/home-parts-01.png"
              alt="home-01"
              className="dark:invert"
              width={225}
              height={344}
            />
          </div>
          <div>
            <Image
              src="/home/home-parts-02.png"
              alt="home-02"
              className="dark:invert"
              width={452}
              height={344}
            />
          </div>
          <div>
            <div className="relative">
              <div className="absolute top-0 left-0">
                <Link href="#area-system-development">
                  <button className="px-1 py-1 sm:px-12 sm:py-3 lg:px-14 lg:py-5 xl:px-14 xl:py-4 2xl:px-18 2xl:py-6 rounded-2xl bg-rose-500 text-white hover:bg-white hover:border-2 hover:border-rose-500 hover:text-rose-500 text-sm sm:text-sm lg:text-lg xl:text-xl font-semibold">
                    もっと詳しく
                  </button>
                </Link>
              </div>
              <Image
                src="/home/home-parts-03.png"
                alt="home-03"
                className="dark:invert"
                width={488}
                height={344}
              />
            </div>
          </div>
        </div>
      </div>
    </AreaTemplate>
  );
}
