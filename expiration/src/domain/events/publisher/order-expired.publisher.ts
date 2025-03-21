import { BasePublisher, OrderExpiredEvent, PublishEvent, Subjects } from "@vtex-tickets/common";

export class OrderExpiredPublisher extends BasePublisher<PublishEvent<OrderExpiredEvent>> {
  readonly subject = Subjects.OrderExpired;
}
