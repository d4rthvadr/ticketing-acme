import EmptyState from "../../components/empty-state";
import TableComponent from "../../components/ui/table.component";

const OrderList = ({ currentUser, orders }) => {
  return (
    <div>
      <TableComponent
        data={orders}
        dataHeaders={[
          "ID",
          "Ticket ID",
          "Title",
          "Price",
          "Status",
          "Expires in",
        ]}
        dataMapper={({ id, ticket, status, expiresAt, createdAt }) => ({
          id: { value: id, type: "link", href: `/orders/${id}` },
          ticketId: {
            value: ticket.id,
            type: "link",
            href: `/tickets/${ticket.id}`,
          },
          title: { value: ticket.title },
          price: { value: ticket.price },
          status: { value: status },
          expiresAt: { value: expiresAt },
        })}
        emptyState={<EmptyState message="No orders found" />}
      />
    </div>
  );
};

OrderList.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/orders");
  console.log("Orders data:", data);
  return {
    currentUser,
    orders: data,
  };
};

export default OrderList;
