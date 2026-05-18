import { Eye, Lightbulb, RotateCcw } from "lucide-react";
import { SuggestionCard } from "./SuggestionCard";
import { Button } from "@/components/ui/button";
import type { CoachResponse } from "@/lib/coach-types";

interface Props {
  response: CoachResponse;
  onReset: () => void;
  onRegenerate: () => void;
  loading: boolean;
}

export function ResultPanel({ response, onReset, onRegenerate, loading }: Props) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 border-b border-border/50 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            The read
          </p>
          <h2 className="font-display text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
            {response.headline}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={loading}
            className="border-border/70"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            New
          </Button>
        </div>
      </header>

      <div
        className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/40 p-4"
        style={{ animation: "fade-up 0.4s ease-out both" }}
      >
        <Eye className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
        <p className="text-sm leading-relaxed text-foreground/85">{response.read}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {response.suggestions.map((s, i) => (
          <SuggestionCard key={i} suggestion={s} index={i} />
        ))}
      </div>

      {response.tips.length > 0 ? (
        <div
          className="rounded-2xl border border-border/40 bg-gradient-to-br from-card/40 to-card/10 p-5"
          style={{ animation: "fade-up 0.5s 0.3s ease-out both" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" strokeWidth={1.5} />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Pocket tips
            </p>
          </div>
          <ul className="space-y-2.5">
            {response.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
