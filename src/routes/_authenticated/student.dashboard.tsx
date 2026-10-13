import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardList, MessageSquareQuote, Activity, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";
import { Bar, LearningPath, Ring } from "@/components/app/progress";
import { activityQuery, progressQuery } from "@/lib/progress";
import { getModules } from "@/lib/modules";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/student/dashboard")({
  head: () => ({ meta: [{ title: "Talaba paneli / Панель студента — TRIALOG" }] }),
  component: Page,
});

function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border bg-card p-6 shadow-card ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-lg bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}

function Page() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const { lang } = useLanguage();
  const isRu = lang === "ru";
  const name = (user.user_metadata?.["full_name"] as string) || (isRu ? "студент" : "talaba");
  const { data } = useQuery(progressQuery(user.id));
  const { data: activity } = useQuery(activityQuery(user.id));
  const localizedModules = getModules(lang);
  const modules =
    data?.modules?.map((m) => {
      const loc = localizedModules.find((x) => x.key === m.key);
      return loc ? { ...m, name: loc.name, component: loc.component } : m;
    }) ?? localizedModules.map((m) => ({ ...m, percent: 0 }));

  const next = modules.find((m) => m.percent < 100) ?? modules[0]!;

  return (
    <AppShell nav={STUDENT_NAV}>
      <h1 className="font-display text-3xl text-primary md:text-4xl">
        {isRu ? `Здравствуйте, ${name}!` : `Assalomu alaykum, ${name}!`}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {isRu ? "Текущий статус вашей учебной траектории." : "O‘quv yo‘lingizdagi bugungi holat."}
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card title={isRu ? "Общий результат" : "Umumiy natija"} className="lg:col-span-2">
          <div className="flex flex-col items-center gap-8 sm:flex-row">
            <div className="relative grid place-items-center">
              <Ring value={data?.overall ?? 0} />
              <div className="absolute text-center">
                <p className="text-3xl font-semibold text-primary">{data?.overall ?? 0}%</p>
                <p className="text-xs text-muted-foreground">
                  {isRu ? "Общий прогресс" : "Umumiy rivojlanish"}
                </p>
              </div>
            </div>
            <div className="w-full flex-1 space-y-4">
              {modules.map((m) => (
                <div key={m.key}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className={`font-semibold tracking-wider ${m.text}`}>{m.name}</span>
                    <span className="font-medium">{m.percent}%</span>
                  </div>
                  <Bar value={m.percent} className={m.bg} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title={isRu ? "Продолжить обучение" : "Davom ettirish"}>
          <div className={`rounded-xl p-5 ${next.soft}`}>
            <p className={`text-xl font-semibold tracking-wider ${next.text}`}>{next.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{next.component}</p>
            <Link
              to={`/student/${next.key}`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {isRu ? "Продолжить" : "Davom etish"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        <Card title={isRu ? "Учебная траектория" : "O‘quv yo‘li"} className="lg:col-span-2">
          <LearningPath modules={modules} />
        </Card>

        <div className="space-y-5">
          <Card
            title={isRu ? "Задание на сегодня" : "Bugungi topshiriq"}
            icon={<ClipboardList className="h-4 w-4" />}
          >
            <Empty text={isRu ? "Пока нет новых заданий." : "Hozircha yangi topshiriq yo‘q."} />
          </Card>
          <Card
            title={isRu ? "Отзыв преподавателя" : "O‘qituvchi fikri"}
            icon={<MessageSquareQuote className="h-4 w-4" />}
          >
            <Empty
              text={
                isRu
                  ? "Отзывы и рекомендации преподавателя появятся здесь."
                  : "O‘qituvchi fikr-mulohazalari shu yerda ko‘rinadi."
              }
            />
          </Card>
        </div>

        <Card
          title={isRu ? "Последняя активность" : "Oxirgi faoliyat"}
          icon={<Activity className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          {activity && activity.length > 0 ? (
            <ul className="divide-y">
              {activity.map((a) => {
                const m = localizedModules.find((x) => x.key === a.module);
                return (
                  <li key={a.id} className="flex items-center gap-3 py-3 text-sm">
                    <span className={`h-2 w-2 rounded-full ${m?.bg ?? "bg-muted-foreground"}`} />
                    <span className="flex-1">{a.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString(isRu ? "ru-RU" : "uz-UZ")}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty
              text={
                isRu
                  ? "Активность пока не зафиксирована. Начните первый модуль."
                  : "Faoliyat hali qayd etilmagan. Birinchi modulni boshlang."
              }
            />
          )}
        </Card>

        <Card
          title={isRu ? "Динамика развития" : "Rivojlanish dinamikasi"}
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <div className="flex h-36 items-end gap-3">
            {modules.map((m) => (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end rounded-md bg-muted">
                  <div
                    className={`w-full rounded-md ${m.bg} transition-all duration-700`}
                    style={{ height: `${Math.max(m.percent, 3)}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
