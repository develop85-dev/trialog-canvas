import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/PageHero";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/haqida")({
  head: () => ({
    meta: [
      { title: "TRIALOG haqida / О TRIALOG" },
      {
        name: "description",
        content: "TRIALOG platformasining maqsadi, tuzilishi va metodika bilan aloqasi.",
      },
      { property: "og:title", content: "TRIALOG haqida" },
      { property: "og:description", content: "TRIALOG platformasining maqsadi va tuzilishi." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t.aboutPage.eyebrow} title={t.aboutPage.title} lead={t.aboutPage.lead} />
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {t.aboutPage.goals.map((g) => (
            <div key={g.title} className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-primary">{g.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-lg leading-relaxed text-muted-foreground">
          {t.aboutPage.summaryHtml}
        </p>
      </Section>
    </>
  );
}
