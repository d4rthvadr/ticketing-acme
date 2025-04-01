import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/ui/header.component";
import buildClient from "../api/build-client";

const MainApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container pt-5">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

MainApp.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);

  const response = await client
    .get("/api/users/currentuser")
    .catch((err) => {});

  let pageProps = {};
  const currentUser = response?.data?.currentUser;
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, currentUser);
  }

  return {
    pageProps,
    currentUser,
  };
};

export default MainApp;
