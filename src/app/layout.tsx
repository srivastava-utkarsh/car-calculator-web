import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MUIThemeProvider from "@/components/MUIThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BudgetGear - Car Finance Calculator | EMI Calculator & Loan Affordability Tool",
  description: "Calculate car EMI, check loan affordability with the proven 20/4/10 rule, and make smart car financing decisions. Free online car loan calculator with instant results and affordability insights.",
  keywords: [
    "car loan calculator",
    "EMI calculator",
    "car finance calculator", 
    "auto loan calculator",
    "car affordability calculator",
    "loan EMI calculation",
    "car loan EMI",
    "vehicle finance calculator",
    "20/4/10 rule",
    "car financing",
    "budget calculator",
    "loan affordability"
  ],
  authors: [{ name: "BudgetGear" }],
  creator: "BudgetGear",
  publisher: "BudgetGear",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://budgetgear.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BudgetGear - Car Finance Calculator | EMI Calculator & Loan Affordability Tool",
    description: "Calculate car EMI, check loan affordability with the proven 20/4/10 rule, and make smart car financing decisions. Free online car loan calculator with instant results.",
    url: 'https://budgetgear.com',
    siteName: 'BudgetGear',
    images: [
      {
        url: '/brand_img.png',
        width: 1200,
        height: 630,
        alt: 'BudgetGear Car Finance Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BudgetGear - Car Finance Calculator | EMI Calculator & Loan Affordability Tool",
    description: "Calculate car EMI, check loan affordability with the proven 20/4/10 rule, and make smart car financing decisions. Free online calculator.",
    images: ['/brand_img.png'],
    creator: '@BudgetGear',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code-here',
  },
  icons: {
    icon: "/bck-co-logo.ico",
    shortcut: "/bck-co-logo.ico",
    apple: "/brand_img.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "BudgetGear Car Finance Calculator",
    "applicationCategory": "FinanceApplication",
    "description": "Calculate car EMI, check loan affordability with the proven 20/4/10 rule, and make smart car financing decisions. Free online car loan calculator with instant results.",
    "url": "https://budgetgear.com",
    "author": {
      "@type": "Organization",
      "name": "BudgetGear"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "Car EMI Calculator",
      "Loan Affordability Check", 
      "20/4/10 Rule Validation",
      "Interest Rate Calculator",
      "Down Payment Calculator",
      "Total Cost Analysis"
    ],
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript"
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/bck-co-logo.ico" sizes="any" />
        <link rel="icon" href="/brand_img.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brand_img.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MUIThemeProvider>
          {children}
        </MUIThemeProvider>
      </body>
    </html>
  );
}
