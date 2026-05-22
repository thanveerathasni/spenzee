import { X } from "lucide-react";

interface DocumentPreviewModalProps {
  url?: string;
  onClose: () => void;
}

export default function DocumentPreviewModal({ url, onClose }: DocumentPreviewModalProps) {
  if (!url) return null;

  const isPdf = url.toLowerCase().includes(".pdf");

  return (
    <div className="fixed inset-0 z-50 bg-black/80 p-4">
      <div className="mx-auto flex h-full max-w-5xl flex-col gap-3">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-black">
          {isPdf ? (
            <iframe title="Document preview" src={url} className="h-full w-full" />
          ) : (
            <img src={url} alt="Document preview" className="h-full w-full object-contain" />
          )}
        </div>
      </div>
    </div>
  );
}
