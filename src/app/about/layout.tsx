import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BudgetGear - Free Car Finance Calculators for India",
  description: "BudgetGear offers free, independent car loan EMI, affordability, and prepayment calculators built by Arjun Mehta. Learn about our methodology and mission.",
  alternates: {
    canonical: '/about/',
  },
  openGraph: {
    title: "About BudgetGear - Free Car Finance Calculators for India",
    description: "Free, independent car loan calculators and guides for India. Learn who builds BudgetGear and how the calculations work.",
    url: 'https://budgetgear.in/about/',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
