import Router from "next/router";

const EmptyState = ({
  message = "No data found",
  onRedirect = () => Router.push("/"),
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h1 className="text-center">{message}</h1>
        <div className="text-center">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => onRedirect()}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};
export default EmptyState;
