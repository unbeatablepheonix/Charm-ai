import { Link } from "react-router-dom";

export function Wordmark() {
  return (
    <Link to="/" className="group inline-flex items-baseline gap-2">
      <span className="font-display text-3xl leading-none tracking-tight text-foreground">
        Charm
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-primary transition-all group-hover:scale-150 group-hover:bg-accent" />
      <span className="hidden sm:inline text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        AI conversation coach
      </span>
    </Link>
  );
}
