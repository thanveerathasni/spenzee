import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type {
  ReactNode,
} from "react";

interface FormFieldProps {
  id: string;

  label: string;

  activeField:
    | string
    | null;

  error?: string;

  children: ReactNode;
}

const FormField = ({
  id,
  label,
  activeField,
  error,
  children,
}: FormFieldProps) => {
  return (
    <div
      className={`border-t transition-colors duration-300 ${
        activeField === id
          ? "border-white/60"
          : "border-white/10"
      }`}
    >
      <div className="pt-5 pb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-white/35 mb-3">
          {label}
        </label>

        {children}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="text-[11px] text-red-400 pb-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField;