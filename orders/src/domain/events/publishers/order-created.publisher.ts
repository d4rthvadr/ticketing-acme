import { BasePublisher, Subjects, PublishEvent, OrderCreatedEvent } from "@vtex-tickets/common";
export class OrderCreatedPublisher extends BasePublisher<PublishEvent<OrderCreatedEvent>> {
  readonly subject = Subjects.OrderCreated;
}
