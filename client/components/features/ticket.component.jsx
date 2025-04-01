import { Card, CardHeader, CardBody } from "../ui/card.component";

export default ({ title, price, showBtn, isDisabled, onClickCb }) => {
  return (
    <Card>
      <CardHeader title="Ticket Details" />
      <CardBody>
        <h3>{title}</h3>
        <h4>Price: {price}</h4>

        {showBtn && (
          <button
            isDisabled={isDisabled}
            className="btn btn-primary"
            type="button"
            onClick={() => onClickCb()}
          >
            Purchase
          </button>
        )}
      </CardBody>
    </Card>
  );
};
