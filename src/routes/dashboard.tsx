import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, LogOut, Users, Clock, CalendarDays, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — TaskFlow AI" },
      { name: "description", content: "TaskFlow AI admin dashboard with waitlist signups." },
    ],
  }),
});

type Signup = {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
};

function DashboardPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `photo_${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      toast.error(error.message);
    } else if (data) {
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(data.path);
      setUploadedUrl(pub.publicUrl);
      toast.success("File uploaded!");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      setUserEmail(session.user.email ?? null);
      setChecking(false);

      const { data, error } = await supabase
        .from("signups")
        .select("id, name, email, created_at")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (!error && data) setSignups(data as Signup[]);
      setLoadingData(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/login" });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (checking) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
      </main>
    );
  }

  const total = signups.length;
  const latest = signups[0]?.email ?? "—";
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = signups.filter((s) => new Date(s.created_at) >= todayStart).length;

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ background: "var(--gradient-hero)" }}>
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">TaskFlow AI — Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-foreground/70 sm:inline">{userEmail}</span>
            <Button
              size="sm"
              onClick={onSignOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users className="h-5 w-5 text-white" />}
            label="Total Signups"
            value={loadingData ? "…" : String(total)}
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-white" />}
            label="Latest Signup"
            value={loadingData ? "…" : latest}
            small
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5 text-white" />}
            label="Today's Signups"
            value={loadingData ? "…" : String(todayCount)}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold">Waitlist Signups</h2>
            <p className="text-sm text-foreground/60">All signups, newest first.</p>
          </div>
          {loadingData ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
            </div>
          ) : signups.length === 0 ? (
            <div className="px-6 py-16 text-center text-foreground/60">No signups yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-foreground/70">#</TableHead>
                  <TableHead className="text-foreground/70">Full Name</TableHead>
                  <TableHead className="text-foreground/70">Email</TableHead>
                  <TableHead className="text-foreground/70">Date Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups.map((s, i) => (
                  <TableRow
                    key={s.id}
                    className="border-white/10 odd:bg-white/0 even:bg-white/[0.03] hover:bg-white/5"
                  >
                    <TableCell className="text-foreground/70">{i + 1}</TableCell>
                    <TableCell className="font-medium">{s.name ?? "—"}</TableCell>
                    <TableCell className="text-foreground/80">{s.email}</TableCell>
                    <TableCell className="text-foreground/70">
                      {new Date(s.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: "var(--gradient-brand)" }}
        >
          {icon}
        </div>
        <span className="text-sm text-foreground/70">{label}</span>
      </div>
      <div
        className={`mt-3 font-bold text-foreground ${small ? "truncate text-lg" : "text-3xl"}`}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}
