"use client";

import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactForm } from "@/hooks/useContactForm";

const inputClassName = `w-full px-5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl
  focus:ring-2 focus:ring-amber-400/40 dark:focus:ring-amber-500/40 focus:border-amber-400 dark:focus:border-amber-500
  transition-all duration-300 bg-white dark:bg-[var(--dark-surface-elevated)]
  text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600
  outline-none`;

export default function AreaContact() {
  const t = useTranslations("contact");
  const { register, handleSubmit, onSubmit, isSubmitting, submitStatus, errors } =
    useContactForm();
  const revealRef = useScrollReveal();

  return (
    <section id="contact" className="section-padding bg-white dark:bg-[var(--dark-bg)]" ref={revealRef}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="reveal text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
            Contact
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {t("title")}
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-lg text-gray-500 dark:text-gray-400">
            {t("description")}
          </p>
        </div>

        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              submitStatus.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form className="reveal reveal-delay-3 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
              {t("form.name")}
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              id="name"
              className={inputClassName}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{t("form.nameRequired")}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
              {t("form.email")}
            </label>
            <input
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              type="email"
              id="email"
              className={inputClassName}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{t("form.emailRequired")}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
              {t("form.message")}
            </label>
            <textarea
              {...register("message", { required: true })}
              id="message"
              rows={6}
              className={inputClassName + " resize-none"}
            ></textarea>
            {errors.message && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{t("form.messageRequired")}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400
              dark:bg-amber-500 dark:hover:bg-amber-400
              text-gray-900 font-semibold rounded-xl transition-all duration-300
              shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-400/25
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? t("form.submitting") : t("form.submit")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
