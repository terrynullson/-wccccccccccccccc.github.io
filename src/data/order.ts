export type OrderItem = {
  id: string;
  title: string;
  meta: string;
  price: number;
  quantity: number;
};

export const orderItemsSeed: OrderItem[] = [
  {
    id: "ring-ag-1",
    title: "10322-001996 Кольцо (Ag 925)",
    meta: "000000-000000 Кольцо Ag 925; вставки: 4 Гранат овал 2,120ct; вес: 1,785 гр Позолота;",
    price: 1540,
    quantity: 1,
  },
  {
    id: "earring-ag-1",
    title: "111111-111111 Серьги Ag 925",
    meta: "вставки: 2 Гранат кр 4 0,655ct; вес: 1,827гр",
    price: 2190,
    quantity: 1,
  },
  {
    id: "bracelet-ag-1",
    title: "222222-222222 Браслет Ag 925",
    meta: "вставки: 6 Фианит кр 1,200ct; вес: 4,250 гр",
    price: 3480,
    quantity: 1,
  },
];

export const deliveryPrices: Record<string, number> = {
  logsis: 200,
  integral: 150,
  cdek: 350,
  dalli: 250,
  uvi: 300,
  "yandex-express": 500,
};

export const carriers = [
  { value: "logsis", label: "Логсис" },
  { value: "integral", label: "Интеграл" },
  { value: "cdek", label: "СДЭК" },
  { value: "dalli", label: "Далли" },
  { value: "uvi", label: "Доставка ЮВИ" },
  { value: "yandex-express", label: "Яндекс.Экспресс" },
] as const;

export const payments = [
  { value: "sbp", label: "СБП" },
  { value: "prepay", label: "Предоплата" },
  { value: "prepay-requisites", label: "Предоплата по реквизитам" },
  { value: "postpay", label: "Постоплата" },
  { value: "yandex-split", label: "Яндекс Сплит" },
  { value: "tinkoff-parts", label: "Тинькофф Долями" },
] as const;

export const pvzCarriers = ["cdek", "integral", "dalli"] as const;

export const pvzList = [
  {
    id: "pvz-1",
    name: "ПВЗ №1 - Центр города",
    address: "ул. Главная, дом 1",
    time: "Пн-Пт: 09:00-20:00, Сб-Вс: 10:00-18:00",
  },
  {
    id: "pvz-2",
    name: "ПВЗ №2 - Восток",
    address: "пр. Восточный, дом 50",
    time: "Пн-Пт: 10:00-21:00, Сб-Вс: 11:00-19:00",
  },
  {
    id: "pvz-3",
    name: "ПВЗ №3 - Запад",
    address: "ул. Западная, дом 100",
    time: "Пн-Вс: 08:00-22:00",
  },
] as const;
