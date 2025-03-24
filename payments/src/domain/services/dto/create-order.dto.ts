import { OrderStatus } from "@vtex-tickets/common";

export interface CreateOrderDto {
  id: string;
  status: OrderStatus;
  userId: string;
  version: number;
  price: number;
}
