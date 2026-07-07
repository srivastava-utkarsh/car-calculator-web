import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BudgetGear's privacy policy: how we handle your data, cookies, Google AdSense advertising, and your privacy rights when using our free car finance calculators.",
  alternates: {
    canonical: '/privacy/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
