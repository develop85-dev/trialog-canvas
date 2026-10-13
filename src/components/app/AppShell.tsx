import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/SiteHeader";
import { primaryRole } from "@/lib/auth";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  dot?: string;
}

export function AppShell({ nav, children }: { nav: NavItem[]; children: ReactNode }) {
  const { user, roles } = useRouteContext({ from: "/_authenticated" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { t } = useLanguage();
  const name = (user.user_metadata?.["full_name"] as string) || user.email;

  const role = primaryRole(roles);
  const localizedRole = t.app.roles[role] || role;

  // Dynamic localization mapping for nav items
  const navTranslationMap: Record<string, string> = {
    "/student/dashboard": t.app.studentNav.dashboard,
    "/student/yol": t.app.studentNav.path,
    "/student/soz": t.app.studentNav.soz,
    "/student/matn": t.app.studentNav.matn,
    "/student/munozara": t.app.studentNav.munozara,
    "/student/oyna": t.app.studentNav.oyna,
    "/student/topshiriqlar": t.app.studentNav.tasks,
    "/student/portfolio": t.app.studentNav.portfolio,
    "/student/natijalar": t.app.studentNav.results,
    "/profil": t.app.studentNav.profile,
    "/teacher/dashboard": t.app.teacherNav.dashboard,
    "/teacher/kontent": t.app.teacherNav.content,
    "/admin/dashboard": t.app.adminNav.dashboard,
    "/admin/foydalanuvchilar": t.app.adminNav.users,
  };

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/kirish", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {nav.map((n) => {
            const label = navTranslationMap[n.to] || n.label;
            return (
              <Link
                key={n.to}
                to={n.to}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-primary"
                activeProps={{ className: "bg-accent text-primary font-medium" }}
              >
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                {n.dot && <span className={`h-2 w-2 rounded-full ${n.dot}`} />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Til / Язык</span>
            <LanguageSwitcher compact />
          </div>
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{localizedRole}</p>
          <button
            onClick={signOut}
            className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" /> {t.app.logout}
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6 md:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <button
              onClick={signOut}
              aria-label={t.app.logout}
              className="p-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl text-primary">{title}</h1>
      {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Placeholder({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
