"use client";
import React, { useState } from "react";
import { FormInputs, SubmitStatus } from "@/types/contact";
import { ContactForm } from "./area-contact/ContactForm";

export default function AreaContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });

  const handleSubmit = async (data: FormInputs) => {
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

        <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
}
