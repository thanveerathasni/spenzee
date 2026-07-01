import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useState,
} from "react";
import {
  FileUp,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import { bankStatementApi } from "../../api/bankStatement.api";
import type {
  UploadBankStatementsResult,
} from "../../types/financial";

interface StatementUploadPanelProps {
  onUploaded: (
    result: UploadBankStatementsResult,
  ) => void;
}

const maxFileSize =
  15 * 1024 * 1024;

export default function StatementUploadPanel({
  onUploaded,
}: StatementUploadPanelProps) {
  const [files, setFiles] = useState<
    File[]
  >([]);
  const [progress, setProgress] =
    useState(0);
  const [uploading, setUploading] =
    useState(false);

  const fileNames = useMemo(
    () =>
      files
        .map((file) => file.name)
        .join(", "),
    [files],
  );

  const handleFiles = (
    nextFiles: FileList | File[],
  ) => {
    const selected =
      Array.from(nextFiles);

    const valid =
      selected.filter((file) => {
        if (file.size > maxFileSize) {
          toast.error(
            `${file.name} exceeds 15MB`,
          );
          return false;
        }

        return true;
      });

    setFiles(valid);
  };

  const onInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  const onDrop = (
    event: DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const upload = async () => {
    if (files.length === 0) {
      toast.error(
        "Choose at least one statement",
      );
      return;
    }

    try {
      setUploading(true);
      const result =
        await bankStatementApi.upload(
          files,
          setProgress,
        );

      if (result.rejected.length > 0) {
        toast.error(
          result.rejected[0].reason,
        );
      } else {
        toast.success(
          "Statement analysis started",
        );
      }

      setFiles([]);
      setProgress(0);
      onUploaded(result);
    } catch {
      toast.error(
        "Statement upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.32em] text-black/30">
            Financial Insights
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-black">
            Statements
          </h2>
        </div>
        <button
          type="button"
          onClick={upload}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:bg-black/30"
        >
          <FileUp size={16} />
          {uploading
            ? "Uploading"
            : "Analyze"}
        </button>
      </div>

      <label
        onDragOver={(event) =>
          event.preventDefault()
        }
        onDrop={onDrop}
        className="mt-5 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02] px-6 text-center transition hover:bg-black/[0.04]"
      >
        <UploadCloud
          size={28}
          className="text-black/50"
        />
        <p className="mt-3 text-sm font-bold text-black">
          Drop PDF, CSV, or Excel statements
        </p>
        <p className="mt-1 text-xs text-black/40">
          Minimum 3 months statement required
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.csv,.xls,.xlsx,application/pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={onInputChange}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div className="mt-4 rounded-xl bg-black/[0.03] p-4">
          <p className="truncate text-xs font-bold text-black/70">
            {fileNames}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-black transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
