import {
  BasePublisher,
  Subjects,
  PublishEvent,
  PaymentCreatedEvent,
} from "@vtex-tickets/common";
export class PaymentCreatedPublisher extends BasePublisher<
  PublishEvent<PaymentCreatedEvent>
> {
  readonly subject = Subjects.PaymentCreated;
}
