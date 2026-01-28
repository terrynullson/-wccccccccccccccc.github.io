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
