import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Flashbots Protect Explorer</title>
        <meta name="description" content="Check your savings as you explore Flashbots Protect data!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Flashbots Protect Explorer" />
        <meta property="og:description" content="Check your savings as you explore Flashbots Protect data!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protect-explorer.vercel.app" />
        <meta property="og:image" content="https://protect-explorer.vercel.app/opengraph-image.png" />
        <meta property="og:site_name" content="Flashbots Protect Explorer" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flashbots Protect Explorer" />
        <meta name="twitter:description" content="Check your savings as you explore Flashbots Protect data!" />
        <meta name="twitter:image" content="https://protect-explorer.vercel.app/opengraph-image.png" />
        <meta name="keywords" content="mev,flashbots,protect,blockchain,data,illuminate,democratize,distribute" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://protect-explorer.vercel.app" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}