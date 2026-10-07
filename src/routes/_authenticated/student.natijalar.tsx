import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle, Placeholder } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/student/natijalar")({
  head: () => ({ meta: [{ title: "Natijalar — TRIALOG" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="Natijalar" />
      <Placeholder text="Bu bo‘lim keyingi bosqichda to‘ldiriladi." />
    </AppShell>
  );
}
