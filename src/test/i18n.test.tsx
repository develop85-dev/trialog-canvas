import { describe, expect, it } from "vitest";
import { DICTIONARY } from "@/lib/i18n";
import { getModules } from "@/lib/modules";

describe("i18n Language System", () => {
  it("provides complete translations for both Uzbek and Russian", () => {
    expect(DICTIONARY.uz).toBeDefined();
    expect(DICTIONARY.ru).toBeDefined();

    // Nav
    expect(DICTIONARY.uz.nav.home).toBe("Bosh sahifa");
    expect(DICTIONARY.ru.nav.home).toBe("Главная");
    expect(DICTIONARY.uz.nav.about).toBe("TRIALOG haqida");
    expect(DICTIONARY.ru.nav.about).toBe("О TRIALOG");

    // Modules
    expect(DICTIONARY.uz.moduleDetails.soz.name).toBe("SO‘Z");
    expect(DICTIONARY.ru.moduleDetails.soz.name).toBe("СЛОВО");
    expect(DICTIONARY.uz.moduleDetails.matn.name).toBe("MATN");
    expect(DICTIONARY.ru.moduleDetails.matn.name).toBe("ТЕКСТ");
    expect(DICTIONARY.uz.moduleDetails.munozara.name).toBe("MUNOZARA");
    expect(DICTIONARY.ru.moduleDetails.munozara.name).toBe("ДИСКУССИЯ");
    expect(DICTIONARY.uz.moduleDetails.oyna.name).toBe("OYNA");
    expect(DICTIONARY.ru.moduleDetails.oyna.name).toBe("ЗЕРКАЛО");

    // Auth
    expect(DICTIONARY.uz.auth.loginTitle).toBe("Platformaga kirish");
    expect(DICTIONARY.ru.auth.loginTitle).toBe("Вход на платформу");
  });

  it("getModules returns correctly translated module list", () => {
    const uzModules = getModules("uz");
    const ruModules = getModules("ru");

    expect(uzModules).toHaveLength(4);
    expect(ruModules).toHaveLength(4);

    expect(uzModules[0]?.name).toBe("SO‘Z");
    expect(ruModules[0]?.name).toBe("СЛОВО");

    expect(uzModules[1]?.name).toBe("MATN");
    expect(ruModules[1]?.name).toBe("ТЕКСТ");

    expect(uzModules[2]?.name).toBe("MUNOZARA");
    expect(ruModules[2]?.name).toBe("ДИСКУССИЯ");

    expect(uzModules[3]?.name).toBe("OYNA");
    expect(ruModules[3]?.name).toBe("ЗЕРКАЛО");
  });
});
