import { UploadCloud } from "lucide-react";
import { ReactNode } from "react";

interface DocumentUploadPanelProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function DocumentUploadPanel({
  children,
  title,
  description,
}: DocumentUploadPanelProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
          <UploadCloud size={18} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/45">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
