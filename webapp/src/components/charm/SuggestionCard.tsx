import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoachSuggestion } from "@/lib/coach-types";

interface Props {
  suggestion: CoachSuggestion;
  index: number;
}

export function SuggestionCard({ suggestion, index }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-border"
      style={{ animation: `fade-up 0.5s ${index * 0.08}s ease-out both` }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-accent/30 bg-accent/[0.08] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-accent/90">
            {suggestion.label}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] transition-all",
            copied
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border/70 text-muted-foreground opacity-0 group-hover:opacity-100 hover:border-border hover:text-foreground"
          )}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="font-display text-[1.35rem] leading-snug text-foreground text-balance">
        &ldquo;{suggestion.text}&rdquo;
      </p>

      <div className="mt-4 flex items-start gap-2 border-t border-border/40 pt-3">
        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">{suggestion.why}</p>
      </div>
    </div>
  );
}
