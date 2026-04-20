import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "TaskFlow AI — Join the Waitlist" },
      {
        name: "description",
        content:
          "Be first to access TaskFlow AI — the AI tool that manages your tasks automatically. Join 1,200+ on the waitlist.",
      },
      { property: "og:title", content: "TaskFlow AI — Join the Waitlist" },
      {
        property: "og:description",
        content: "The AI tool that manages your tasks automatically.",
      },
    ],
  }),
});

function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">TaskFlow AI</span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground/80 backdrop-blur">
          Coming soon
        </span>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24 text-center sm:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "oklch(var(--brand-glow))" }}
          />
          Early access opening soon
        </div>

        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Join the Waitlist —{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Be First to Access TaskFlow AI
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg text-foreground/70 sm:text-xl">
          The AI tool that manages your tasks automatically.
        </p>

        <div className="mt-10 w-full max-w-md">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Check className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">You're on the list!</h3>
              <p className="text-sm text-foreground/70">
                We'll email you the moment early access opens.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <Input
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-foreground placeholder:text-foreground/40 backdrop-blur focus-visible:ring-2"
                style={{ ["--tw-ring-color" as string]: "oklch(0.65 0.22 295)" }}
              />
              <Input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-foreground placeholder:text-foreground/40 backdrop-blur"
              />
              <Button
                type="submit"
                className="group h-12 rounded-xl text-base font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{
                  background: "var(--gradient-brand)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Join Waitlist
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/60">
            <Users className="h-4 w-4" />
            <span>
              <strong className="text-foreground/90">1,200+</strong> people already waiting
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
