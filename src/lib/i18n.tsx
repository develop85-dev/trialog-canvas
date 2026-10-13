import React, { createContext, useContext, useEffect, useState } from "react";
import { Globe } from "lucide-react";

export type Language = "uz" | "ru";

export interface I18nContent {
  nav: {
    home: string;
    about: string;
    methodology: string;
    modules: string;
    science: string;
    login: string;
    dashboard: string;
    closeMenu: string;
    openMenu: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    lead: string;
    enterPlatform: string;
    aboutBtn: string;
    diagramCenter: string;
    diagramCenterSubtitle: string;
    modulesEyebrow: string;
    modulesTitle: string;
    modulesLead: string;
    ideaEyebrow: string;
    ideaTitle: string;
    ideaLead: string;
    flow: Array<{ title: string; desc: string }>;
    cardMethodTitle: string;
    cardMethodDesc: string;
    cardPlatformTitle: string;
    cardPlatformDesc: string;
  };
  modulesPage: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  aboutPage: {
    eyebrow: string;
    title: string;
    lead: string;
    goals: Array<{ title: string; desc: string }>;
    summaryHtml: string;
  };
  methodologyPage: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: Array<{ title: string; desc: string }>;
    reflexiveTitle: string;
    reflexiveDesc: string;
  };
  sciencePage: {
    eyebrow: string;
    title: string;
    lead: string;
    bakhtinName: string;
    bakhtinTitle: string;
    bakhtinDesc: string;
    kramschName: string;
    kramschTitle: string;
    kramschDesc: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    loginTab: string;
    registerTab: string;
    nameLabel: string;
    emailLabel: string;
    passLabel: string;
    forgotPass: string;
    loginBtn: string;
    registerBtn: string;
    errorInvalid: string;
    confirmSent: string;
    resetTitle: string;
    resetLead: string;
    sendResetLink: string;
    backToLogin: string;
    linkSent: string;
    saveNewPass: string;
    newPassTitle: string;
    newPassLabel: string;
  };
  app: {
    logout: string;
    studentNav: {
      dashboard: string;
      path: string;
      soz: string;
      matn: string;
      munozara: string;
      oyna: string;
      tasks: string;
      portfolio: string;
      results: string;
      profile: string;
    };
    teacherNav: {
      dashboard: string;
      content: string;
      profile: string;
    };
    adminNav: {
      dashboard: string;
      users: string;
      teacherPanel: string;
      studentPanel: string;
      profile: string;
    };
    roles: {
      admin: string;
      teacher: string;
      student: string;
    };
  };
  moduleDetails: Record<
    "soz" | "matn" | "munozara" | "oyna",
    {
      name: string;
      component: string;
      block: string;
      description: string;
    }
  >;
}

