import { getCurrentUser } from "../api";

const LandingPage = ({ currentUser }) => {

  const hasSession = !!currentUser;

  const content = hasSession ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
  return content;
};

LandingPage.getInitialProps = async (context) => {

  const  response  = await getCurrentUser(context)

  return {
    currentUser: response?.data ?? null,
  };
}

export default LandingPage;
