import Layout from '../components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "flatpickr/dist/flatpickr.min.css";
import "../styles/globals.css";
import "../styles/satoshi.css";

function MyApp({ Component, pageProps }) {

  return (
    <Layout>
      <ToastContainer />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