export const DICTIONARY: Record<Language, I18nContent> = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      about: "TRIALOG haqida",
      methodology: "Metodika",
      modules: "Modullar",
      science: "Ilmiy asos",
      login: "Kirish",
      dashboard: "Shaxsiy kabinet",
      closeMenu: "Menyuni yopish",
      openMenu: "Menyuni ochish",
    },
    footer: {
      tagline: "Lingvomadaniy kompetensiyani rivojlantirish uchun elektron platforma",
      rights: "© 2026 TRIALOG",
    },
    theme: {
      light: "Yorug‘ rejim",
      dark: "Tungi rejim",
    },
    home: {
      badge: "Elektron platforma",
      title: "TRIALOG",
      subtitle: "Lingvomadaniy kompetensiyani rivojlantirish uchun elektron platforma",
      lead: "Til, madaniyat, muloqot va refleksiyani yagona raqamli ta’lim muhitida birlashtiruvchi platforma.",
      enterPlatform: "Platformaga kirish",
      aboutBtn: "TRIALOG haqida",
      diagramCenter: "Uchinchi makon",
      diagramCenterSubtitle: "TRIALOG",
      modulesEyebrow: "Modullar",
      modulesTitle: "Yagona pedagogik sikl",
      modulesLead:
        "Uch daraja o‘quv materiallari korpusiga mos keladi, OYNA esa refleksiya va o‘z-o‘zini rivojlantirish uchun qo‘shimcha komponentdir.",
      ideaEyebrow: "Trialog g‘oyasi",
      ideaTitle: "“Uchinchi makon” sari",
      ideaLead:
        "M.M. Baxtinning dialogizm g‘oyasi va C. Kramschning “uchinchi makon” tushunchasiga tayangan holda, talaba ikki madaniyat o‘rtasida o‘z pozitsiyasini topadi.",
      flow: [
        {
          title: "O‘z madaniyati",
          desc: "Talaba o‘z tili va madaniyatidagi tushunchalarni anglaydi.",
        },
        {
          title: "O‘zga madaniyat",
          desc: "Boshqa madaniyat hodisalari bilan qiyosiy tanishadi.",
        },
        {
          title: "Shaxsiy pozitsiya",
          desc: "Ikki madaniyat muloqotida o‘z nuqtai nazarini shakllantiradi.",
        },
      ],
      cardMethodTitle: "TRIALOG metodikasi",
      cardMethodDesc:
        "Lingvomadaniy kompetensiyani rivojlantirishga qaratilgan pedagogik metod va algoritm.",
      cardPlatformTitle: "TRIALOG elektron platformasi",
      cardPlatformDesc: "Metodikani amalga oshirishni qo‘llab-quvvatlovchi raqamli vosita.",
    },
    modulesPage: {
      eyebrow: "Modullar",
      title: "To‘rt modul — bitta sikl",
      lead: "Birinchi uch modul o‘quv materiallari korpusining uch blokiga mos keladi; OYNA refleksiya uchun qo‘shimcha komponent.",
    },
    aboutPage: {
      eyebrow: "Platforma",
      title: "TRIALOG haqida",
      lead: "Talabalarning lingvomadaniy kompetensiyasini rivojlantirish uchun yaratilgan universitet darajasidagi elektron ta’lim muhiti.",
      goals: [
        {
          title: "Maqsad",
          desc: "Til, madaniyat, muloqot va refleksiyani yagona raqamli muhitda birlashtirish.",
        },
        {
          title: "Foydalanuvchilar",
          desc: "Talabalar, o‘qituvchilar va administratorlar uchun alohida ish maydonlari.",
        },
        {
          title: "Natija",
          desc: "Rivojlanish monitoringi, elektron portfolio va o‘qituvchi fikr-mulohazasi.",
        },
      ],
      summaryHtml:
        "TRIALOG umumiy nom bo‘lib, ikki element o‘zaro bog‘liq: metodika — pedagogik usul, platforma — uni amalga oshiruvchi raqamli vosita.",
    },
    methodologyPage: {
      eyebrow: "Metodika",
      title: "TRIALOG metodikasi",
      lead: "Lingvomadaniy kompetensiyani rivojlantirishga yo‘naltirilgan pedagogik algoritm. Platforma bu metodikaning raqamli vositasidir.",
      steps: [
        {
          title: "O‘z madaniyati",
          desc: "Ona tili va madaniyatidagi birliklarni tahlil qilish.",
        },
        {
          title: "O‘zga madaniyat",
          desc: "O‘rganilayotgan madaniyat bilan qiyosiy tanishuv.",
        },
        {
          title: "Shaxsiy pozitsiya",
          desc: "Ikki madaniyat muloqotida o‘z nuqtai nazarini ifodalash.",
        },
      ],
      reflexiveTitle: "Refleksiv komponent",
      reflexiveDesc:
        "Har bir bosqichdan so‘ng talaba OYNA modulida o‘z tajribasi va rivojlanishini tahlil qiladi.",
    },
    sciencePage: {
      eyebrow: "Ilmiy asos",
      title: "Nazariy tayanchlar",
      lead: "Platforma madaniyatlararo ta’limdagi dialogik yondashuvga asoslanadi.",
      bakhtinName: "M.M. Baxtin",
      bakhtinTitle: "Dialogizm",
      bakhtinDesc:
        "Ma’no ovozlar o‘rtasidagi muloqotda tug‘iladi; madaniyatlar ham bir-biri bilan dialogda anglanadi.",
      kramschName: "C. Kramsch",
      kramschTitle: "Uchinchi makon",
      kramschDesc:
        "O‘quvchi o‘z va o‘zga madaniyat oralig‘ida shaxsiy pozitsiyani shakllantiradigan makon.",
    },
    auth: {
      loginTitle: "Platformaga kirish",
      registerTitle: "Ro‘yxatdan o‘tish",
      loginTab: "Kirish",
      registerTab: "Ro‘yxatdan o‘tish",
      nameLabel: "To‘liq ism",
      emailLabel: "Elektron pochta",
      passLabel: "Parol",
      forgotPass: "Parolni unutdingizmi?",
      loginBtn: "Kirish",
      registerBtn: "Ro‘yxatdan o‘tish",
      errorInvalid: "Email yoki parol noto‘g‘ri.",
      confirmSent: "Elektron pochtangizga tasdiqlash havolasi yuborildi.",
      resetTitle: "Parolni tiklash",
      resetLead: "Elektron pochtangizni kiriting va tiklash havolasini oling.",
      sendResetLink: "Havola yuborish",
      backToLogin: "Kirish sahifasiga qaytish",
      linkSent: "Tiklash havolasi elektron pochtangizga yuborildi.",
      saveNewPass: "Saqlash",
      newPassTitle: "Yangi parol",
      newPassLabel: "Yangi parolni kiriting",
    },
    app: {
      logout: "Chiqish",
      studentNav: {
        dashboard: "Bosh sahifa",
        path: "O‘quv yo‘li",
        soz: "SO‘Z",
        matn: "MATN",
        munozara: "MUNOZARA",
        oyna: "OYNA",
        tasks: "Topshiriqlar",
        portfolio: "Portfolio",
        results: "Natijalar",
        profile: "Profil",
      },
      teacherNav: {
        dashboard: "Bosh sahifa",
        content: "Kontent",
        profile: "Profil",
      },
      adminNav: {
        dashboard: "Bosh sahifa",
        users: "Foydalanuvchilar",
        teacherPanel: "O‘qituvchi paneli",
        studentPanel: "Talaba paneli",
        profile: "Profil",
      },
      roles: {
        admin: "Administrator",
        teacher: "O‘qituvchi",
        student: "Talaba",
      },
    },
    moduleDetails: {
      soz: {
        name: "SO‘Z",
        component: "Lingvistik komponent",
        block: "Leksik-frazeologik blok",
        description:
          "Til birliklari, frazeologizmlar, paremiyalar va madaniy jihatdan belgilangan leksik birliklar bilan ishlash.",
      },
      matn: {
        name: "MATN",
        component: "Madaniy-bilim komponenti",
        block: "Matn / madaniy blok",
        description: "Matnlar, videolar va madaniy materiallar orqali kontekstni anglash.",
      },
      munozara: {
        name: "MUNOZARA",
        component: "Kommunikativ-faoliyat komponenti",
        block: "Nutq odobi / kommunikativ blok",
        description:
          "Munozara, fikr almashish va madaniyatlararo muloqot ko‘nikmalarini rivojlantirish.",
      },
      oyna: {
        name: "OYNA",
        component: "Refleksiv komponent",
        block: "Qo‘shimcha refleksiv komponent",
        description: "O‘z bilimlari, tajribasi va rivojlanishini tahlil qilish.",
      },
    },
  },
  ru: {
    nav: {
      home: "Главная",
      about: "О TRIALOG",
      methodology: "Методика",
      modules: "Модули",
      science: "Научные основы",
      login: "Вход",
      dashboard: "Личный кабинет",
      closeMenu: "Закрыть меню",
      openMenu: "Открыть меню",
    },
    footer: {
      tagline: "Электронная платформа для развития лингвокультурологической компетенции",
      rights: "© 2026 TRIALOG",
    },
    theme: {
      light: "Светлая тема",
      dark: "Темная тема",
    },
    home: {
      badge: "Электронная платформа",
      title: "TRIALOG",
      subtitle: "Электронная платформа для развития лингвокультурологической компетенции",
      lead: "Платформа, объединяющая язык, культуру, диалог и рефлексию в единой цифровой образовательной среде.",
      enterPlatform: "Вход на платформу",
      aboutBtn: "О TRIALOG",
      diagramCenter: "Третье пространство",
      diagramCenterSubtitle: "TRIALOG",
      modulesEyebrow: "Модули",
      modulesTitle: "Единый педагогический цикл",
      modulesLead:
        "Три уровня соответствуют корпусу учебных материалов, а OYNA (Зеркало) является дополнительным компонентом для рефлексии и саморазвития.",
      ideaEyebrow: "Идея триалога",
      ideaTitle: "К «Третьему пространству»",
      ideaLead:
        "Опираясь на идею диалогизма М.М. Бахтина и концепцию «третьего пространства» К. Крамш, студент вырабатывает собственную позицию в диалоге двух культур.",
      flow: [
        {
          title: "Родная культура",
          desc: "Студент осознает смыслы и концепты родного языка и культуры.",
        },
        {
          title: "Иная культура",
          desc: "Сравнительно исследует феномены изучаемой культуры.",
        },
        {
          title: "Личная позиция",
          desc: "Формирует независимый взгляд в диалоге двух культур.",
        },
      ],
      cardMethodTitle: "Методика TRIALOG",
      cardMethodDesc:
        "Педагогический метод и алгоритм, направленный на развитие лингвокультурологической компетенции.",
      cardPlatformTitle: "Электронная платформа TRIALOG",
      cardPlatformDesc: "Цифровой инструмент, поддерживающий реализацию методики.",
    },
    modulesPage: {
      eyebrow: "Модули",
      title: "Четыре модуля — единый цикл",
      lead: "Первые три модуля соотносятся с тремя блоками корпуса учебных материалов; OYNA — дополнительный компонент для рефлексии.",
    },
    aboutPage: {
      eyebrow: "Платформа",
      title: "О проекте TRIALOG",
      lead: "Цифровая образовательная среда университетского уровня, созданная для формирования лингвокультурологической компетенции студентов.",
      goals: [
        {
          title: "Цель",
          desc: "Объединение языка, культуры, коммуникации и рефлексии в единой цифровой среде.",
        },
        {
          title: "Пользователи",
          desc: "Индивидуальные рабочие пространства для студентов, преподавателей и администраторов.",
        },
        {
          title: "Результат",
          desc: "Мониторинг развития, электронное портфолио и аналитическая обратная связь преподавателя.",
        },
      ],
      summaryHtml:
        "TRIALOG — это общее название двух взаимосвязанных составляющих: методика — педагогический подход, а платформа — цифровой инструмент его практической реализации.",
    },
    methodologyPage: {
      eyebrow: "Методика",
      title: "Методика TRIALOG",
      lead: "Педагогический алгоритм развития лингвокультурологической компетенции. Платформа выступает цифровым воплощением методики.",
      steps: [
        {
          title: "Родная культура",
          desc: "Глубокий анализ единиц и концептов родного языка и культуры.",
        },
        {
          title: "Иная культура",
          desc: "Сравнительное сопоставление с феноменами изучаемой культуры.",
        },
        {
          title: "Личная позиция",
          desc: "Выражение собственной позиции в поликультурном диалоге.",
        },
      ],
      reflexiveTitle: "Рефлексивный компонент",
      reflexiveDesc:
        "После прохождения каждого этапа студент в модуле OYNA анализирует свой опыт, достижения и точки роста.",
    },
    sciencePage: {
      eyebrow: "Научные основы",
      title: "Теоретические основы",
      lead: "Платформа базируется на диалогическом подходе к межкультурному образованию.",
      bakhtinName: "М.М. Бахтин",
      bakhtinTitle: "Диалогизм",
      bakhtinDesc:
        "Смысл рождается во встрече и диалоге разных голосов; культуры постигаются исключительно в живом взаимодействии друг с другом.",
      kramschName: "К. Крамш",
      kramschTitle: "Третье пространство",
      kramschDesc:
        "Пространство, в котором обучающийся формирует собственную субъектную позицию на пересечении родной и изучаемой культур.",
    },
    auth: {
      loginTitle: "Вход на платформу",
      registerTitle: "Регистрация",
      loginTab: "Вход",
      registerTab: "Регистрация",
      nameLabel: "Полное имя",
      emailLabel: "Электронная почта",
      passLabel: "Пароль",
      forgotPass: "Забыли пароль?",
      loginBtn: "Войти",
      registerBtn: "Зарегистрироваться",
      errorInvalid: "Неверный адрес электронной почты или пароль.",
      confirmSent: "Ссылка для подтверждения отправлена на вашу почту.",
      resetTitle: "Восстановление пароля",
      resetLead: "Введите ваш email для получения ссылки сброса пароля.",
      sendResetLink: "Отправить ссылку",
      backToLogin: "Вернуться ко входу",
      linkSent: "Ссылка для восстановления отправлена на вашу почту.",
      saveNewPass: "Сохранить",
      newPassTitle: "Новый пароль",
      newPassLabel: "Введите новый пароль",
    },
    app: {
      logout: "Выйти",
      studentNav: {
        dashboard: "Главная",
        path: "Учебная траектория",
        soz: "СЛОВО",
        matn: "ТЕКСТ",
        munozara: "ДИСКУССИЯ",
        oyna: "ЗЕРКАЛО",
        tasks: "Задания",
        portfolio: "Портфолио",
        results: "Результаты",
        profile: "Профиль",
      },
      teacherNav: {
        dashboard: "Главная",
        content: "Контент",
        profile: "Профиль",
      },
      adminNav: {
        dashboard: "Главная",
        users: "Пользователи",
        teacherPanel: "Панель преподавателя",
        studentPanel: "Панель студента",
        profile: "Профиль",
      },
      roles: {
        admin: "Администратор",
        teacher: "Преподаватель",
        student: "Студент",
      },
    },
    moduleDetails: {
      soz: {
        name: "СЛОВО",
        component: "Лингвистический компонент",
        block: "Лексико-фразеологический блок",
        description:
          "Работа с языковыми единицами, фразеологизмами, паремиями и национально-культурной лексикой.",
      },
      matn: {
        name: "ТЕКСТ",
        component: "Культуроведческий компонент",
        block: "Текстовый / культурный блок",
        description:
          "Осмысление социокультурного контекста через тексты, медиа и аутентичные материалы.",
      },
      munozara: {
        name: "ДИСКУССИЯ",
        component: "Коммуникативно-деятельностный компонент",
        block: "Речевой этикет / коммуникативный блок",
        description:
          "Дискуссии, обмен аргументами и развитие практических навыков межкультурной коммуникации.",
      },
      oyna: {
        name: "ЗЕРКАЛО",
        component: "Рефлексивный компонент",
        block: "Дополнительный рефлексивный компонент",
        description:
          "Самоанализ знаний, динамики лингвокультурологического роста и рефлексивный дневник.",
      },
    },
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: I18nContent;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "uz",
  setLang: () => {},
  t: DICTIONARY.uz,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("uz");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("trialog-lang") as Language | null;
      if (saved === "uz" || saved === "ru") {
        setLangState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = "uz";
      }
    } catch {
      // ignore SSR or storage exceptions
    }
  }, []);

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
    try {
      localStorage.setItem("trialog-lang", nextLang);
      document.documentElement.lang = nextLang;
    } catch {
      // ignore
    }
  };

  const value = {
    lang,
    setLang,
    t: DICTIONARY[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-border bg-card p-0.5 text-xs shadow-sm ${className}`}
      role="group"
      aria-label="Tilni tanlash / Выбор языка"
    >
      <button
        type="button"
        onClick={() => setLang("uz")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium transition-colors ${
          lang === "uz"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="O‘zbek tili"
      >
        <span className="font-semibold">{compact ? "UZ" : "O‘z"}</span>
      </button>

      <button
        type="button"
        onClick={() => setLang("ru")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium transition-colors ${
          lang === "ru"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Русский язык"
      >
        <span className="font-semibold">{compact ? "RU" : "Ру"}</span>
      </button>
    </div>
  );
}
