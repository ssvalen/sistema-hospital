import React from "react";

interface CheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label
      className={`
        flex gap-3 p-4 rounded-2xl border cursor-pointer transition
        ${checked
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-slate-200 hover:border-slate-300"
        }
      `}
    >
      <input type="checkbox" checked={checked} onChange={onChange} />

      <div>
        {label}
      </div>
    </label>
  );
};

export default Checkbox;