import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { TEACHER_NAV } from "@/components/app/navs";
import { ContentForms } from "./teacher.dashboard";

export const Route = createFileRoute("/_authenticated/teacher/kontent")({
  head: () => ({ meta: [{ title: "Kontent boshqaruvi — TRIALOG" }] }),
  component: () => (
    <AppShell nav={TEACHER_NAV}>
      <PageTitle title="Kontent boshqaruvi" sub="Yangi so‘z, matn va munozara mavzusi qo‘shing" />
      <ContentForms />
    </AppShell>
  ),
});
