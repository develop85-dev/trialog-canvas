export const PHRASE_BANK: { group: string; items: string[] }[] = [
  {
    group: "Fikr bildirish",
    items: [
      "Menimcha, ...",
      "Mening nazarimda, ...",
      "Shuni ta’kidlamoqchimanki, ...",
      "Mening fikrim shundan iboratki, ...",
    ],
  },
  {
    group: "Rozilik bildirish",
    items: [
      "Siz bilan to‘liq qo‘shilaman.",
      "Bu fikrni qo‘llab-quvvatlayman.",
      "To‘g‘ri ta’kidladingiz.",
    ],
  },
  {
    group: "Muloyim e’tiroz",
    items: [
      "Ruxsat bersangiz, boshqacha fikr bildirsam.",
      "Bu masalaga boshqa tomondan qarash mumkin.",
      "Qisman qo‘shilaman, ammo ...",
    ],
  },
  {
    group: "Dalil keltirish",
    items: [
      "Masalan, ...",
      "Bunga misol sifatida ... ni keltirish mumkin.",
      "Tajribamdan kelib chiqib aytsam, ...",
    ],
  },
  {
    group: "Qiyoslash",
    items: [
      "O‘z madaniyatimizda ..., ... madaniyatida esa ...",
      "Ikkala madaniyatda ham ...",
      "Asosiy farq shundaki, ...",
    ],
  },
  {
    group: "Xulosa qilish",
    items: [
      "Xulosa qilib aytganda, ...",
      "Shunday qilib, ...",
      "Yuqoridagilardan kelib chiqib, ...",
    ],
  },
];

export const POPS = [
  { key: "p", label: "P — Pozitsiya", hint: "Sizning asosiy fikringiz nima?" },
  {
    key: "o",
    label: "O — Ona madaniyati / tajriba",
    hint: "O‘z madaniyatingiz yoki tajribangizdan misol.",
  },
  { key: "d", label: "P — Dalil", hint: "Fikringizni qanday dalil tasdiqlaydi?" },
  { key: "s", label: "S — Xulosa", hint: "Yakuniy xulosangiz." },
] as const;
