const Card = ({ children }) => {
  return (
    <div className="card">
      <div className="card-body">{children}</div>
    </div>
  );
};

const CardImage = ({ src, alt }) => {
  return <img src={src} alt={alt} className="card-img-top" />;
};

const CardHeader = ({ title }) => {
  return (
    <div className="card-header">
      <h1>{title}</h1>
    </div>
  );
};
const CardBody = ({ children }) => {
  return <div className="card-body">{children}</div>;
};

const CardFooter = ({ children }) => {
  return <div className="card-footer">{children}</div>;
};
export { Card, CardImage, CardHeader, CardBody, CardFooter };
