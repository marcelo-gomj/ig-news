import { AppProps } from 'next/app'
import '../styles/globals.scss'
import { Header } from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
