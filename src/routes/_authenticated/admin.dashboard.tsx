import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle, Placeholder } from "@/components/app/AppShell";
import { ADMIN_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Administrator paneli — TRIALOG" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell nav={ADMIN_NAV}>
      <PageTitle title="Administrator paneli" sub="Assalomu alaykum!" />
      <Placeholder text="Bu bo‘lim keyingi bosqichda to‘ldiriladi." />
    </AppShell>
  );
}
