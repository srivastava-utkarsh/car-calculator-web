import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-4285007880246877";

export const metadata: Metadata = {
  title: {
    default: "Car Loan EMI & Affordability Calculator India | BudgetGear",
    template: "%s | BudgetGear",
  },
  description: "Free car loan EMI, affordability and prepayment calculators for India. Use the 20/4/10 rule to find out how much car you can afford on your salary.",
  keywords: [
    "car loan EMI calculator",
    "car affordability calculator India",
    "car loan prepayment calculator",
    "how much car can I afford",
    "20/4/10 rule",
    "car budget calculator",
    "car loan calculator India",
    "EMI prepayment savings",
    "car loan interest rate India",
    "total car ownership cost",
  ],
  authors: [{ name: "Utkarsh Srivastava", url: "https://budgetgear.in/about/" }],
  creator: "Utkarsh Srivastava",
  publisher: "BudgetGear",
  category: "Finance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://budgetgear.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Car Loan EMI & Affordability Calculator India | BudgetGear",
    description: "Free car loan EMI, affordability and prepayment calculators for India. Use the 20/4/10 rule to find out how much car you can afford on your salary.",
    url: 'https://budgetgear.in/',
    siteName: 'BudgetGear',
    images: [
      {
        url: 'https://budgetgear.in/icon-512.png',
        width: 512,
        height: 512,
        alt: 'BudgetGear Car Finance Calculator Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Car Loan EMI & Affordability Calculator India | BudgetGear",
    description: "Free car loan EMI, affordability and prepayment calculators for India. Use the 20/4/10 rule to find out how much car you can afford on your salary.",
    images: ['https://budgetgear.in/icon-512.png'],
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
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#ffffff',
    'color-scheme': 'light',
  },
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
      sizes: '16x16 32x32',
      type: 'image/x-icon',
    },
    {
      rel: 'icon',
      url: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://budgetgear.in/#website",
      "name": "BudgetGear",
      "alternateName": "BudgetGear - Car Finance Calculators",
      "description": "Free car loan EMI, affordability and prepayment calculators for smart car purchasing decisions in India.",
      "url": "https://budgetgear.in/",
      "inLanguage": "en-IN",
      "publisher": {
        "@id": "https://budgetgear.in/#organization"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://budgetgear.in/#organization",
      "name": "BudgetGear",
      "url": "https://budgetgear.in/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://budgetgear.in/icon-512.png",
        "width": 512,
        "height": 512
      },
      "description": "Free financial calculators and educational guides for smart car purchasing decisions in India.",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "name": "Utkarsh Srivastava",
        "url": "https://budgetgear.in/about/"
      },
      "knowsAbout": [
        "Car Loan EMI Calculation",
        "Vehicle Affordability Assessment",
        "Loan Prepayment Strategies",
        "20/4/10 Car Buying Rule",
        "Financial Planning India"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "url": "https://budgetgear.in/contact/",
        "availableLanguage": "English"
      }
    }
  ];

  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32" type="image/x-icon" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon-512.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <CookieBanner />
        </ThemeProvider>
        {/* AdSense loader runs after hydration; the managed script it injects into <head>
            would otherwise displace hydration-tracked nodes and break hydration. Site
            connection for the AdSense review is covered by the google-adsense-account
            meta tag and ads.txt, both present in the static HTML. */}
        <Script
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
