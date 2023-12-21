import AreaTemplate from "@/components/templates/AreaTemplate";

const menuData = [
  {
    title: "新卒採用",
    body: "今年３が月までに大学院・大学・短期大学・専門学校を総つ業予定の方対象",
    link: "#",
  },
  {
    title: "中途採用",
    body: "詳細はリクルートページより後買う人ください",
    link: "#",
  },
  {
    title: "契約採用",
    body: "詳細はリクルートページよりご各員んください",
    link: "#",
  },
  {
    title: "アルバイト採用",
    body: "詳細はリクルートページよりご各員んください",
    link: "#",
  },
];

type MenuDatum = {
  title: string;
  body: string;
  link: string;
};

export default function AreaRecruit() {
  const menuComponent = (menuDatum: MenuDatum) => {
    return (
      <div className="card card-compact w-30 sm:w-42 lg:w-42 xl:w-50 bg-base-100 shadow-xl ">
        <div className="card-body">
          <h2 className="card-title">{menuDatum.title}</h2>
          <p className="">{menuDatum.body}</p>
          <div className="card-actions justify-end mt-5">
            {/* <Link href={menuDatum.link}> */}
            <button className="btn bg-rose-500 text-white hover:bg-white hover:border-rose-500 hover:text-rose-500">
              リクルートページ
            </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AreaTemplate isEven={true} sectionId={"area-recruit"}>
      <div className="py-6">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl text-white">リクルート</h2>
          <hr className="border-4 my-3 border-white w-12 rounded mb-10" />
        </div>

        <div className="grid grid-cols-2 gap-2 lg:gap-x-4 lg:gap-y-6 xl:gap-x-16 sm:px-10 lg:px-20 xl:px-40 2xl:px-56">
          {menuData.map((menuDatum: MenuDatum, idx: number) => {
            return (
              <div key={idx} className="">
                {menuComponent(menuDatum)}
              </div>
            );
          })}
        </div>
      </div>
    </AreaTemplate>
  );
}
