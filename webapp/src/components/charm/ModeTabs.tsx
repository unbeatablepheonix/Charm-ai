import { cn } from "@/lib/utils";
import { COACH_MODES } from "@/lib/coach-modes";
import type { CoachMode } from "@/lib/coach-types";

interface Props {
  value: CoachMode;
  onChange: (mode: CoachMode) => void;
}

export function ModeTabs({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {COACH_MODES.map((mode) => {
        const Icon = mode.icon;
        const active = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={cn(
              "group relative flex flex-col items-start gap-1 rounded-xl border px-4 py-3.5 text-left transition-all",
              active
                ? "border-primary/50 bg-primary/[0.08] shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
                : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
            )}
          >
            <div className="flex items-center gap-2">
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
                strokeWidth={1.5}
              />
              <span
                className={cn(
                  "text-sm font-medium tracking-tight",
                  active ? "text-foreground" : "text-foreground/80"
                )}
              >
                {mode.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{mode.tagline}</span>
          </button>
        );
      })}
    </div>
  );
}
