import EmptyState from "../../components/shared/empty-state";
import useRequest from "../../hooks/use-request";
import ErrorAlert from "../../components/shared/error-alert";
import Router from "next/router";

const TicketItem = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push(`/orders/[orderId]`, `/orders/${order.id}`),
  });

  if (!ticket) {
    return (
      <EmptyState
        message="Ticket not found"
        subText="Please check the ticket ID and try again"
      />
    );
  }

  // if (ticket.orderId) {
  //   return (
  //     <EmptyState
  //       message="Ticket not available"
  //       subText="Ticket currently being purchased"
  //     />
  //   );
  // }
  return (
    <div
      className="card"
      style={{ width: "38rem", margin: "0 auto", marginTop: "50px" }}
    >
      <ErrorAlert errors={errors} />

      <div className="card-body">
        <h3>{ticket.title}</h3>
        <h4>Price: {ticket.price}</h4>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => doRequest()}
        >
          Purchase
        </button>
      </div>
    </div>
  );
};

TicketItem.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/admin/${ticketId}`);
  return {
    currentUser,
    ticket: data,
    client,
  };
};

export default TicketItem;
