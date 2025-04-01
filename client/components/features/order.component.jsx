import { Card, CardHeader, CardBody } from "../ui/card.component";

export default ({ id, title, price, status, children }) => {
  return (
    <Card>
      <CardHeader title="Order Details" />
      <CardBody>
        <h3>{title}</h3>
        <h4>Price: {price}</h4>
        <h4>Status: {status}</h4>
        {children}
      </CardBody>
    </Card>
  );
};
