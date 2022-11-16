import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return <MoralisProvider
    appId={`${process.env.NEXT_PUBLIC_MORALIS_APPID}`}
    serverUrl={`${process.env.NEXT_PUBLIC_MORALIS_SERVERURL}`}
  >
    <Component {...pageProps} />
  </MoralisProvider>
}

export default MyApp
