'use client'

import "./globals.css";
import { DataProvider } from "./context/DataContext";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Flashbots Protect Explorer</title>
        <meta name="description" content="Check your savings as you explore Flashbots Protect data!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Flashbots Protect Explorer" />
        <meta property="og:description" content="Check your savings as you explore Flashbots Protect data!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protect-explorer.vercel.app" />
        <meta property="og:image" content="https://protect.flashbots.net/og-image.png" />
        <meta property="og:site_name" content="Flashbots Protect Explorerer" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flashbots Protect Explorer" />
        <meta name="twitter:description" content="Check your savings as you explore Flashbots Protect data!" />
        <meta name="twitter:image" content="https://protect.flashbots.net/og-image.png" />
        <meta name="keywords" content="mev,flashbots,protect,blockchain,data,illuminate,democratize,distribute" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://protect-explorer.vercel.app" />
      </Head>
      <body className="font-dogicapixel">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
