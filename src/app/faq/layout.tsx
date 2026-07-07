import type { Metadata } from "next";
import { faqPageCategories } from "@/data/faqPageData";

export const metadata: Metadata = {
  title: "FAQ - Car Loan EMI, Affordability & Prepayment Questions",
  description: "Answers to common questions about car loan EMI calculations, the 20/4/10 rule, down payments, prepayment penalties, and car affordability in India.",
  alternates: {
    canonical: '/faq/',
  },
  openGraph: {
    title: "Car Loan & EMI Calculator FAQ | BudgetGear",
    description: "Answers to common questions about car loan EMI, the 20/4/10 rule, down payments, and prepayment in India.",
    url: 'https://budgetgear.in/faq/',
    type: 'website',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqPageCategories.flatMap((category) =>
      category.questions.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
