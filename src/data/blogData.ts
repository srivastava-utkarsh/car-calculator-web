export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  content: string
  keywords: string[]
  author: string
  publishedDate: string
  lastUpdated: string
  metaDescription: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: '20-4-10-car-buying-rule-india',
    title: 'Complete Guide to the 20/4/10 Car Buying Rule in India',
    excerpt: 'Learn how the 20/4/10 rule helps you make smart car financing decisions and avoid financial stress.',
    category: 'Car Buying Tips',
    date: 'November 2024',
    readTime: '8 min read',
    keywords: ['20/4/10 rule', 'car buying rule', 'car finance India', 'down payment rule'],
    content: '',
    author: 'Utkarsh Srivastava',
    publishedDate: '2024-11-01',
    lastUpdated: '2024-11-07',
    metaDescription: 'Master the 20/4/10 car buying rule for India. Learn how 20% down payment, 4-year tenure, and 10% income rule help you make smart car financing decisions.'
  },
  {
    slug: 'how-much-car-afford-salary',
    title: 'How Much Car Can You Really Afford on Your Salary?',
    excerpt: 'Calculate your ideal car budget based on income with practical examples and expert guidance.',
    category: 'Affordability',
    date: 'November 2024',
    readTime: '10 min read',
    keywords: ['car affordability', 'salary car calculator', 'car budget income'],
    content: '',
    author: 'Utkarsh Srivastava',
    publishedDate: '2024-11-02',
    lastUpdated: '2024-11-07',
    metaDescription: 'Calculate how much car you can afford on your salary. Complete guide with examples for ₹25K to ₹1L+ salaries, including EMI calculations and ownership costs.'
  },
  {
    slug: 'car-loan-emi-calculator-guide',
    title: 'Car Loan EMI Calculator: Complete Guide for Indian Buyers',
    excerpt: 'Step-by-step explanation of EMI calculations, interest rates, and loan tenure optimization.',
    category: 'EMI Calculation',
    date: 'November 2024',
    readTime: '12 min read',
    keywords: ['EMI calculator', 'car loan EMI', 'EMI calculation formula'],
    content: '',
    author: 'Utkarsh Srivastava',
    publishedDate: '2024-11-03',
    lastUpdated: '2024-11-07',
    metaDescription: 'Master car loan EMI calculations with our complete guide. Learn the formula, compare bank rates, and optimize your loan tenure for maximum savings.'
  },
  {
    slug: 'car-prepayment-strategies-save-money',
    title: 'Best Car Prepayment Strategies to Save Money',
    excerpt: 'Multiple strategies with calculations to reduce your car loan burden through smart prepayments.',
    category: 'Loan Prepayment',
    date: 'November 2024',
    readTime: '9 min read',
    keywords: ['car loan prepayment', 'prepayment strategies', 'reduce EMI'],
    content: '',
    author: 'Utkarsh Srivastava',
    publishedDate: '2024-11-04',
    lastUpdated: '2024-11-07',
    metaDescription: 'Save lakhs on car loans with smart prepayment strategies. Learn when to prepay, how much to pay, and calculate your interest savings with real examples.'
  },
  {
    slug: 'hidden-costs-car-ownership-india',
    title: 'Hidden Costs of Car Ownership Beyond EMI',
    excerpt: 'Comprehensive breakdown of insurance, maintenance, fuel, and other ongoing car expenses.',
    category: 'Ownership Costs',
    date: 'November 2024',
    readTime: '11 min read',
    keywords: ['car ownership cost', 'monthly car expenses', 'total car cost'],
    content: '',
    author: 'Utkarsh Srivastava',
    publishedDate: '2024-11-05',
    lastUpdated: '2024-11-07',
    metaDescription: 'Discover hidden costs of car ownership in India beyond EMI. Complete breakdown of insurance, fuel, maintenance, parking, and depreciation costs.'
  },
  {
    slug: 'car-loan-interest-rates-india',
    title: 'Understanding Car Loan Interest Rates in India',
    excerpt: 'How interest rates are calculated, what affects them, and how to get the best rates.',
    category: 'Interest Rates',
    date: 'November 2024',
    readTime: '10 min read',
    keywords: ['car loan interest rate', 'interest rate calculation', 'best car loan rates'],
    content: '',
    author: 'Utkarsh Srivastava',
    publishedDate: '2024-11-06',
    lastUpdated: '2024-11-07',
    metaDescription: 'Understand car loan interest rates in India. Compare rates from SBI, HDFC, ICICI, Axis Bank. Learn how to get the best rates and save on interest.'
  }
]
