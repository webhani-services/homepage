import { useForm } from "react-hook-form";
import { FormInputs } from "@/types/contact";

type ContactFormProps = {
  onSubmit: (data: FormInputs) => Promise<void>;
  isSubmitting: boolean;
};

const FORM_VALIDATION = {
  name: { required: "お名前は必須です" },
  email: {
    required: "メールアドレスは必須です",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "有効なメールアドレスを入力してください",
    },
  },
  message: { required: "お問い合わせ内容は必須です" },
};

export function ContactForm({ onSubmit, isSubmitting }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmitHandler = async (data: FormInputs) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form
      className="space-y-6 fade-in"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          お名前
        </label>
        <input
          {...register("name", FORM_VALIDATION.name)}
          type="text"
          id="name"
          className="form-input"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          メールアドレス
        </label>
        <input
          {...register("email", FORM_VALIDATION.email)}
          type="email"
          id="email"
          className="form-input"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-gray-700 font-medium mb-2"
        >
          お問い合わせ内容
        </label>
        <textarea
          {...register("message", FORM_VALIDATION.message)}
          id="message"
          rows={6}
          className="form-input"
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
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
  );
}
