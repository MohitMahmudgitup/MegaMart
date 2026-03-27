import { InputHTMLAttributes, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  icon?: boolean | ReactNode;
  flag?: boolean;
  onIconClick?: () => void;
  register?: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  defaultValue,
  error,
  icon,
  flag,
  onIconClick,
  register,
  className = "",
  ...rest
}: InputFieldProps) => {
  return (
    <div className="w-full">
     

      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full border rounded-full px-4 py-[10px] pr-10 focus:outline-none 
            focus:ring-2 focus:ring-black ${className}`}
          {...(register || {})}
          {...rest}
        />

        {/* Icon */}
        {icon && typeof icon !== "boolean" && (
          <button
            type="button"
            className="absolute right-2 top-3 p-1"
            onClick={onIconClick}
          >
            {icon}
          </button>
        )}

        {/* Flag */}
        {flag && <span className="absolute right-2 top-2 text-sm">🇺🇸</span>}
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
