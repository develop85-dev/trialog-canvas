import { DICTIONARY, type Language } from "./i18n";

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

const MODULE_STYLES: Record<ModuleKey, { text: string; bg: string; soft: string; ring: string }> = {
  soz: {
    text: "text-soz",
    bg: "bg-soz",
    soft: "bg-soz-soft",
    ring: "border-soz",
  },
  matn: {
    text: "text-matn",
    bg: "bg-matn",
    soft: "bg-matn-soft",
    ring: "border-matn",
  },
  munozara: {
    text: "text-munozara",
    bg: "bg-munozara",
    soft: "bg-munozara-soft",
    ring: "border-munozara",
  },
  oyna: {
    text: "text-oyna",
    bg: "bg-oyna",
    soft: "bg-oyna-soft",
    ring: "border-oyna",
  },
};

export function getModules(lang: Language = "uz"): TrialogModule[] {
  const dict = DICTIONARY[lang] ?? DICTIONARY.uz;
  const keys: ModuleKey[] = ["soz", "matn", "munozara", "oyna"];
  return keys.map((key) => {
    const detail = dict.moduleDetails[key];
    const style = MODULE_STYLES[key];
    return {
      key,
      name: detail.name,
      component: detail.component,
      block: detail.block,
      description: detail.description,
      text: style.text,
      bg: style.bg,
      soft: style.soft,
      ring: style.ring,
    };
  });
}

export const MODULES: TrialogModule[] = getModules("uz");
