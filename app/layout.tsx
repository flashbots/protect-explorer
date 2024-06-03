'use client'

import "./globals.css";
import { DataProvider } from "./context/DataContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-dogicapixel">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
