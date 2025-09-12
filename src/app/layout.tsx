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
  title: "Car Loan EMI Calculator India | Best Car Affordability Calculator Online India",
  description: "Best car loan EMI calculator online India. Calculate car affordability, interest rate, prepayment savings with 20/4/10 rule. Free budget car EMI calculator with prepayment analysis.",
  keywords: [
    "car loan emi calculator",
    "car affordability calculator India",
    "car loan interest rate calculator",
    "best car loan calculator online India",
    "budget car EMI calculator",
    "car purchase loan eligibility calculator",
    "car loan repayment schedule",
    "car EMI with prepayment calculator",
    "20/4/10 car rule India",
    "total car cost calculator",
    "vehicle finance eligibility calculator",
    "car EMI calculator with prepayment",
    "new car loan calculator",
    "loan against car calculator",
    "calculate EMI for car loan",
    "car finance calculator India",
    "car loan process India",
    "loan prepayment calculator India",
    "prepay car loan India",
    "car loan prepayment charges",
    "prepayment vs foreclosure car loan",
    "car loan part payment calculator",
    "car loan prepayment penalty India",
    "loan prepayment interest savings",
    "best time to prepay car loan India",
    "zero prepayment penalty car loan",
    "how to lower car EMI India",
    "car loan calculator with part payment",
    "car finance calculator for used cars",
    "car affordability calculator",
    "car loan eligibility calculator", 
    "how much car can I afford",
    "car budget calculator",
    "vehicle affordability tool",
    "salary car calculator",
    "EMI calculator car",
    "car payment calculator",
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
    title: "Car Loan EMI Calculator India | Best Car Affordability Calculator Online India",
    description: "Best car loan EMI calculator online India. Calculate car affordability, interest rate, prepayment savings with 20/4/10 rule. Free budget car EMI calculator with prepayment analysis.",
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
    title: "Car Loan EMI Calculator India | Best Car Affordability Calculator Online India",
    description: "Best car loan EMI calculator online India. Calculate car affordability, interest rate, prepayment savings with 20/4/10 rule.",
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
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/bck-logo.svg", sizes: "any", type: "image/svg+xml" }
    ],
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
      "@type": "WebSite",
      "name": "BudgetGear - Car Finance Calculators",
      "description": "Professional car finance calculators and tools for smart car purchasing decisions. Calculate affordability, EMI, and prepayment savings.",
      "url": "https://budgetgear.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://budgetgear.in/car-affordability-calculator",
        "query-input": "required name=search_term_string"
      },
      "author": {
        "@type": "Organization",
        "name": "BudgetGear",
        "logo": {
          "@type": "ImageObject",
          "url": "https://budgetgear.in/bck-logo.svg",
          "width": 200,
          "height": 200
        }
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
      "url": "https://budgetgear.in/car-loan-prepayment-calculator",
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
      "@type": "Organization",
      "name": "BudgetGear",
      "url": "https://budgetgear.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://budgetgear.in/bck-logo.svg",
        "width": 200,
        "height": 200,
        "contentUrl": "https://budgetgear.in/bck-logo.svg"
      },
      "description": "Professional financial calculators for smart financial decisions. Calculate car affordability, loan EMI, and prepayment savings.",
      "sameAs": [
        "https://budgetgear.in"
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
          "name": "Car Affordability Calculator",
          "item": "https://budgetgear.in/car-affordability-calculator"
        },
        {
          "@type": "ListItem", 
          "position": 3,
          "name": "Car Loan Prepayment Calculator", 
          "item": "https://budgetgear.in/car-loan-prepayment-calculator"
        }
      ]
    }
  ];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/bck-logo.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/bck-logo.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
        ></script>
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
