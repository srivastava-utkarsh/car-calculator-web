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
    images: ["https://budgetgear.in/prepayment_og.png"],
    url: "https://budgetgear.in/car-loan-prepayment-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Loan Prepayment Calculator | Professional Tool",
    description: "Calculate car loan prepayment savings, penalty charges, and tenure reduction. Should I prepay car loan? Find out now.",
    images: ["https://budgetgear.in/prepayment_og.png"],
  },
  alternates: { 
    canonical: "/car-loan-prepayment-calculator" 
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
            "text": "Industry guidelines: Floating rate loans have no prepayment penalty, while fixed rate loans can have 2-5% penalty on prepaid amount. Penalties usually apply in first 1-3 years and vary by bank. Check your loan agreement for specific penalty terms."
          }
        },
        {
          "@type": "Question",
          "name": "Is it better to reduce EMI or reduce loan tenure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Reduce Tenure (recommended): Keep same EMI, pay off loan faster, maximum interest savings, builds financial discipline. Reduce EMI: Lower monthly payments, more budget flexibility, but less total interest savings. Most experts recommend reducing tenure for maximum long-term savings."
          }
        },
        {
          "@type": "Question",
          "name": "What are industry standards for car loan prepayment penalties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Industry standards increasingly favor zero prepayment penalties on car loans for individuals. This applies to both floating and fixed rate loans, making prepayment more attractive for faster debt freedom and interest savings."
          }
        },
        {
          "@type": "Question",
          "name": "How much can I save by prepaying my car loan early?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Interest savings depend on prepayment amount, timing, and remaining tenure. Early prepayments save more as they reduce the principal on which future interest is calculated. Use our calculator to see exact savings for your loan scenario."
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