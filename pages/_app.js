import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis';

function MyApp({ Component, pageProps }) {
  console.log(`${process.env.NEXT_PUBLIC_MORALIS_APPID}`);
  return <MoralisProvider
    appId={`${process.env.NEXT_PUBLIC_MORALIS_APPID}`}
    serverUrl={`${process.env.NEXT_PUBLIC_MORALIS_SERVERURL}`}
  >
    <Component {...pageProps} />
  </MoralisProvider>
}

export default MyApp
