import { FileText, Image, UploadCloud, X } from "lucide-react";

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

interface DocumentFileInputProps {
  label: string;
  helper?: string;
  file: File | null;
  required?: boolean;
  onChange: (file: File | null) => void;
  onPreview?: (url: string) => void;
  onError?: (message: string) => void;
}

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function DocumentFileInput({
  label,
  helper,
  file,
  required = false,
  onChange,
  onPreview,
  onError,
}: DocumentFileInputProps) {
  const selectFile = (nextFile?: File) => {
    if (!nextFile) {
      onChange(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      onError?.("Upload a JPG, PNG, WebP, or PDF document");
      return;
    }

    if (nextFile.size > MAX_DOCUMENT_SIZE) {
      onError?.("Document must be 10 MB or smaller");
      return;
    }

    onChange(nextFile);
  };

  const preview = () => {
    if (!file || !onPreview) return;

    onPreview(URL.createObjectURL(file));
  };

  const FileIcon = file?.type === "application/pdf" ? FileText : Image;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">
          {label}
          {required && <span className="text-red-300"> *</span>}
        </label>
        <span className="text-xs text-white/30">JPG, PNG, WebP, PDF</span>
      </div>

      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-4 py-5 text-center transition hover:border-white/35 hover:bg-white/[0.05]">
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />

        {!file ? (
          <>
            <UploadCloud size={24} className="text-white/55" />
            <p className="mt-3 text-sm font-medium text-white">Choose document</p>
            {helper && <p className="mt-1 max-w-sm text-xs text-white/35">{helper}</p>}
          </>
        ) : (
          <div className="flex w-full items-center gap-3 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-black">
              <FileIcon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              <p className="mt-1 text-xs text-white/40">{formatBytes(file.size)}</p>
            </div>
          </div>
        )}
      </label>

      {file && (
        <div className="flex flex-wrap gap-2">
          {onPreview && (
            <button
              type="button"
              onClick={preview}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05]"
            >
              Preview selected
            </button>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-200 hover:bg-red-400/10"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
