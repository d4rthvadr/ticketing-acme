import { BasePublisher,  Subjects, PublishEvent, TicketUpdatedEvent } from "@vtex-tickets/common";


export class TicketUpdatedPublisher extends BasePublisher<PublishEvent<TicketUpdatedEvent>> {
    readonly subject = Subjects.TicketUpdated;
}

