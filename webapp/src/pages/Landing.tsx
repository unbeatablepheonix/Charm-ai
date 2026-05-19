import { useNavigate } from "react-router-dom";
import { Sparkle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/charm/Wordmark";
import { useTheme } from "@/hooks/use-theme";

export default function Landing() {
  useTheme();
  const navigate = useNavigate();

  return (
    <div className="grain relative min-h-screen">
      {/* Atmospheric blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full bg-primary/[0.07] blur-3xl animate-ember" />
        <div
          className="absolute -bottom-40 -right-20 h-[480px] w-[480px] rounded-full bg-accent/[0.06] blur-3xl animate-ember"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-5 pb-24 pt-7 md:px-8 md:pt-10">
        {/* Nav */}
        <nav className="flex items-center justify-between">
          <Wordmark />
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </button>
        </nav>

        {/* Hero */}
        <section className="mt-14 flex flex-col items-center text-center md:mt-24 lg:mt-32">
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
            Charm uses AI to craft replies, conversation openers and general dating tips.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button
              onClick={() => navigate("/login")}
              className="h-12 rounded-full bg-foreground px-8 text-base font-bold text-background hover:bg-foreground/90"
            >
              Get started free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">No account needed · Cancel anytime</span>
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
      </div>
    </div>
  );
}
