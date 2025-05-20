import { useEffect, useState } from "react";
import EmptyState from "../../components/shared/empty-state";
import { OrderStatus } from "../../enums/order-status.enum";
import StripeCheckout from "react-stripe-checkout";
import { Currencies } from "../../enums/currencies.enum";
import useRequest from "../../hooks/use-request";
import ErrorAlert from "../../components/shared/error-alert";
import Router from "next/router";

const ErrorMessage = {
  [OrderStatus.Cancelled]: "Order has been cancelled",
  [OrderStatus.Complete]: "Order has been completed",
};
const OrderItem = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  if (!order) {
    return <EmptyState message={"Order not found"} />;
  }

  const { ticket, status } = order;
  const isOrderValid = order.status === OrderStatus.Created;

  useEffect(() => {
    const findTimeLeft = () => {
      const secondsRemaining = Math.floor(
        (new Date(order.expiresAt) - new Date()) / 1000
      );

      if (secondsRemaining <= 0) {
        setTimeLeft(0);
        return;
      }
      setTimeLeft(secondsRemaining);
    };

    findTimeLeft(); // Call it immediately to set the initial state

    const timer = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const { doRequest, errors } = useRequest({
    url: `/api/payments/${order.id}/charge`,
    method: "post",
    onSuccess: (_) => Router.push("/orders"),
  });

  const errorMessage = ErrorMessage[order.status] ?? "Order not found";

  if (!isOrderValid || timeLeft <= 0) {
    return (
      <EmptyState
        message={errorMessage}
        onRedirect={() => Router.push("/orders")}
      />
    );
  }

  return (
    <div
      className="card"
      style={{ width: "38rem", margin: "0 auto", marginTop: "50px" }}
    >
      <div className="card-body">
        <ErrorAlert errors={errors} />

        <h3>{ticket.title}</h3>
        <h4>Price: {ticket.price}</h4>
        <h4>Status: {status}</h4>

        {isOrderValid && (
          <>
            <h4>Expires in: {timeLeft} seconds</h4>

            <StripeCheckout
              token={({ id }) => {
                // Handle the token here
                console.log("Token received:", id);
                doRequest({
                  body: {
                    orderId: order.id,
                    token: id,
                  },
                });
              }}
              stripeKey="pk_test_51R5MTJEHSfjg5yaH5qR6KNBnHuAuAyVJbXdpbvVpzcDp3jC1b6w2IPeA1qY9XT5ar09VeU43oA6fFF5i8EUgXhzJ00rNib3yXN"
              amount={ticket.price * 100} // Amount in cents
              currency={Currencies.USD}
            />
          </>
        )}
      </div>
    </div>
  );
};

OrderItem.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return {
    order: data,
  };
};

export default OrderItem;
