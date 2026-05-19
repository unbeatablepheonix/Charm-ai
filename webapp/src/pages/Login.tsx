import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wordmark } from "@/components/charm/Wordmark";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/hooks/use-theme";

export default function Login() {
  useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      if (mode === "signin") {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) {
          setError(result.error.message ?? "Invalid email or password");
        } else {
          navigate("/app");
        }
      } else {
        const result = await authClient.signUp.email({ email, password, name });
        if (result.error) {
          setError(result.error.message ?? "Could not create account");
        } else {
          navigate("/app");
        }
      }
    } finally {
      setIsPending(false);
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
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Card */}
        <div className="mx-auto mt-16 w-full max-w-md md:mt-24">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur-sm">
            {/* Wordmark */}
            <div className="mb-8 flex justify-center">
              <Wordmark />
            </div>

            {/* Heading */}
            <h1 className="font-hero text-3xl font-black tracking-tight text-foreground">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to your Charm account"
                : "Start your 3-day free trial"}
            </p>

            {/* Form */}
            <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
              {mode === "signup" ? (
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="h-12 rounded-xl bg-background/60"
                />
              ) : null}

              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={mode === "signin"}
                className="h-12 rounded-xl bg-background/60"
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-background/60"
              />

              {error !== "" ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <Button
                type="submit"
                disabled={!email.trim() || !password.trim() || isPending}
                className="h-12 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending
                  ? "Please wait…"
                  : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
                {!isPending ? <ArrowRight className="ml-1.5 h-4 w-4" /> : null}
              </Button>
            </form>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Create one →
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signin"); setError(""); }}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Sign in →
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
