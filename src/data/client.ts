export type ClientField = {
  id: string;
  label: string;
  value: string;
  type?: "text" | "email" | "tel";
  span?: 1 | 2 | 3;
};

export const clientMainFields: ClientField[] = [
  { id: "client-tier", label: "Класс клиента", value: "ААА" },
  { id: "client-code", label: "Код клиента", value: "000000-00000" },
  { id: "client-last", label: "Фамилия", value: "Иванова" },
  { id: "client-first", label: "Имя", value: "Мария" },
  { id: "client-middle", label: "Отчество", value: "Сергеевна" },
  { id: "client-birth", label: "Дата рождения", value: "12.05.1991" },
];

export const clientContactFields: ClientField[] = [
  { id: "client-phone-main", label: "Телефон", value: "+7 909 953-75-59", type: "tel", span: 2 },
  { id: "client-phone-alt", label: "Доп.тел", value: "+7 909 953-75-59", type: "tel", span: 2 },
  { id: "client-phone-work", label: "Раб.тел", value: "+7 909 953-75-59", type: "tel", span: 2 },
  { id: "client-email", label: "E-mail", value: "dableev@ves-contact.com", type: "email", span: 2 },
];

export const clientAddressFields: ClientField[] = [
  { id: "client-country", label: "Страна", value: "Россия" },
  { id: "client-zip", label: "Индекс", value: "127521" },
  { id: "client-region", label: "Область/край", value: "Москва" },
  { id: "client-city", label: "Населённый пункт", value: "Москва" },
  { id: "client-district", label: "Р-н", value: "" },
  { id: "client-street", label: "Улица", value: "Веткина" },
  { id: "client-house", label: "Дом", value: "" },
  { id: "client-corpus", label: "Корпус", value: "" },
  { id: "client-flat", label: "Квартира", value: "" },
];

export const clientTabs = [
  { id: "main", label: "Осн.инф." },
  { id: "orders", label: "Заказы" },
  { id: "site", label: "Сайт" },
  { id: "history", label: "Ист." },
  { id: "tickets", label: "Тик." },
  { id: "mcr", label: "Mcr" },
  { id: "advance", label: "Аванс" },
  { id: "bonus", label: "Бонус" },
  { id: "parking", label: "Парковка" },
  { id: "graph", label: "Граф." },
] as const;

export type ClientTabId = typeof clientTabs[number]["id"];
