import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using BudgetGear's free car loan EMI, affordability, and prepayment calculators and educational content.",
  alternates: {
    canonical: '/terms/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
