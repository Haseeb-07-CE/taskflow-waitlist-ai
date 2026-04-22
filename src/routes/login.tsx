import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Admin Login — TaskFlow AI" },
      { name: "description", content: "Sign in to the TaskFlow AI admin dashboard." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("not confirmed")) {
        setError(
          "Your email isn't confirmed yet. Check your inbox for the confirmation link, or disable 'Confirm email' in Supabase Auth settings."
        );
      } else {
        setError(error.message);
      }
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const onGoogleSignIn = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://taskflow-waitlist-ai.lovable.app/dashboard",
      },
    });
    if (error) setError(error.message);
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">TaskFlow AI</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="text-2xl font-bold text-foreground">Admin Sign In</h1>
          <p className="mt-1 text-sm text-foreground/60">Welcome back. Please sign in to continue.</p>

          <button
            type="button"
            onClick={onGoogleSignIn}
            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white text-sm font-semibold text-gray-800 shadow-sm transition-transform hover:scale-[1.02] hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.41 3.58v2.97h3.89c2.27-2.09 3.58-5.18 3.58-8.79z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.89-2.97c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.71-4.95H1.27v3.07C3.25 21.31 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.29 14.32c-.24-.72-.38-1.48-.38-2.32s.14-1.6.38-2.32V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4.02-3.07z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.61l4.02 3.07C6.23 6.86 8.88 4.75 12 4.75z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/40">Or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <Input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-foreground placeholder:text-foreground/40 backdrop-blur"
            />
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-foreground placeholder:text-foreground/40 backdrop-blur"
            />
            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="group h-12 rounded-xl text-base font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </form>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <Link to="/signup" className="text-sm text-foreground/70 hover:text-foreground">
            Need an admin account? <span className="text-foreground font-medium">Create one</span>
          </Link>
          <Link to="/" className="text-sm text-foreground/60 hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
