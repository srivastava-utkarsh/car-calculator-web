import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Loan Prepayment Calculator | Tenure Reduction Calculator India",
  description: "Use this free car loan prepayment calculator with tenure reduction strategy, save on interest, and understand your total prepayment savings. Following industry standard practices.",
  keywords: [
    "car loan prepayment calculator",
    "EMI prepayment calculator",
    "loan prepayment calculator India",
    "car loan foreclosure calculator",
    "EMI reduction calculator",
    "part prepayment vs tenure reduction",
    "save interest by prepaying car loan",
    "no prepayment penalty industry standard",
    "early loan closure savings",
    "how to prepay car loan",
    "industry standard prepayment rules",
    "car loan prepayment charges",
    "tenure reduction strategy",
    "loan amortization schedule",
    "compare loan EMI after prepayment",
    "car loan part payment calculator",
    "car loan prepayment penalty",
    "car loan foreclosure",
    "car loan part payment",
    "prepayment calculator car loan",
    "prepayment of car loan",
    "car loan early closure calculator",
    "fixed vs floating rate prepayment",
    "should I prepay car loan",
    "pros and cons of prepaying car loan",
    "car loan prepayment strategy India",
    "best way to pay off car loan early",
    "loan prepayment calculator",
    "prepayment savings calculator", 
    "loan tenure reduction",
    "prepayment penalty calculator",
    "EMI prepayment",
    "loan interest savings"
  ],
  openGraph: {
    title: "Car Loan Prepayment Calculator | Tenure Reduction Calculator India",
    description: "Use this free car loan prepayment calculator with tenure reduction strategy, save on interest, and understand your total prepayment savings. Following industry standard practices.",
    images: ["https://budgetgear.in/icon-512.png"],
    url: "https://budgetgear.in/car-loan-prepayment-calculator/",
    siteName: 'BudgetGear',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Loan Prepayment Calculator | Professional Tool",
    description: "Calculate car loan prepayment savings, penalty charges, and tenure reduction. Should I prepay car loan? Find out now.",
    images: ["https://budgetgear.in/icon-512.png"],
  },
  alternates: {
    canonical: "/car-loan-prepayment-calculator/"
  },
};

export default function PrepaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate Loan Prepayment Savings",
      "description": "Step-by-step guide to calculate savings from loan prepayment",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter Loan Details",
          "text": "Input your current loan amount, interest rate, and remaining tenure"
        },
        {
          "@type": "HowToStep", 
          "name": "Set Prepayment Amount",
          "text": "Choose how much you want to prepay monthly or yearly"
        },
        {
          "@type": "HowToStep",
          "name": "Review Savings",
          "text": "See instant calculations of interest savings and reduced loan tenure"
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
          "name": "Loan Prepayment Calculator",
          "item": "https://budgetgear.in/car-loan-prepayment-calculator"
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}