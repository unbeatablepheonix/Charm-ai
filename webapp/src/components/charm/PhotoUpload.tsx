import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  imageUrls: string[];
  onAdd: (url: string) => void;
  onRemove: (url: string) => void;
}

export function PhotoUpload({ imageUrls, onAdd, onRemove }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      for (const file of files) {
        const result = await uploadFile(file);
        onAdd(result.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddClick = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-wrap gap-2">
        {imageUrls.map((url) => (
          <div key={url} className="relative inline-block">
            <div className="group relative h-20 w-20 overflow-hidden rounded-xl border border-border/60 bg-card/40">
              <img
                src={url}
                alt="Uploaded photo"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <button
              type="button"
              onClick={() => onRemove(url)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm transition-colors hover:border-destructive/60 hover:text-destructive"
              aria-label="Remove photo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddClick}
          disabled={uploading}
          className={cn(
            "flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/60 bg-card/30 transition-colors",
            uploading
              ? "cursor-default opacity-70"
              : "cursor-pointer hover:border-primary/40 hover:bg-card/50"
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.5} />
          )}
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {uploading ? "Uploading…" : imageUrls.length === 0 ? "Add photo" : "Add more"}
          </span>
        </button>
      </div>

      {error !== null ? (
        <p className="mt-1.5 text-[11px] text-destructive-foreground/80">{error}</p>
      ) : null}
    </div>
  );
}
