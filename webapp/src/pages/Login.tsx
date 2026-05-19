import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wordmark } from "@/components/charm/Wordmark";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/hooks/use-theme";

export default function Login() {
  useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSendCode = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setError("");

    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim(),
      type: "sign-in",
    });

    setIsLoading(false);

    if (sendError) {
      setError(sendError.message ?? "Failed to send code. Please try again.");
      return;
    }

    navigate("/verify", { state: { email: email.trim() } });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleSendCode();
    }
  };

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
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Card */}
        <div className="mx-auto mt-16 w-full max-w-md md:mt-24">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur-sm">
            {/* Wordmark */}
            <div className="mb-8 flex justify-center">
              <Wordmark />
            </div>

            {/* Heading */}
            <h1 className="font-hero text-3xl font-black tracking-tight text-foreground">
              Enter your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll send you a code to sign in — no password needed.
            </p>

            {/* Form */}
            <div className="mt-6 space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-12 rounded-xl bg-background/60"
              />

              {error !== "" ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <Button
                onClick={() => void handleSendCode()}
                disabled={!email.trim() || isLoading}
                className="h-12 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "Sending…" : "Send code"}
                {!isLoading ? <ArrowRight className="ml-1.5 h-4 w-4" /> : null}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
