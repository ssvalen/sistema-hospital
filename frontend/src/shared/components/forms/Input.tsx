import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const base =
  "w-full h-12 px-4 rounded-2xl text-sm border transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100";

const normal =
  "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 focus:border-blue-400";

const disabled =
  "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed";

const Input: React.FC<InputProps> = ({ invalid, disabled, className = "", ...props }) => {
  return (
    <input
      {...props}
      disabled={disabled}
      className={[
        base,
        disabled ? disabled : normal,
        className
      ].join(" ")}
    />
  );
};

export default Input;