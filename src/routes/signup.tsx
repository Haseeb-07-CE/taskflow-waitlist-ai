import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create Admin Account — TaskFlow AI" },
      { name: "description", content: "Create a new admin account for TaskFlow AI." },
    ],
  }),
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess("Account created! Check your email to confirm, then sign in.");
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
          <h1 className="text-2xl font-bold text-foreground">Create Admin Account</h1>
          <p className="mt-1 text-sm text-foreground/60">For internal admin use only.</p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <Input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-foreground placeholder:text-foreground/40 backdrop-blur"
            />
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
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-foreground placeholder:text-foreground/40 backdrop-blur"
            />
            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground/90">
                {success}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl text-base font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-foreground/60 hover:text-foreground">
            Already have an account? <span className="text-foreground">Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
