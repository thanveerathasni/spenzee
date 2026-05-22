







import { motion } from "framer-motion";

interface Props { loading: boolean; isDirty: boolean; }

export default function SaveIndicator({ loading, isDirty }: Props) {
  const color = loading ? "#ffffff" : isDirty ? "#f59e0b" : "#22c55e";
  const label = loading ? "Saving..." : isDirty ? "Unsaved changes" : "Saved";

  return (
    <div className="flex items-center gap-2 text-sm">
      <motion.div
        animate={{ scale: loading ? [1, 1.4, 1] : 1, backgroundColor: color }}
        transition={{ repeat: loading ? Infinity : 0, duration: 0.8 }}
        className="w-2 h-2 rounded-full"
      />
      <span className="text-white/40 text-xs">{label}</span>
    </div>
  );
}