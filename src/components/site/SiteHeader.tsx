import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { dashboardPath, fetchRoles, primaryRole, useSession } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/haqida", label: "TRIALOG haqida" },
  { to: "/metodika", label: "Metodika" },
  { to: "/modullar", label: "Modullar" },
  { to: "/ilmiy-asos", label: "Ilmiy asos" },
  { to: "/kirish", label: "Kirish" },
] as const;

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("trialog-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = saved ? saved === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", enabled);
    setDark(enabled);
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("trialog-theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Yorug‘ rejimga o‘tish" : "Tungi rejimga o‘tish"}
      title={dark ? "Light mode" : "Dark mode"}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-md bg-primary p-1.5">
        <span className="rounded-sm bg-soz" />
        <span className="rounded-sm bg-matn" />
        <span className="rounded-sm bg-munozara" />
        <span className="rounded-sm bg-oyna" />
      </span>
      <span className="text-lg font-semibold tracking-[0.18em] text-primary">
        TRIALOG
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const [dash, setDash] = useState<ReturnType<typeof dashboardPath> | null>(null);

  useEffect(() => {
    if (!session) return setDash(null);
    fetchRoles(session.user.id).then((r) => setDash(dashboardPath(primaryRole(r))));
  }, [session]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Link
              to={dash ?? "/kirish"}
              className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card transition hover:opacity-90"
            >
              {dash ? "Shaxsiy kabinet" : "Platformaga kirish"}
            </Link>
          </div>

          <ThemeToggle />

          <button
            type="button"
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border px-6 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-foreground"
            >
              {n.label}
            </Link>
          ))}

          <Link
            to={dash ?? "/kirish"}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
          >
            {dash ? "Shaxsiy kabinet" : "Platformaga kirish"}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p className="text-sm text-muted-foreground">
          Lingvomadaniy kompetensiyani rivojlantirish uchun elektron platforma
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TRIALOG
        </p>
      </div>
    </footer>
  );
}
