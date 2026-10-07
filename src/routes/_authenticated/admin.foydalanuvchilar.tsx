import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle, Placeholder } from "@/components/app/AppShell";
import { ADMIN_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/admin/foydalanuvchilar")({
  head: () => ({ meta: [{ title: "Foydalanuvchilar — TRIALOG" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell nav={ADMIN_NAV}>
      <PageTitle title="Foydalanuvchilar" />
      <Placeholder text="Bu bo‘lim keyingi bosqichda to‘ldiriladi." />
    </AppShell>
  );
}
