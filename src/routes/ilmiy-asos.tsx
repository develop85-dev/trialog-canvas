import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/PageHero";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/ilmiy-asos")({
  head: () => ({
    meta: [
      { title: "Ilmiy asos / Научные основы — TRIALOG" },
      {
        name: "description",
        content:
          "TRIALOGning nazariy asoslari: Baxtin dialogizmi va Kramschning uchinchi makon g‘oyasi.",
      },
      { property: "og:title", content: "TRIALOG ilmiy asosi" },
      { property: "og:description", content: "Dialogizm va uchinchi makon g‘oyasi." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        eyebrow={t.sciencePage.eyebrow}
        title={t.sciencePage.title}
        lead={t.sciencePage.lead}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-7 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t.sciencePage.bakhtinName}
            </p>
            <h3 className="font-display mt-2 text-2xl text-primary">
              {t.sciencePage.bakhtinTitle}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">{t.sciencePage.bakhtinDesc}</p>
          </div>
          <div className="rounded-xl border bg-card p-7 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t.sciencePage.kramschName}
            </p>
            <h3 className="font-display mt-2 text-2xl text-primary">
              {t.sciencePage.kramschTitle}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">{t.sciencePage.kramschDesc}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
