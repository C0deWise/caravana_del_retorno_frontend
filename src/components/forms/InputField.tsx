import React, { InputHTMLAttributes, ReactNode, useId } from "react";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  hasError?: boolean;
  errorClassName?: string;
  rightElement?: ReactNode;
}

export function InputField({
  label,
  errorMessage,
  hasError,
  errorClassName = "absolute -bottom-5 left-1",
  rightElement,
  className = "",
  id,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const isDateEmpty = props.type === "date" && !props.value;
  const textColor = isDateEmpty ? "text-gray-400/60" : "text-gray-900";

  const baseInputClass =
    `w-full px-4 py-3 rounded-xl border bg-white ${textColor} transition-all outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400/60 disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed`;
  const errorInputClass = hasError
    ? "border-accent-red focus:border-accent-red"
    : "border-gray-300 focus:border-primary hover:border-gray-400";
    
  const inputClass = `${baseInputClass} ${errorInputClass} ${rightElement ? "pr-10" : ""} ${className}`;

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input id={inputId} className={inputClass} {...props} />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            {rightElement}
          </div>
        )}
      </div>
      {hasError && errorMessage && (
        <p className={`text-accent-red text-xs font-medium z-10 ${errorClassName}`}>{errorMessage}</p>
      )}
    </div>
  );
}
