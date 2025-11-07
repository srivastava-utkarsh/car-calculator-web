import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CookieBanner from "@/components/CookieBanner";
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
  title: "Car Buying Calculator - Calculate Your Ideal Car Budget | Loan EMI Prepayment Calculator | How Much Car Can I Afford?",
  description: "Car Buying Calculator - Figure out the total buying and monthly cost of the car and make affordability decision accordingly. Reduce loan faster, reduce EMI faster. Get overall cost of running a car monthly basis after purchase. Calculate total car ownership expenses.",
  keywords: [
    "car buying calculator",
    "calculate your ideal car budget", 
    "how much car can I afford",
    "car budget based on income",
    "car budget calculator salary",
    "how to calculate a car budget",
    "want to buy a new car",
    "how much you can spend car",
    "loan EMI prepayment calculator",
    "car loan prepayment calculator",
    "EMI prepayment savings",
    "loan prepayment interest calculator",
    "prepayment calculator EMI",
    "total buying cost of car",
    "monthly cost of car",
    "figure out total buying cost car",
    "make affordability decision",
    "reduce loan faster",
    "reduce EMI faster",
    "overall cost of running car monthly",
    "monthly car running cost calculator",
    "total car ownership cost",
    "car monthly expenses calculator",
    "car loan emi calculator",
    "car affordability calculator India", 
    "car afford budget calculator India",
    "car budget afford calculator",
    "affordable car budget India",
    "car loan interest rate calculator",
    "best car loan calculator online India",
    "budget car EMI calculator",
    "car purchase loan eligibility calculator",
    "car loan repayment schedule",
    "car EMI with prepayment calculator",
    "20/4/10 car rule India",
    "20/4/10 car buying rule",
    "20 4 10 rule car loan",
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
    "can I buy a car",
    "should I buy a car",
    "car within my budget",
    "car buying capacity calculator",
    "car I can purchase with income",
    "which car suits my salary",
    "best car for my budget",
    "car affordability based on income",
    "car budget calculator",
    "vehicle affordability tool",
    "salary car calculator",
    "EMI calculator car",
    "car payment calculator",
    "20/4/10 rule",
    "20 percent down payment rule",
    "4 year car loan rule", 
    "10 percent income rule car",
    "car buying rule",
    "car financing",
    "loan affordability",
    "car under 10 lakh India",
    "best mileage cars India",
    "fuel efficient cars India",
    "budget friendly cars",
    "most economical cars India",
    "affordable cars India",
    "car loan eligibility India",
    "car loan interest rate India",
    "car loan documents required",
    "car loan approval",
    "used car loan calculator",
    "new car loan calculator",
    "auto loan calculator India",
    "vehicle loan EMI calculator",
    "car EMI calculation formula",
    "80% financing car loan",
    "100% financing car loan",
    "car loan tenure 1-7 years",
    "monthly car payment calculator",
    "total car cost calculator India",
    "on road price calculator",
    "car insurance EMI calculator",
    "car maintenance cost calculator"
  ],
  authors: [{ name: "BudgetGear", url: "https://budgetgear.in/about" }],
  creator: "BudgetGear Financial Calculator Experts",
  publisher: "BudgetGear - Professional Financial Tools",
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
    title: "Car Buying Calculator - Calculate Your Ideal Car Budget | Loan EMI Prepayment Calculator",
    description: "Figure out the total buying and monthly cost of the car and make affordability decision accordingly. Reduce loan faster, reduce EMI faster. Get overall cost of running car monthly basis after purchase.",
    url: 'https://budgetgear.in',
    siteName: 'BudgetGear',
    images: [
      {
        url: 'https://budgetgear.in/icon-512.png',
        width: 512,
        height: 512,
        alt: 'BudgetGear Car Finance Calculator Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Car Buying Calculator - Calculate Your Ideal Car Budget | Loan EMI Prepayment Calculator",
    description: "Figure out the total buying and monthly cost of car and make affordability decision. Reduce loan faster, reduce EMI faster. Get overall cost of running car monthly basis after purchase.",
    images: ['https://budgetgear.in/icon-512.png'],
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
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#ffffff',
    'color-scheme': 'light dark',
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
          "url": "https://budgetgear.in/icon-512.png",
          "width": 512,
          "height": 512
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
        },
        {
          "@type": "Question",
          "name": "Can I afford a car with ₹30,000 salary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "With ₹30,000 monthly salary, you can afford up to ₹3,000 monthly car expenses (10% rule). This allows for a car worth ₹8-12 lakhs with proper down payment and 3-4 year loan tenure."
          }
        },
        {
          "@type": "Question", 
          "name": "What car can I afford with ₹50,000 salary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "With ₹50,000 monthly salary, you can afford ₹5,000 monthly car expenses. This enables purchasing a car worth ₹15-25 lakhs depending on down payment amount and loan terms."
          }
        },
        {
          "@type": "Question",
          "name": "How to Calculate a Car Budget Based on Your Income?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our car buying calculator to calculate your ideal car budget. Take 10% of your monthly income for total car expenses, determine 20% down payment capacity, choose loan tenure under 4 years, and calculate affordable car price range."
          }
        },
        {
          "@type": "Question", 
          "name": "Want to Buy a New Car? Here is How Much You Can Spend",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Calculate your car budget using the 20/4/10 rule: 20% down payment, 4 years maximum loan tenure, 10% of gross income for total monthly car expenses. Our calculator considers salary, EMI capacity, and provides insights into your dream car budget."
          }
        },
        {
          "@type": "Question",
          "name": "How does Loan EMI Prepayment Calculator work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Loan EMI Prepayment Calculator helps you calculate interest savings when you prepay your car loan. Input your current EMI details, prepayment amount, and get instant calculations for reduced tenure and total interest savings. Calculate prepayment benefits before making extra payments."
          }
        },
        {
          "@type": "Question",
          "name": "How to Figure Out the Total Buying Cost of Car?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Calculate total buying cost including car price, loan interest, insurance, registration, and taxes. Use our calculator to figure out monthly cost breakdown and make affordability decision based on your budget and financial capacity."
          }
        },
        {
          "@type": "Question",
          "name": "How to Get Overall Cost of Running Car Monthly After Purchase?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Monthly car running cost includes EMI, fuel, insurance, maintenance, parking, and servicing. Calculate total car ownership cost to understand ongoing monthly expenses and plan your budget accordingly."
          }
        },
        {
          "@type": "Question",
          "name": "How to Reduce Loan Faster and Reduce EMI Faster?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Reduce loan faster through prepayments, higher down payment, or shorter tenure. Reduce EMI faster by refinancing at lower rates, making partial prepayments, or increasing payment frequency to save on total interest costs."
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
      "alternateName": "BudgetGear Financial Tools",
      "url": "https://budgetgear.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://budgetgear.in/icon-512.png",
        "width": 512,
        "height": 512,
        "contentUrl": "https://budgetgear.in/icon-512.png"
      },
      "description": "Professional financial calculators and tools for smart car purchasing decisions in India. Trusted by thousands of users for accurate EMI calculations, car affordability assessment, and loan prepayment planning.",
      "foundingDate": "2024",
      "expertise": "Financial Technology, Car Loan Calculators, EMI Planning",
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
      "serviceType": "Financial Calculator Tools",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "English"
      },
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
      </body>
    </html>
  );
}
