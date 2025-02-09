export type FormInputs = {
  name: string;
  email: string;
  message: string;
};

export type SubmitStatus = {
  type: "success" | "error" | null;
  message: string;
};
