import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works - Car Calculator Methodology & Formulas",
  description: "See exactly how BudgetGear calculates car loan EMI, affordability with the 20/4/10 rule, and prepayment savings using standard reducing-balance formulas.",
  alternates: {
    canonical: '/how-it-works/',
  },
  openGraph: {
    title: "How BudgetGear Calculators Work",
    description: "See exactly how BudgetGear calculates car loan EMI, affordability, and prepayment savings.",
    url: 'https://budgetgear.in/how-it-works/',
    type: 'website',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
