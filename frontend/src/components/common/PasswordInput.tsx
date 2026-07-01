import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useState,
} from "react";

interface PasswordInputProps {
  value: string;

  onChange: (
    value: string,
  ) => void;

  placeholder?: string;

  className?: string;

  autoComplete?: string;

  onFocus?: () => void;

  onBlur?: () => void;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  className = "",
  autoComplete,
  onFocus,
  onBlur,
}: PasswordInputProps) => {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  return (
    <div className="relative flex items-center gap-3">
      <input
        type={
          showPassword
            ? "text"
            : "password"
        }
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value,
          )
        }
        placeholder={
          placeholder
        }
        autoComplete={
          autoComplete
        }
        onFocus={onFocus}
        onBlur={onBlur}
        className={`${className} pr-12`}
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword(
            (
              prev,
            ) => !prev,
          )
        }
        className="absolute right-0 text-white/25 hover:text-white/70 transition-colors shrink-0"
      >
        {showPassword ? (
          <EyeOff
            size={18}
          />
        ) : (
          <Eye
            size={18}
          />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;