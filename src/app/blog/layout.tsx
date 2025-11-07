import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Car Finance Blog - Expert Guides on Car Loans & EMI | BudgetGear',
  description: 'Expert guides on car loans, EMI calculations, prepayment strategies, and smart car buying tips for India. Learn the 20/4/10 rule and calculate your ideal car budget.',
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
  openGraph: {
    title: 'Car Finance Blog - Expert Guides | BudgetGear',
    description: 'Expert guides on car loans, EMI calculations, and smart car buying strategies in India',
    url: 'https://budgetgear.in/blog',
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
