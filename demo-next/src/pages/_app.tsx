import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Script type='module' strategy='beforeInteractive' src="/src/lib/sql.js" />
      <Script type='module' strategy='beforeInteractive' src="/src/lib/genanki.js" />
    </>
  )
}
