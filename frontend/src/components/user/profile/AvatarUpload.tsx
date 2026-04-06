import { useRef } from "react";
import { Camera } from "lucide-react";

interface Props {
  image?: string;
  onChange: (file: File) => void;
}

export default function AvatarUpload({ image, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange(file);
  };

  return (
    <div className="relative w-28 h-28 cursor-pointer group">

      {/* IMAGE */}
      <img
        src={image || "/default-avatar.png"}
        className="w-full h-full object-cover rounded-full border"
      />

      {/* OVERLAY */}
      <div
        onClick={handleClick}
        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
      >
        <Camera size={20} className="text-white" />
      </div>

      {/* INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}