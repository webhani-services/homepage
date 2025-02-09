export type Work = {
  title: string;
  category: string;
  image: string;
};

export const works: Work[] = [
  {
    title: "企業向けクラウド基盤構築",
    category: "クラウド",
    image: "/images/works/cloud.jpg",
  },
  {
    title: "ECサイトリニューアル",
    category: "Web開発",
    image: "/images/works/ec.jpg",
  },
  {
    title: "業務効率化システム開発",
    category: "システム開発",
    image: "/images/works/system.jpg",
  },
];
