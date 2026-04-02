/**
 * Itens mock para o hóspede informar consumo do quarto (frigobar, amenities, etc.).
 * Valores ilustrativos — ligados a `addExpense` no HotelContext.
 */
export type RoomConsumptionCategory =
  | "accommodation"
  | "food"
  | "service"
  | "other";

export interface GuestRoomCatalogItem {
  id: string;
  label: string;
  price: number;
  category: RoomConsumptionCategory;
  /** Ex.: "Unidade" para clareza no extrato */
  unit?: string;
}

export const GUEST_ROOM_CONSUMPTION_CATALOG: GuestRoomCatalogItem[] = [
  {
    id: "fb-agua",
    label: "Água mineral 500ml",
    price: 8,
    category: "food",
    unit: "garrafa",
  },
  {
    id: "fb-refrigerante",
    label: "Refrigerante lata",
    price: 10,
    category: "food",
    unit: "unidade",
  },
  {
    id: "fb-cerveja",
    label: "Cerveja long neck",
    price: 14,
    category: "food",
    unit: "unidade",
  },
  {
    id: "fb-snack",
    label: "Mix de snacks / amendoins",
    price: 18,
    category: "food",
    unit: "pacote",
  },
  {
    id: "fb-chocolate",
    label: "Barra de chocolate",
    price: 12,
    category: "food",
    unit: "unidade",
  },
  {
    id: "amenities-kit",
    label: "Kit amenities extra (escova + pasta)",
    price: 25,
    category: "service",
    unit: "kit",
  },
  {
    id: "roupao-extra",
    label: "Roupão de banho extra",
    price: 35,
    category: "service",
    unit: "unidade",
  },
  {
    id: "lavanderia-peca",
    label: "Lavanderia — peça avulsa",
    price: 22,
    category: "service",
    unit: "peça",
  },
  {
    id: "cafe-extra",
    label: "Cápsulas de café extras (10 un.)",
    price: 20,
    category: "food",
    unit: "caixa",
  },
];
