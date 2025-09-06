import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Prepayment Calculator | Save Interest & Loan Tenure - BudgetGear",
  description: "Calculate your savings from loan prepayment. Instantly compare interest vs penalty, reduce EMI or loan duration, and plan smart repayments.",
  keywords: [
    "loan prepayment calculator",
    "prepayment savings calculator", 
    "loan tenure reduction",
    "prepayment penalty calculator",
    "home loan prepayment",
    "car loan prepayment",
    "EMI prepayment",
    "loan interest savings"
  ],
  openGraph: {
    title: "Smart Loan Prepayment Calculator",
    description: "Unlock interest savings. Explore prepayment schedules and see instant impact on your loan!",
    images: ["https://budgetgear.in/prepayment_og.png"],
    url: "https://budgetgear.in/prepayment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Loan Prepayment Calculator",
    description: "Calculate prepayment savings and reduce your loan burden with our comprehensive tool.",
    images: ["https://budgetgear.in/prepayment_og.png"],
  },
  alternates: { 
    canonical: "/prepayment" 
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
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is loan prepayment and how does it work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Loan prepayment is making additional payments towards your loan principal beyond your regular EMI. Additional payment is applied directly to the principal balance, interest for subsequent months is calculated on the reduced balance, and you can either reduce your EMI amount or shorten the loan tenure."
          }
        },
        {
          "@type": "Question",
          "name": "Should I make monthly, quarterly, or yearly prepayments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Monthly prepayments provide maximum interest savings but require consistent surplus. Quarterly prepayments offer good balance between savings and flexibility. Yearly prepayments are convenient for bonuses or tax refunds. Choose based on your income pattern and financial discipline."
          }
        },
        {
          "@type": "Question",
          "name": "What are prepayment penalties and when do they apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "RBI guidelines: Floating rate loans have no prepayment penalty, while fixed rate loans can have 2-5% penalty on prepaid amount. Penalties usually apply in first 1-3 years and vary by bank. Check your loan agreement for specific penalty terms."
          }
        },
        {
          "@type": "Question",
          "name": "Is it better to reduce EMI or reduce loan tenure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Reduce Tenure (recommended): Keep same EMI, pay off loan faster, maximum interest savings, builds financial discipline. Reduce EMI: Lower monthly payments, more budget flexibility, but less total interest savings. Most experts recommend reducing tenure for maximum long-term savings."
          }
        }
      ]
    },
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
          "item": "https://budgetgear.in/prepayment"
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