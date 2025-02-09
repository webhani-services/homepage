export type Service = {
  title: string;
  description: string;
  icon: string;
  id: string;
};

export const services: Service[] = [
  {
    title: "Webアプリケーション開発",
    description:
      "最新技術を活用した高品質なWebアプリケーション開発を提供。スケーラブルで保守性の高いシステムを構築します。",
    icon: "/images/services/web-development.svg",
    id: "web-development",
  },
  {
    title: "ITコンサルティング",
    description:
      "お客様のビジネス課題を解決するための最適なIT戦略を提案。デジタルトランスフォーメーションを支援します。",
    icon: "/images/services/consulting.svg",
    id: "consulting",
  },
  {
    title: "IT教育",
    description:
      "実践的なIT教育プログラムを提供。最新技術のトレーニングから、チーム全体のスキルアップまでサポートします。",
    icon: "/images/services/education.svg",
    id: "education",
  },
  {
    title: "デジタルコンテンツ開発",
    description:
      "WebサイトやアプリのUIデザイン、コンテンツ制作まで、魅力的なデジタル体験を創造します。",
    icon: "/images/services/digital-content.svg",
    id: "digital-content",
  },
  {
    title: "受託開発",
    description:
      "お客様のニーズに合わせた柔軟な開発体制で、高品質なシステムを提供。プロジェクト管理から運用保守まで一貫してサポートします。",
    icon: "/images/services/outsourcing.svg",
    id: "outsourcing",
  },
];
