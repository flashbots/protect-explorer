import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashbots Protect Explorer",
  description: "Get protected today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-dogicapixel">{children}</body>
    </html>
  );
}
