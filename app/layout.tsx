import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SessionWrapper from "./component/SessionWrapper";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Simple Expense tracker to t your spendings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
      </SessionWrapper>     
    </html>
  );
}
