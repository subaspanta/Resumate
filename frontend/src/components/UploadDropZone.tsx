import { useState, useCallback } from "react";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
}

export function UploadDropzone({ onFileSelected }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelected(file);
      e.target.value = ""; // allow re-selecting the same file
    },
    [onFileSelected]
  );

  return (
    <section className="flex justify-center mb-xxl">
      <div
        className={`w-full max-w-[750px] bg-surface rounded-xl py-[64px] flex flex-col items-center justify-center transition-all duration-200 border-2 border-dashed ${
          isDragging ? "border-primary bg-primary-container" : "border-border-input bg-surface"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="region"
        aria-label="Resume upload area"
      >
        <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-lg">
          <span className="material-symbols-outlined text-primary text-[32px]">upload_file</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-text-primary mb-sm font-semibold">
          Upload your existing resume
        </h3>
        <p className="font-body-md text-body-md text-text-muted mb-xl text-center px-lg">
          We'll parse your details and match them with industry standards.
        </p>

        <label className="bg-primary text-white px-xl py-md rounded-lg font-label-std text-label-std hover:opacity-90 active:opacity-80 transition-all flex items-center gap-sm cursor-pointer font-medium">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Upload Resume
          <input
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
        <p className="mt-md font-mono-label text-mono-label text-text-muted font-medium">
          Supported formats: PDF, DOCX (Max 10MB)
        </p>
      </div>
    </section>
  );
}