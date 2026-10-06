export type ModuleKey = "soz" | "matn" | "munozara" | "oyna";

export interface TrialogModule {
  key: ModuleKey;
  name: string;
  component: string;
  block: string;
  description: string;
  text: string;
  bg: string;
  soft: string;
  ring: string;
}

export const MODULES: TrialogModule[] = [
  {
    key: "soz",
    name: "SO‘Z",
    component: "Lingvistik komponent",
    block: "Leksik-frazeologik blok",
    description:
      "Til birliklari, frazeologizmlar, paremiyalar va madaniy jihatdan belgilangan leksik birliklar bilan ishlash.",
    text: "text-soz",
    bg: "bg-soz",
    soft: "bg-soz-soft",
    ring: "border-soz",
  },
  {
    key: "matn",
    name: "MATN",
    component: "Madaniy-bilim komponenti",
    block: "Matn / madaniy blok",
    description: "Matnlar, videolar va madaniy materiallar orqali kontekstni anglash.",
    text: "text-matn",
    bg: "bg-matn",
    soft: "bg-matn-soft",
    ring: "border-matn",
  },
  {
    key: "munozara",
    name: "MUNOZARA",
    component: "Kommunikativ-faoliyat komponenti",
    block: "Nutq odobi / kommunikativ blok",
    description:
      "Munozara, fikr almashish va madaniyatlararo muloqot ko‘nikmalarini rivojlantirish.",
    text: "text-munozara",
    bg: "bg-munozara",
    soft: "bg-munozara-soft",
    ring: "border-munozara",
  },
  {
    key: "oyna",
    name: "OYNA",
    component: "Refleksiv komponent",
    block: "Qo‘shimcha refleksiv komponent",
    description: "O‘z bilimlari, tajribasi va rivojlanishini tahlil qilish.",
    text: "text-oyna",
    bg: "bg-oyna",
    soft: "bg-oyna-soft",
    ring: "border-oyna",
  },
];
