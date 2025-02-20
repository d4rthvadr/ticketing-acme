import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/ui/header.component';
import buildClient from '../api/build-client';

const MainApp = ({ Component, pageProps, currentUser }) => {

    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    )
};


MainApp.getInitialProps = async ({ Component, ctx }) => {
    const client = buildClient(ctx);


    const response = await client.get('/api/users/currentuser').catch(err => { });

    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return {
        pageProps,
        ...response?.data
    }
}

export default MainApp;