const ErrorAlert = ({ errors }) => {
  if (!errors || errors?.length === 0) {
    return null;
  }

  return (
    <div className="alert alert-danger">
      <ul className="my-0">
        {errors.map((err, i) => (
          <li key={err + i}>{err}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorAlert;
