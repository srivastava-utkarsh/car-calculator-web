import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Questions & Feedback",
  description: "Get in touch with BudgetGear for questions, feedback, or suggestions about our free car loan EMI, affordability, and prepayment calculators.",
  alternates: {
    canonical: '/contact/',
  },
  openGraph: {
    title: "Contact BudgetGear",
    description: "Get in touch with BudgetGear for questions, feedback, or suggestions about our free car finance calculators.",
    url: 'https://budgetgear.in/contact/',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
