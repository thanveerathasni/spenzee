import { motion } from "framer-motion";

interface Props {
  loading: boolean;
  isDirty: boolean;
}

export default function SaveIndicator({ loading, isDirty }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm">

      {/* DOT */}
      <motion.div
        animate={{
          scale: loading ? [1, 1.4, 1] : 1,
          backgroundColor: loading
            ? "#000"
            : isDirty
            ? "#f59e0b"
            : "#16a34a",
        }}
        transition={{
          repeat: loading ? Infinity : 0,
          duration: 0.8,
        }}
        className="w-2.5 h-2.5 rounded-full"
      />

      {/* TEXT */}
      <span className="text-gray-500">
        {loading && "Saving..."}
        {!loading && isDirty && "Unsaved changes"}
        {!loading && !isDirty && "Saved"}
      </span>
    </div>
  );
}