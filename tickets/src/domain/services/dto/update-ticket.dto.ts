export interface UpdateTicketDto {
    id: string;
    title: string;
    price: number;
    userId: string;
    orderId?: string | null;
}