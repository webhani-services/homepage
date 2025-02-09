"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  name: string;
  email: string;
  message: string;
};

export default function AreaContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("送信に失敗しました");

      setSubmitStatus({
        type: "success",
        message: "お問い合わせを送信しました。",
      });
      reset();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "エラーが発生しました。もう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="heading-primary text-center">お問い合わせ</h2>
        <p className="paragraph text-center mb-12">
          ご質問やご相談がございましたら、お気軽にお問い合わせください
        </p>

        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded ${
              submitStatus.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form className="space-y-6 fade-in" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              お名前
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              id="name"
              className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              メールアドレス
            </label>
            <input
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              type="email"
              id="email"
              className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-gray-700 font-medium mb-2"
            >
              お問い合わせ内容
            </label>
            <textarea
              {...register("message", { required: true })}
              id="message"
              rows={6}
              className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto md:px-12 py-3 bg-yellow-300 hover:bg-yellow-400
              text-gray-900 font-medium rounded-lg transition-all duration-300
              shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
