import EmptyState from "../../../components/shared/empty-state";

const TicketItem = ({ currentUser, ticket, client }) => {
  console.log("peek:args", ticket);

  if (!ticket) {
    return (
      <EmptyState
        message="Ticket not found"
        subText="Please check the ticket ID and try again"
      />
    );
  }
  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <h1 className="text-center">Ticket</h1>
      <p className="text-center">Ticket details will be displayed here.</p>
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
