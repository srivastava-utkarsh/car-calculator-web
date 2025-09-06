import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
// import MUIThemeProvider from "@/components/MUIThemeProvider"; // Temporarily disabled

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
  metadataBase: new URL('https://budgetgear.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BudgetGear - Car Finance Calculator | EMI Calculator & Loan Affordability Tool",
    description: "Calculate car EMI, check loan affordability with the proven 20/4/10 rule, and make smart car financing decisions. Free online car loan calculator with instant results.",
    url: 'https://budgetgear.in',
    siteName: 'BudgetGear',
    images: [
      {
        url: 'https://budgetgear.in/brand_img.png',
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
    images: ['https://budgetgear.in/brand_img.png'],
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
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "BudgetGear Car Finance Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate car EMI, check loan affordability with the proven 20/4/10 rule, and make smart car financing decisions. Free online car loan calculator with instant results.",
      "url": "https://budgetgear.in",
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
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the 20/4/10 rule for car buying?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The 20/4/10 rule is a smart car buying guideline that suggests: 20% Down Payment (pay at least 20% upfront to reduce loan amount), 4 Years Maximum (keep loan tenure under 4 years to minimize interest), and 10% of Income (total monthly car expenses should not exceed 10% of gross monthly income)."
          }
        },
        {
          "@type": "Question", 
          "name": "How is EMI calculated for car loans?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "EMI is calculated using the PMT formula: EMI = P × r × (1+r)^n / [(1+r)^n - 1], where P is principal loan amount (car price - down payment), r is monthly interest rate (annual rate ÷ 12 ÷ 100), and n is total number of months (tenure × 12)."
          }
        },
        {
          "@type": "Question",
          "name": "What factors should I consider for car loan affordability?", 
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Key factors include: monthly income (determines EMI capacity), existing EMIs (reduce borrowing capacity), down payment (higher down payment means lower EMI), interest rate (affects monthly payment), loan tenure (longer tenure means lower EMI but higher total interest), and additional costs like insurance, maintenance, fuel, and parking."
          }
        },
        {
          "@type": "Question",
          "name": "Should I choose a longer or shorter loan tenure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Shorter tenure (2-3 years) offers lower total interest, higher monthly EMI, faster equity building, and less financial risk. Longer tenure (5-7 years) provides lower monthly EMI, more budget flexibility, but higher total interest cost and greater financial risk. Follow the 20/4/10 rule and keep it under 4 years for optimal balance."
          }
        },
        {
          "@type": "Question",
          "name": "How much down payment should I make?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Minimum: 10-15% (lender requirement), Recommended: 20-25% (20/4/10 rule), Optimal: 30-40% (if surplus funds available). Higher down payment benefits include lower EMI, reduced total interest cost, better loan approval chances, and less risk of being underwater on the loan."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://budgetgear.in"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Car Loan Calculator",
          "item": "https://budgetgear.in"
        }
      ]
    }
  ];

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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
