import { useRef } from "react";

interface Props {
  value: string[];
  setValue: (val: string[]) => void;
}

const OtpInput = ({ value, setValue }: Props) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValue = [...value];
    newValue[index] = val;
    setValue(newValue);

    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {value.map((digit, i) => (
        <input
          key={i}
ref={(el) => {
  inputs.current[i] = el;
}}          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-lg border rounded-xl focus:ring-2 focus:ring-black outline-none"
        />
      ))}
    </div>
  );
};

export default OtpInput;