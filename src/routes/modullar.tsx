import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ModuleCard } from "@/components/site/ModuleCard";
import { MODULES } from "@/lib/modules";

export const Route = createFileRoute("/modullar")({
  head: () => ({
    meta: [
      { title: "Modullar — TRIALOG" },
      { name: "description", content: "SO‘Z, MATN, MUNOZARA va OYNA — TRIALOG platformasining to‘rt moduli." },
      { property: "og:title", content: "TRIALOG modullari" },
      { property: "og:description", content: "SO‘Z, MATN, MUNOZARA va OYNA modullari." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Modullar" title="To‘rt modul — bitta sikl" lead="Birinchi uch modul o‘quv materiallari korpusining uch blokiga mos keladi; OYNA refleksiya uchun qo‘shimcha komponent." />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((m, i) => <ModuleCard key={m.key} m={m} index={i} />)}
      </section>
    </>
  );
}
