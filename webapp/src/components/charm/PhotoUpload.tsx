import { useRef } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  imageUrl: string | undefined;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export function PhotoUpload({ imageUrl, onUpload, onRemove }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const upload = useMutation({
    mutationFn: uploadFile,
    onSuccess: (result) => {
      onUpload(result.url);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload.mutate(file);
    // Reset input so the same file can be re-selected after removal
    e.target.value = "";
  };

  const handleZoneClick = () => {
    if (imageUrl || upload.isPending) return;
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
    upload.reset();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {imageUrl ? (
        <div className="relative inline-block">
          <div className="group relative h-20 w-20 overflow-hidden rounded-xl border border-border/60 bg-card/40">
            <img
              src={imageUrl}
              alt="Uploaded photo"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm transition-colors hover:border-destructive/60 hover:text-destructive"
            aria-label="Remove photo"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
            Photo added
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleZoneClick}
          disabled={upload.isPending}
          className={cn(
            "flex h-16 w-full items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/30 transition-colors",
            upload.isPending
              ? "cursor-default opacity-70"
              : "cursor-pointer hover:border-primary/40 hover:bg-card/50"
          )}
        >
          {upload.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.5} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                Add a photo (optional)
              </span>
            </>
          )}
        </button>
      )}

      {upload.isError ? (
        <p className="mt-1.5 text-[11px] text-destructive-foreground/80">
          {upload.error instanceof Error ? upload.error.message : "Upload failed — try again."}
        </p>
      ) : null}
    </div>
  );
}
