import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/PageHero";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/metodika")({
  head: () => ({
    meta: [
      { title: "Metodika / Методика — TRIALOG" },
      {
        name: "description",
        content: "TRIALOG metodikasi: uch bosqichli pedagogik model va refleksiv komponent.",
      },
      { property: "og:title", content: "TRIALOG metodikasi" },
      {
        property: "og:description",
        content: "Uch bosqichli pedagogik model va refleksiv komponent.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        eyebrow={t.methodologyPage.eyebrow}
        title={t.methodologyPage.title}
        lead={t.methodologyPage.lead}
      />
      <Section>
        <ol className="relative space-y-6 border-l pl-8">
          {t.methodologyPage.steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="absolute -left-[42px] grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="font-display text-2xl text-primary">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 rounded-xl border bg-oyna-soft p-6">
          <h3 className="font-semibold text-oyna">{t.methodologyPage.reflexiveTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t.methodologyPage.reflexiveDesc}</p>
        </div>
      </Section>
    </>
  );
}
