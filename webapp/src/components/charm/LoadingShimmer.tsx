const LINES = [
  "Reading the room…",
  "Looking for what's specific…",
  "Drafting three angles…",
  "Tuning the tone…",
];

export function LoadingShimmer() {
  return (
    <div className="space-y-5">
      <div className="border-b border-border/50 pb-5">
        <div className="h-2 w-24 animate-pulse rounded bg-muted/60" />
        <div className="mt-3 h-9 w-2/3 animate-pulse rounded bg-muted/40" />
      </div>
      <div className="h-16 animate-pulse rounded-xl bg-card/50" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="space-y-3 rounded-2xl border border-border/50 bg-card/40 p-5"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex gap-2">
            <div className="h-4 w-10 animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted/40" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-muted/40" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-muted/40" />
          </div>
        </div>
      ))}
      <div className="flex flex-col items-center gap-1 pt-2">
        {LINES.map((line, i) => (
          <p
            key={line}
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70"
            style={{
              animation: `fade-up 0.4s ${i * 0.2}s ease-out both`,
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
