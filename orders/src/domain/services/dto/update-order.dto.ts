import { OrderStatus } from "@vtex-tickets/common";

export interface UpdateOrderDto {
  orderId: string;
  status: OrderStatus;
}
