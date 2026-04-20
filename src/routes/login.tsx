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
      setError(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
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

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-foreground/60 hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
