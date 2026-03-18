"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

export type ContactFormInputs = {
  name: string;
  email: string;
  message: string;
};

export type SubmitStatus = {
  type: "success" | "error" | null;
  message: string;
};

export function useContactForm() {
  const t = useTranslations("contact.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = body?.error ?? t("error");
        throw new Error(message);
      }

      setSubmitStatus({ type: "success", message: t("success") });
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("error");
      setSubmitStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    isSubmitting,
    submitStatus,
    errors,
  };
}
