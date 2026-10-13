import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { dashboardPath, fetchRoles, primaryRole, useSession } from "@/lib/auth";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const { t } = useLanguage();

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
      aria-label={dark ? t.theme.light : t.theme.dark}
      title={dark ? t.theme.light : t.theme.dark}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
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
      <span className="text-lg font-semibold tracking-[0.18em] text-primary">TRIALOG</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const [dash, setDash] = useState<ReturnType<typeof dashboardPath> | null>(null);
  const { t } = useLanguage();

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/haqida", label: t.nav.about },
    { to: "/metodika", label: t.nav.methodology },
    { to: "/modullar", label: t.nav.modules },
    { to: "/ilmiy-asos", label: t.nav.science },
    { to: "/kirish", label: t.nav.login },
  ] as const;

  useEffect(() => {
    if (!session) return setDash(null);
    fetchRoles(session.user.id).then((r) => setDash(dashboardPath(primaryRole(r))));
  }, [session]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((n) => (
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
              {dash ? t.nav.dashboard : t.nav.login}
            </Link>
          </div>

          <LanguageSwitcher />
          <ThemeToggle />

          <button
            type="button"
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border px-6 py-4 lg:hidden">
          {navLinks.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-foreground"
            >
              {n.label}
            </Link>
          ))}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">Til / Язык:</span>
            <LanguageSwitcher />
          </div>

          <Link
            to={dash ?? "/kirish"}
            onClick={() => setOpen(false)}
            className="mt-3 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-card"
          >
            {dash ? t.nav.dashboard : t.nav.login}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
        <p className="text-xs text-muted-foreground">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
