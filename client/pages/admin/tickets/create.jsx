import { useState } from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import ErrorAlert from "../../../components/shared/error-alert";

export default () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [valErrors, setValErrors] = useState([]);

  const parsePrice = (price) => {
    const value = parseFloat(price);
    if (isNaN(value) || value <= 0) {
      return;
    }

    return value.toFixed(2);
  };

  const { doRequest, errors } = useRequest({
    url: "/api/tickets/admin",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/tickets"),
  });

  const onSubmit = async (ev) => {
    ev.preventDefault();

    // Validate the price
    if (isNaN(price) || price <= 0) {
      setValErrors(["Price must be a positive number"]);
      return;
    }
    // Validate the title
    if (title.trim() === "") {
      setValErrors(["Title cannot be empty"]);
      return;
    }

    await doRequest();
  };

  return (
    <div
      className="card"
      style={{ width: "38rem", margin: "0 auto", marginTop: "50px" }}
    >
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <h1>New ticket</h1>

          <ErrorAlert errors={errors} />
          <ErrorAlert errors={valErrors} />

          <div className="form-group">
            <label>Title</label>
            <input
              required
              className="form-control"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              required
              className="form-control"
              type="text"
              value={price}
              onBlur={() => setPrice(parsePrice(price))}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-3">Create</button>
        </form>
      </div>
    </div>
  );
};
