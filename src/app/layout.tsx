import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./fonts/material-symbols.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Mailbox - AI-Powered Email Client",
  description: "Next-generation intelligent email client prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
