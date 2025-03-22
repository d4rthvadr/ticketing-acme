import { BasePublisher, Subjects, PublishEvent, OrderCancelledEvent } from "@vtex-tickets/common";
export class OrderCancelledPublisher extends BasePublisher<PublishEvent<OrderCancelledEvent>> {
  readonly subject = Subjects.OrderCancelled;
}
