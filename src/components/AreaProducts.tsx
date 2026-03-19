"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getRevealDelayClass } from "@/lib/constants";

const PRODUCTS_DATA = [
  {
    id: "ourAssets",
    image: "/images/products/our-assets-screenshot.png",
    url: "https://www.our-assets.click/",
  },
  {
    id: "pagify",
    image: "/images/products/pagify-screenshot.png",
    url: "https://pagify.click/",
  },
] as const;

type ProductCardProps = {
  product: (typeof PRODUCTS_DATA)[number];
  index: number;
  t: (key: string) => string;
};

const ProductCard = ({ product, index, t }: ProductCardProps) => (
  <div
    className={`reveal ${getRevealDelayClass(index)} group bg-white dark:bg-[var(--dark-surface-elevated)] rounded-2xl overflow-hidden
    border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800
    transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5`}
  >
    <div className="relative aspect-video overflow-hidden">
      <Image
        src={product.image}
        alt={t(`items.${product.id}.name`)}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {t(`items.${product.id}.name`)}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
        {t(`items.${product.id}.description`)}
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {(t(`items.${product.id}.badges`) as unknown as string)
          .split(",")
          .map((badge) => (
            <span
              key={badge}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
            >
              {badge.trim()}
            </span>
          ))}
      </div>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
      >
        {t("visitSite")}
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </a>
    </div>
  </div>
);

export default function AreaProducts() {
  const t = useTranslations("products");
  const revealRef = useScrollReveal();

  return (
    <section
      id="products"
      className="section-padding bg-white dark:bg-[var(--dark-bg)] relative"
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="reveal text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
            Products
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {t("title")}
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS_DATA.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
