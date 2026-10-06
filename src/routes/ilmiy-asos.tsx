import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/PageHero";

export const Route = createFileRoute("/ilmiy-asos")({
  head: () => ({
    meta: [
      { title: "Ilmiy asos — TRIALOG" },
      { name: "description", content: "TRIALOGning nazariy asoslari: Baxtin dialogizmi va Kramschning uchinchi makon g‘oyasi." },
      { property: "og:title", content: "TRIALOG ilmiy asosi" },
      { property: "og:description", content: "Dialogizm va uchinchi makon g‘oyasi." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Ilmiy asos" title="Nazariy tayanchlar" lead="Platforma madaniyatlararo ta’limdagi dialogik yondashuvga asoslanadi." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-7 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">M.M. Baxtin</p>
            <h3 className="font-display mt-2 text-2xl text-primary">Dialogizm</h3>
            <p className="mt-3 text-sm text-muted-foreground">Ma’no ovozlar o‘rtasidagi muloqotda tug‘iladi; madaniyatlar ham bir-biri bilan dialogda anglanadi.</p>
          </div>
          <div className="rounded-xl border bg-card p-7 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">C. Kramsch</p>
            <h3 className="font-display mt-2 text-2xl text-primary">Uchinchi makon</h3>
            <p className="mt-3 text-sm text-muted-foreground">O‘quvchi o‘z va o‘zga madaniyat oralig‘ida shaxsiy pozitsiyani shakllantiradigan makon.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
