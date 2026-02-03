import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string;
}

export default function DashboardCard({ title, value }: Props) {
  return (
    <motion.div
      whileHover={{
        rotateX: 6,
        rotateY: -6,
        scale: 1.03,
      }}
      transition={{ type: "spring", stiffness: 200 }}
      className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl perspective-1000"
    >
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}
