import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export function ContextField({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 360)}px`;
  }, [value]);

  return (
    <div className="relative">
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "min-h-[160px] resize-none border-border/60 bg-card/40 px-5 py-4 text-base leading-relaxed",
          "placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-0"
        )}
      />
      <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
        {value.trim().length} chars
      </div>
    </div>
  );
}
