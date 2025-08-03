import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BudgetGear - Car Finance Calculator",
  description: "Smart car financing made simple. Calculate EMI, check affordability with 20/4/10 rule, and get instant loan insights with BudgetGear.",
  icons: {
    icon: "/budget_gear_logo.ico",
    shortcut: "/budget_gear_logo.ico",
    apple: "/brand_img.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/budget_gear_logo.ico" sizes="any" />
        <link rel="icon" href="/brand_img.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brand_img.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
