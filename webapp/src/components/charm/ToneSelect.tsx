import { cn } from "@/lib/utils";
import type { CoachTone } from "@/lib/coach-types";

const TONES: { id: CoachTone; label: string }[] = [
  { id: "sincere", label: "Sincere" },
  { id: "playful", label: "Playful" },
  { id: "witty", label: "Witty" },
  { id: "confident", label: "Confident" },
];

interface Props {
  value: CoachTone | undefined;
  onChange: (tone: CoachTone | undefined) => void;
}

export function ToneSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Tone
      </span>
      {TONES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(active ? undefined : t.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              active
                ? "border-accent/60 bg-accent/15 text-accent"
                : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
