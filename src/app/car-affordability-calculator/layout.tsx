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
  authors: [{ name: "Utkarsh Srivastava", url: "https://budgetgear.in/about/" }],
  creator: "Utkarsh Srivastava",
  publisher: "BudgetGear",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/car-affordability-calculator/',
  },
  openGraph: {
    title: "Car Affordability Calculator | How Much Car Can I Afford?",
    description: "Calculate exactly how much car you can afford with our professional 20/4/10 rule calculator. Check EMI, down payment, and total costs.",
    url: 'https://budgetgear.in/car-affordability-calculator/',
    siteName: 'BudgetGear',
    images: [
      {
        url: 'https://budgetgear.in/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Car Affordability Calculator - BudgetGear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Car Affordability Calculator | How Much Car Can I Afford?",
    description: "Calculate exactly how much car you can afford with our professional 20/4/10 rule calculator. Check EMI, down payment, and total costs.",
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
};

export default function CarAffordabilityCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}