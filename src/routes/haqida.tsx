import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/PageHero";

export const Route = createFileRoute("/haqida")({
  head: () => ({
    meta: [
      { title: "TRIALOG haqida — Elektron platforma" },
      { name: "description", content: "TRIALOG platformasining maqsadi, tuzilishi va metodika bilan aloqasi." },
      { property: "og:title", content: "TRIALOG haqida" },
      { property: "og:description", content: "TRIALOG platformasining maqsadi va tuzilishi." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Platforma" title="TRIALOG haqida" lead="Talabalarning lingvomadaniy kompetensiyasini rivojlantirish uchun yaratilgan universitet darajasidagi elektron ta’lim muhiti." />
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Maqsad", "Til, madaniyat, muloqot va refleksiyani yagona raqamli muhitda birlashtirish."],
            ["Foydalanuvchilar", "Talabalar, o‘qituvchilar va administratorlar uchun alohida ish maydonlari."],
            ["Natija", "Rivojlanish monitoringi, elektron portfolio va o‘qituvchi fikr-mulohazasi."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-primary">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-lg leading-relaxed text-muted-foreground">
          TRIALOG umumiy nom bo‘lib, ikki element o‘zaro bog‘liq: <strong className="text-foreground">metodika</strong> — pedagogik usul, <strong className="text-foreground">platforma</strong> — uni amalga oshiruvchi raqamli vosita.
        </p>
      </Section>
    </>
  );
}
