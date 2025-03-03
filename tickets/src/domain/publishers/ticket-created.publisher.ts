import { BasePublisher,  Subjects, PublishEvent, TicketCreatedEvent } from "@vtex-tickets/common";


export class TicketCreatedPublisher extends BasePublisher<PublishEvent<TicketCreatedEvent>> {
    readonly subject = Subjects.TicketCreated;
}

