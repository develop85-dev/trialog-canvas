import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/haqida", label: "TRIALOG haqida" },
  { to: "/metodika", label: "Metodika" },
  { to: "/modullar", label: "Modullar" },
  { to: "/ilmiy-asos", label: "Ilmiy asos" },
  { to: "/kirish", label: "Kirish" },
] as const;

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
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
        <Link
          to="/kirish"
          className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card transition hover:opacity-90 lg:inline-flex"
        >
          Platformaga kirish
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menyu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-6 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p className="text-sm text-muted-foreground">
          Lingvomadaniy kompetensiyani rivojlantirish uchun elektron platforma
        </p>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TRIALOG</p>
      </div>
    </footer>
  );
}
