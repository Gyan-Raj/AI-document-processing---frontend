import { ButtonHTMLAttributes } from "react";

export interface ButtonWithSpinnerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "danger" | "default";
  isLoading?: boolean;
  text: string;
  loadingText?: string;
}

const variants = {
  default: "bg-green-400 hover:bg-green-500 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

export function ButtonWithSpinner({
  type = "button",
  variant = "default",
  isLoading = false,
  text,
  loadingText = "Loading...",
  className = "",
  disabled,
  ...props
}: ButtonWithSpinnerProps) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md px-4 py-2 text-sm font-medium
        transition active:scale-95
        disabled:cursor-not-allowed disabled:opacity-70
        cursor-pointer
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Spinner />}

      {isLoading ? loadingText : text}
    </button>
  );
}

export function Spinner() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
