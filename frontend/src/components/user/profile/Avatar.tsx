import { motion } from "framer-motion";

interface Props {
  name?: string;
  image?: string;
}

export default function Avatar({ name, image }: Props) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      className="w-16 h-16 rounded-full overflow-hidden bg-black text-white flex items-center justify-center"
    >
      {image ? (
        <img src={image} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </motion.div>
  );
}