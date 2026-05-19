import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Check, Bug, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/hooks/use-theme";

export function SettingsSheet() {
  const { theme, changeTheme, themes } = useTheme();
  const [bugText, setBugText] = useState("");
  const [bugSent, setBugSent] = useState(false);

  const handleSendBug = () => {
    if (!bugText.trim()) return;
    const subject = encodeURIComponent("Charm App — Bug Report");
    const body = encodeURIComponent(bugText.trim());
    window.open(`mailto:unbeatablephoenix@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setBugSent(true);
    setBugText("");
    setTimeout(() => setBugSent(false), 3000);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          aria-label="Open settings"
        >
          <Settings className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </SheetTrigger>
      <SheetContent className="w-80 border-border/60 bg-card p-0" side="right">
        <SheetHeader className="border-b border-border/50 px-5 py-4">
          <SheetTitle className="text-sm font-medium tracking-tight">Settings</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-5 py-5">
          {/* Theme section */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Appearance
            </p>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => changeTheme(t.id as Theme)}
                    className={cn(
                      "relative flex flex-col gap-2 rounded-xl border p-3 text-left transition-all",
                      active
                        ? "border-primary/50 bg-primary/[0.06] shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
                        : "border-border/60 bg-background/50 hover:border-border"
                    )}
                  >
                    {/* Swatch preview */}
                    <div className="flex gap-1">
                      {t.swatches.map((s, i) => (
                        <div
                          key={i}
                          className="h-4 flex-1 rounded-sm"
                          style={{ backgroundColor: s }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-foreground/90">{t.label}</span>
                    {active ? (
                      <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={2.5} />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Bug report section */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Help & Feedback
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bug className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground/90">Report a bug</span>
              </div>
              <textarea
                value={bugText}
                onChange={(e) => setBugText(e.target.value)}
                placeholder="Describe what went wrong…"
                rows={4}
                className="w-full resize-none rounded-lg border border-border/60 bg-background/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
              <Button
                onClick={handleSendBug}
                disabled={!bugText.trim()}
                size="sm"
                className="w-full gap-2 rounded-full"
              >
                {bugSent ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Email opened
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
