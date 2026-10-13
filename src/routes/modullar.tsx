import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ModuleCard } from "@/components/site/ModuleCard";
import { getModules } from "@/lib/modules";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/modullar")({
  head: () => ({
    meta: [
      { title: "Modullar / Модули — TRIALOG" },
      {
        name: "description",
        content: "SO‘Z, MATN, MUNOZARA va OYNA — TRIALOG platformasining to‘rt moduli.",
      },
      { property: "og:title", content: "TRIALOG modullari" },
      { property: "og:description", content: "SO‘Z, MATN, MUNOZARA va OYNA modullari." },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang, t } = useLanguage();
  const modules = getModules(lang);

  return (
    <>
      <PageHero
        eyebrow={t.modulesPage.eyebrow}
        title={t.modulesPage.title}
        lead={t.modulesPage.lead}
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m, i) => (
          <ModuleCard key={m.key} m={m} index={i} />
        ))}
      </section>
    </>
  );
}
