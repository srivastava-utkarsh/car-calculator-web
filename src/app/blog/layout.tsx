import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Car Finance Blog - Guides on Car Loans, EMI & Prepayment',
    template: '%s | BudgetGear',
  },
  description: 'Practical guides on car loans, EMI calculations, prepayment strategies, and smart car buying tips for India. Learn the 20/4/10 rule and plan your car budget.',
  keywords: [
    'car finance blog',
    'car loan guide',
    'EMI calculator guide',
    'car buying tips India',
    'loan prepayment strategies',
    '20/4/10 rule explained',
    'car affordability guide',
    'car ownership costs',
    'car insurance guide',
    'car loan interest rates'
  ],
  alternates: {
    canonical: '/blog/',
  },
  openGraph: {
    title: 'Car Finance Blog | BudgetGear',
    description: 'Practical guides on car loans, EMI calculations, and smart car buying strategies in India',
    url: 'https://budgetgear.in/blog/',
    type: 'website',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
