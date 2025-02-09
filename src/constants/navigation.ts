import { NavigationItem } from "@/types/navigation";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "企業情報", href: "#about" },
  { name: "企業理念", href: "#corporate-philosophy" },
  {
    name: "サービス",
    href: "#services",
    children: [
      { name: "Webアプリケーション開発", href: "#web-development" },
      { name: "ITコンサルティング", href: "#consulting" },
      { name: "IT教育", href: "#education" },
      { name: "デジタルコンテンツ開発", href: "#digital-content" },
      { name: "受託開発", href: "#outsourcing" },
    ],
  },
  { name: "実績", href: "#works" },
  { name: "お問い合わせ", href: "#contact" },
];
