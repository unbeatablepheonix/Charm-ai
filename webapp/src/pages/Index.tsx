import { useState } from "react";
import { ArrowRight, Sparkle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/charm/Wordmark";
import { ModeTabs } from "@/components/charm/ModeTabs";
import { ToneSelect } from "@/components/charm/ToneSelect";
import { ContextField } from "@/components/charm/ContextField";
import { PhotoUpload } from "@/components/charm/PhotoUpload";
import { ResultPanel } from "@/components/charm/ResultPanel";
import { LoadingShimmer } from "@/components/charm/LoadingShimmer";
import { PaywallModal } from "@/components/charm/PaywallModal";
import { SettingsSheet } from "@/components/charm/SettingsSheet";
import { useCoach } from "@/hooks/use-coach";
import { useTheme } from "@/hooks/use-theme";
import { getMode } from "@/lib/coach-modes";
import type { CoachMode, CoachTone } from "@/lib/coach-types";

const Index = () => {
  useTheme();
  const [mode, setMode] = useState<CoachMode>("opener");
  const [context, setContext] = useState<string>(() => localStorage.getItem("charm-context") ?? "");
  const [tone, setTone] = useState<CoachTone[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("charm-imageUrls") ?? "[]");
    } catch {
      return [];
    }
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() =>
    localStorage.getItem("charm-unlocked") === "true"
  );
  const [showPaywall, setShowPaywall] = useState<boolean>(
    localStorage.getItem("charm-unlocked") !== "true"
  );

  const coach = useCoach();
  const currentMode = getMode(mode);

  const handleContextChange = (val: string) => {
    setContext(val);
    localStorage.setItem("charm-context", val);
  };

  const handleAddImage = (url: string) => {
    const next = [...imageUrls, url];
    setImageUrls(next);
    localStorage.setItem("charm-imageUrls", JSON.stringify(next));
  };

  const handleRemoveImage = (url: string) => {
    const next = imageUrls.filter((u) => u !== url);
    setImageUrls(next);
    localStorage.setItem("charm-imageUrls", JSON.stringify(next));
  };

  const handleSubmit = () => {
    if (!context.trim() || coach.isPending) return;
    coach.mutate({ mode, context: context.trim(), tone: tone.length > 0 ? tone : undefined, imageUrls: imageUrls.length > 0 ? imageUrls : undefined });
  };

  const handleUnlock = () => {
    localStorage.setItem("charm-unlocked", "true");
    setIsUnlocked(true);
    setShowPaywall(false);
  };

  const handleReset = () => {
    coach.reset();
    setContext("");
    setImageUrls([]);
    localStorage.removeItem("charm-context");
    localStorage.removeItem("charm-imageUrls");
  };

  const handleRegenerate = () => {
    if (!context.trim()) return;
    coach.mutate({ mode, context: context.trim(), tone: tone.length > 0 ? tone : undefined, imageUrls: imageUrls.length > 0 ? imageUrls : undefined });
  };

  const handleModeChange = (m: CoachMode) => {
    setMode(m);
    coach.reset();
  };

  const useExample = () => {
    handleContextChange(currentMode.example);
  };

  return (
    <div className="grain relative min-h-screen">
      {/* atmospheric blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full bg-primary/[0.07] blur-3xl animate-ember" />
        <div
          className="absolute -bottom-40 -right-20 h-[480px] w-[480px] rounded-full bg-accent/[0.06] blur-3xl animate-ember"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-5 pb-24 pt-7 md:px-8 md:pt-10">
        <nav className="flex items-center justify-between">
          <Wordmark />
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                powered by gpt-5.2
              </span>
            </div>
            <SettingsSheet />
          </div>
        </nav>

        <section className="mt-14 flex flex-col items-center text-center md:mt-20">
          {/* Badge pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5">
            <Sparkle className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-semibold text-primary">AI-powered dating assistant</span>
          </div>

          {/* Headline */}
          <h1 className="font-hero max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-foreground">Stop overthinking.</span>
            <br />
            <span className="text-primary">Start connecting.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Charm uses AI to craft story replies, conversation openers, and profile
            rewrites that actually sound like you — just a better you.
          </p>

          {/* CTA row */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => document.getElementById("charm-form")?.scrollIntoView({ behavior: "smooth" })}
              className="h-12 rounded-full bg-foreground px-8 text-base font-bold text-background hover:bg-foreground/90"
            >
              Get started free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">No account needed. No credit card.</span>
          </div>

          {/* Social proof */}
          <div className="mt-7 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Loved by 10,000+ singles</span>
          </div>
        </section>

        <main id="charm-form" className="mt-12 grid gap-10">
          <div className="space-y-5">
            <div>
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Step 1 · What do you need
              </p>
              <ModeTabs value={mode} onChange={handleModeChange} />
            </div>

            <div>
              <div className="mb-2.5 flex items-end justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Step 2 · The situation
                </p>
                <button
                  type="button"
                  onClick={useExample}
                  className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
                >
                  Try an example →
                </button>
              </div>
              <ContextField
                value={context}
                onChange={handleContextChange}
                placeholder={currentMode.placeholder}
              />
            </div>

            <div>
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Step 3 · Add a photo (optional)
              </p>
              <PhotoUpload
                imageUrls={imageUrls}
                onAdd={handleAddImage}
                onRemove={handleRemoveImage}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Step 4 · Tone (optional)
                </p>
                <ToneSelect value={tone} onChange={(tones) => setTone(tones)} />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!context.trim() || coach.isPending}
                size="lg"
                className="group h-12 gap-2 rounded-full bg-primary px-6 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {coach.isPending ? "Thinking…" : currentMode.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>

          {coach.isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              <p className="font-medium">Something went sideways.</p>
              <p className="mt-1 text-destructive-foreground/80">
                {coach.error?.message ?? "Try again in a moment."}
              </p>
            </div>
          ) : null}

          {coach.isPending ? <LoadingShimmer /> : null}

          {coach.data && !coach.isPending ? (
            <div style={{ animation: "fade-up 0.5s ease-out both" }}>
              <ResultPanel
                response={coach.data}
                onReset={handleReset}
                onRegenerate={handleRegenerate}
                loading={coach.isPending}
              />
            </div>
          ) : null}

        </main>

        <footer className="mt-20 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            Treat her like a whole person. Specifics &gt; cleverness. No means no, every time.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">made with care</p>
        </footer>
      </div>

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUnlock={handleUnlock}
      />
    </div>
  );
};


export default Index;
