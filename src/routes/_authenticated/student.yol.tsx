import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";
import { LearningPath } from "@/components/app/progress";
import { progressQuery } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/student/yol")({
  head: () => ({ meta: [{ title: "O‘quv yo‘li — TRIALOG" }] }),
  component: Page,
});

function Page() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const { data } = useQuery(progressQuery(user.id));
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="O‘quv yo‘li" sub="To‘rt modul — yagona pedagogik sikl: o‘z madaniyati → o‘zga madaniyat → shaxsiy pozitsiya." />
      <div className="max-w-3xl">{data && <LearningPath modules={data.modules} />}</div>
    </AppShell>
  );
}
