import EmptyState from "../components/shared/empty-state";
import { WarningAlert } from "../components/ui/alert.component";
import TableComponent from "../components/ui/table.component";

const LandingPage = ({ tickets }) => {
  return (
    <>
      <WarningAlert message={"Grab your free promo"} show={true} />
      <TableComponent
        data={tickets}
        dataHeaders={["ID", "Title", "Price", "Created On", "Actions"]}
        dataMapper={({ id, title, price, createdAt }) => ({
          id: { value: id, type: "link", href: `/admin/tickets/${id}` },
          title: { value: title },
          price: { value: price },
          createdAt: { value: new Date(createdAt).toLocaleString() },
        })}
        rowActions={() => [
          { label: "Edit", href: `/tickets/edit/${id}` },
          { label: "Delete", href: `/tickets/delete/${id}` },
        ]}
        emptyState={
          <EmptyState
            message="No tickets found"
            subText="Please create a ticket"
          />
        }
      />
    </>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets/admin");
  return {
    currentUser,
    tickets: data,
  };
};

export default LandingPage;
