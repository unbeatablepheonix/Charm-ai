import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { signOut } from "@/lib/auth-client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PaywallModal({ open, onClose }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const features = [
    "Bio Boost — 3 polished rewrites of your dating profile",
    "Unlimited openers, replies & advice",
    "Profile deep-reads with actionable tips",
    "Story replies that actually land",
  ];

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      const data = await api.post<{ url: string }>("/api/checkout/create", {
        successUrl: `${window.location.origin}/app?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/app`,
      });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] border border-border/60 bg-card p-0 shadow-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "rounded-lg sm:max-w-md"
          )}
        >
          {/* Header gradient strip */}
          <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 via-accent/10 to-card px-6 pb-5 pt-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/15 ring-1 ring-amber-400/30">
                <Crown className="h-[18px] w-[18px] text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Charm Premium</p>
                <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Unlock full access</h2>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-6 pb-6 pt-4">
            {/* Features list */}
            <ul className="space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-2.5 w-2.5 text-primary" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="rounded-xl border border-border/50 bg-background/50 px-4 py-3.5 text-center">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                3-day free trial
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Then <span className="font-semibold text-foreground">$8 / week</span> · Cancel anytime
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={() => void handleStartTrial()}
              disabled={isLoading}
              className="h-12 w-full rounded-full bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Redirecting…" : "Start free trial"}
            </Button>
            <button
              type="button"
              onClick={() => void signOut().then(() => { window.location.href = "/"; })}
              className="block w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
