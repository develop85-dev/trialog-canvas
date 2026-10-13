import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getModules } from "@/lib/modules";
import { ModuleCard } from "@/components/site/ModuleCard";
import { TrialogDiagram } from "@/components/site/TrialogDiagram";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRIALOG — Elektron platforma / Электронная платформа" },
      {
        name: "description",
        content:
          "Lingvomadaniy kompetensiyani rivojlantirish uchun elektron ta’lim platformasi. Электронная образовательная платформа.",
      },
      { property: "og:title", content: "TRIALOG" },
      {
        property: "og:description",
        content:
          "Til, madaniyat, muloqot va refleksiyani yagona raqamli muhitda birlashtiruvchi platforma.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { lang, t } = useLanguage();
  const modules = getModules(lang);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="academic-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-rise">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t.home.badge}
            </p>
            <h1 className="mt-4 text-6xl font-semibold tracking-[0.12em] text-primary md:text-7xl">
              {t.home.title}
            </h1>
            <p className="font-display mt-6 text-2xl leading-snug text-foreground md:text-3xl">
              {t.home.subtitle}
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.home.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/kirish"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-card transition hover:opacity-90"
              >
                {t.home.enterPlatform} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/haqida"
                className="rounded-lg border bg-card px-5 py-3 text-sm font-medium text-primary transition hover:bg-accent"
              >
                {t.home.aboutBtn}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider">
              {modules.map((m, i) => (
                <span key={m.key} className="flex items-center gap-2">
                  <span className={m.text}>{m.name}</span>
                  {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                </span>
              ))}
            </div>
          </div>
          <TrialogDiagram />
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {t.home.modulesEyebrow}
            </p>
            <h2 className="font-display mt-3 text-4xl text-primary">{t.home.modulesTitle}</h2>
            <p className="mt-4 text-muted-foreground">{t.home.modulesLead}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((m, i) => (
              <ModuleCard key={m.key} m={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {t.home.ideaEyebrow}
            </p>
            <h2 className="font-display mt-3 text-4xl text-primary">{t.home.ideaTitle}</h2>
            <p className="mt-4 text-muted-foreground">{t.home.ideaLead}</p>
          </div>
          <ol className="space-y-4">
            {t.home.flow.map((f, i) => (
              <li key={f.title} className="flex gap-5 rounded-xl border bg-card p-5 shadow-card">
                <span className="font-display text-3xl text-muted-foreground">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-primary">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">A</p>
            <h3 className="font-display mt-2 text-2xl text-primary">{t.home.cardMethodTitle}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{t.home.cardMethodDesc}</p>
          </div>
          <div className="rounded-2xl bg-primary p-8 text-primary-foreground shadow-lift">
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">B</p>
            <h3 className="font-display mt-2 text-2xl">{t.home.cardPlatformTitle}</h3>
            <p className="mt-3 text-sm opacity-80">{t.home.cardPlatformDesc}</p>
          </div>
        </div>
      </section>
    </>
  );
}
