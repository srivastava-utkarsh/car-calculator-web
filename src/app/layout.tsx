import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
// import MUIThemeProvider from "@/components/MUIThemeProvider"; // Temporarily disabled

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

export const metadata: Metadata = {
  title: "Car Affordability Calculator | Car Loan EMI Calculator & Prepayment Estimator India",
  description: "Calculate car affordability, EMI, and prepayment savings with professional calculator. Check loan eligibility, compare scenarios, and save interest. How much car can I afford on my salary?",
  keywords: [
    "car affordability calculator",
    "car loan eligibility calculator", 
    "how much car can I afford",
    "car budget calculator",
    "vehicle affordability tool",
    "salary car calculator",
    "EMI calculator car",
    "car payment calculator",
    "car purchase estimator",
    "buy a car calculator",
    "car loan prepayment calculator",
    "car loan prepayment penalty",
    "car loan foreclosure",
    "car loan part payment",
    "prepayment calculator car loan",
    "prepayment of car loan",
    "car loan prepayment charges",
    "car loan early closure calculator",
    "how much car can I afford on my salary",
    "what is a good down payment for a car",
    "best way to pay off car loan early",
    "should I prepay car loan",
    "pros and cons of prepaying car loan",
    "car loan prepayment strategy India",
    "20/4/10 rule",
    "car financing",
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
    title: "Car Affordability Calculator | Car Loan EMI Calculator & Prepayment Estimator India",
    description: "Calculate car affordability, EMI, and prepayment savings with professional calculator. Check loan eligibility, compare scenarios, and save interest. How much car can I afford on my salary?",
    url: 'https://budgetgear.in',
    siteName: 'BudgetGear',
    images: [
      {
        url: 'https://budgetgear.in/bck-logo.svg',
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
    title: "Car Affordability Calculator | Car Loan EMI Calculator & Prepayment Estimator India",
    description: "Calculate car affordability, EMI, and prepayment savings with professional calculator. Check loan eligibility, compare scenarios, and save interest.",
    images: ['https://budgetgear.in/bck-logo.svg'],
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/bck-logo.svg",
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
      "name": "Car Affordability Calculator | BudgetGear",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate car affordability, car loan EMI, and prepayment savings. Check loan eligibility with 20/4/10 rule. Professional prepayment calculator for smart car financing decisions.",
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
        "Car Affordability Calculator",
        "Car Loan Eligibility Calculator", 
        "EMI Calculator Car",
        "Car Loan Prepayment Calculator",
        "20/4/10 Rule Validation",
        "Car Budget Calculator",
        "Vehicle Affordability Tool",
        "Salary Car Calculator",
        "Car Payment Calculator",
        "Prepayment Penalty Calculator",
        "Car Loan Foreclosure Calculator",
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
        },
        {
          "@type": "Question",
          "name": "Should I prepay my car loan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prepaying car loans can save significant interest if: you have surplus funds, loan interest rate is high (>10%), you have no penalty (floating rate loans), and you lack higher-return investment options. Consider prepayment penalty, tax benefits, and opportunity cost before deciding."
          }
        },
        {
          "@type": "Question",
          "name": "What is car loan prepayment penalty?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Car loan prepayment penalty is a charge for paying off your loan early. Industry standard: 0% penalty for floating rate loans, 2-5% penalty for fixed rate loans. Always check with your bank before prepaying to understand charges and calculate net savings."
          }
        },
        {
          "@type": "Question",
          "name": "How much car can I afford on my salary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Follow the 20/4/10 rule: 20% down payment, 4 years max tenure, 10% of gross monthly income for total car expenses (EMI + insurance + fuel + maintenance). Example: ₹50,000 salary = ₹5,000 max monthly car expenses, ₹15-20 lakh car affordability."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Car Loan Prepayment Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Professional car loan prepayment calculator. Calculate prepayment savings, penalty charges, and compare scenarios for early loan closure.",
      "url": "https://budgetgear.in/prepayment",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "featureList": [
        "Car Loan Prepayment Calculator",
        "Prepayment Penalty Calculator",
        "Interest Savings Calculator", 
        "Loan Tenure Reduction",
        "Industry Standard Compliance",
        "Fixed vs Floating Rate Comparison"
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/bck-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/bck-logo.svg" />
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
