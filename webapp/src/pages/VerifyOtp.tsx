import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wordmark } from "@/components/charm/Wordmark";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/hooks/use-theme";

interface LocationState {
  email?: string;
}

export default function VerifyOtp() {
  useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const email = state?.email ?? "";

  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resendMessage, setResendMessage] = useState<string>("");

  // If no email in state, redirect to login
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleVerify = async () => {
    if (otp.trim().length < 6) return;
    setIsLoading(true);
    setError("");

    const { error: verifyError } = await authClient.signIn.emailOtp({
      email,
      otp: otp.trim(),
    });

    setIsLoading(false);

    if (verifyError) {
      setError(verifyError.message ?? "Invalid code. Please try again.");
      return;
    }

    navigate("/app");
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");

    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (sendError) {
      setError(sendError.message ?? "Failed to resend code.");
      return;
    }

    setResendMessage("Code resent!");
    setTimeout(() => setResendMessage(""), 4000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleVerify();
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
          onClick={() => navigate("/login")}
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
              Check your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>

            {/* Form */}
            <div className="mt-6 space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-14 rounded-xl bg-background/60 text-center text-2xl font-mono tracking-[0.4em]"
              />

              {error !== "" ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              {resendMessage !== "" ? (
                <p className="text-sm text-primary">{resendMessage}</p>
              ) : null}

              <Button
                onClick={() => void handleVerify()}
                disabled={otp.trim().length < 6 || isLoading}
                className="h-12 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "Verifying…" : "Verify"}
                {!isLoading ? <ArrowRight className="ml-1.5 h-4 w-4" /> : null}
              </Button>

              <button
                type="button"
                onClick={() => void handleResend()}
                className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Didn't get the code? Resend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
