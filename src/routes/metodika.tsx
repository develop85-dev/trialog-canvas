import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/PageHero";

export const Route = createFileRoute("/metodika")({
  head: () => ({
    meta: [
      { title: "Metodika — TRIALOG" },
      { name: "description", content: "TRIALOG metodikasi: uch bosqichli pedagogik model va refleksiv komponent." },
      { property: "og:title", content: "TRIALOG metodikasi" },
      { property: "og:description", content: "Uch bosqichli pedagogik model va refleksiv komponent." },
    ],
  }),
  component: Page,
});

const STEPS = [
  ["O‘z madaniyati", "Ona tili va madaniyatidagi birliklarni tahlil qilish."],
  ["O‘zga madaniyat", "O‘rganilayotgan madaniyat bilan qiyosiy tanishuv."],
  ["Shaxsiy pozitsiya", "Ikki madaniyat muloqotida o‘z nuqtai nazarini ifodalash."],
];

function Page() {
  return (
    <>
      <PageHero eyebrow="Metodika" title="TRIALOG metodikasi" lead="Lingvomadaniy kompetensiyani rivojlantirishga yo‘naltirilgan pedagogik algoritm. Platforma bu metodikaning raqamli vositasidir." />
      <Section>
        <ol className="relative space-y-6 border-l pl-8">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="relative">
              <span className="absolute -left-[42px] grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{i + 1}</span>
              <h3 className="font-display text-2xl text-primary">{t}</h3>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 rounded-xl border bg-oyna-soft p-6">
          <h3 className="font-semibold text-oyna">Refleksiv komponent</h3>
          <p className="mt-2 text-sm text-muted-foreground">Har bir bosqichdan so‘ng talaba OYNA modulida o‘z tajribasi va rivojlanishini tahlil qiladi.</p>
        </div>
      </Section>
    </>
  );
}
