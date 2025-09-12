import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Affordability Calculator | How Much Car Can I Afford on My Salary?",
  description: "Calculate exactly how much car you can afford with our professional 20/4/10 rule calculator. Check EMI, down payment, and total costs. Free car budget planner for India.",
  keywords: [
    "car affordability calculator",
    "how much car can I afford",
    "car budget calculator", 
    "20/4/10 rule calculator",
    "car afford calculator",
    "afford card calculator",
    "car loan eligibility",
    "car EMI calculator",
    "car purchase calculator",
    "vehicle affordability tool",
    "salary car calculator",
    "car buying guide India",
    "car financing calculator",
    "auto loan calculator",
    "car loan EMI",
    "down payment calculator"
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
    canonical: '/car-affordability-calculator',
  },
  openGraph: {
    title: "Car Affordability Calculator | How Much Car Can I Afford?",
    description: "Calculate exactly how much car you can afford with our professional 20/4/10 rule calculator. Check EMI, down payment, and total costs.",
    url: 'https://budgetgear.in/car-affordability-calculator',
    siteName: 'BudgetGear',
    images: [
      {
        url: 'https://budgetgear.in/bck-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Car Affordability Calculator - BudgetGear',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Car Affordability Calculator | How Much Car Can I Afford?",
    description: "Calculate exactly how much car you can afford with our professional 20/4/10 rule calculator. Check EMI, down payment, and total costs.",
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
};

export default function CarAffordabilityCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}