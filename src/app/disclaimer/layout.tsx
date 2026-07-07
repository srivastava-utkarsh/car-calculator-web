import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for BudgetGear's car finance calculators: all calculations are estimates for informational purposes and not financial advice.",
  alternates: {
    canonical: '/disclaimer/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
