import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle, Placeholder } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/student/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — TRIALOG" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="Portfolio" />
      <Placeholder text="Bu bo‘lim keyingi bosqichda to‘ldiriladi." />
    </AppShell>
  );
}
