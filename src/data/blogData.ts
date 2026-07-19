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
    author: 'Arjun Mehta',
    publishedDate: '2024-11-01',
    lastUpdated: '2026-07-19',
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
    author: 'Arjun Mehta',
    publishedDate: '2024-11-02',
    lastUpdated: '2026-07-19',
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
    author: 'Arjun Mehta',
    publishedDate: '2024-11-03',
    lastUpdated: '2026-07-19',
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
    author: 'Arjun Mehta',
    publishedDate: '2024-11-04',
    lastUpdated: '2026-07-19',
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
    author: 'Arjun Mehta',
    publishedDate: '2024-11-05',
    lastUpdated: '2026-07-19',
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
    author: 'Arjun Mehta',
    publishedDate: '2024-11-06',
    lastUpdated: '2026-07-19',
    metaDescription: 'Understand car loan interest rates in India. Compare rates from SBI, HDFC, ICICI, Axis Bank. Learn how to get the best rates and save on interest.'
  },
  {
    slug: 'car-on-road-price-explained-india',
    title: 'On-Road Price vs Ex-Showroom Price: Every Charge Explained',
    excerpt: 'Road tax by state, insurance, TCS, and the dealer padding you can negotiate away — the full breakdown of what you actually pay.',
    category: 'Car Buying Tips',
    date: 'July 2026',
    readTime: '9 min read',
    keywords: ['on-road price', 'ex-showroom price', 'road tax India', 'RTO charges', 'car handling charges'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'Ex-showroom vs on-road price in India explained: road tax by state, registration, insurance, TCS and negotiable dealer charges, with a worked example.'
  },
  {
    slug: 'used-car-loan-guide-india',
    title: 'Used Car Loans in India: Rates, Valuation and the Transfer Process',
    excerpt: 'Why used car loan rates are higher, how bank valuation differs from asking price, and the RC transfer steps that protect you.',
    category: 'Used Cars',
    date: 'July 2026',
    readTime: '10 min read',
    keywords: ['used car loan', 'second hand car loan India', 'used car loan interest rate', 'RC transfer'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'Complete used car loan guide for India: interest rates vs new car loans, LTV and valuation gaps, RC and insurance transfer, and a used-vs-new worked example.'
  },
  {
    slug: 'car-loan-eligibility-documents-cibil',
    title: 'Car Loan Eligibility: CIBIL Score, FOIR and Documents Checklist',
    excerpt: 'How banks actually evaluate your application, the score bands that decide your rate, and how to fix eligibility before you apply.',
    category: 'Loan Process',
    date: 'July 2026',
    readTime: '10 min read',
    keywords: ['car loan eligibility', 'CIBIL score car loan', 'car loan documents', 'FOIR'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'Car loan eligibility in India explained: CIBIL score bands and rates, FOIR limits, documents checklist for salaried and self-employed, and how to improve approval odds.'
  },
  {
    slug: 'how-to-close-car-loan-remove-hypothecation',
    title: 'How to Close a Car Loan and Remove Hypothecation From Your RC',
    excerpt: 'Foreclosure charges, NOC and Form 35, the RTO process, insurance endorsement and CIBIL updates — the complete closure checklist.',
    category: 'Loan Process',
    date: 'July 2026',
    readTime: '9 min read',
    keywords: ['close car loan', 'hypothecation removal', 'Form 35', 'car loan NOC', 'foreclosure charges'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'Step-by-step guide to closing a car loan in India: foreclosure charges, collecting NOC and Form 35, removing hypothecation from the RC, and updating insurance and CIBIL.'
  },
  {
    slug: 'electric-vs-petrol-car-cost-india',
    title: 'Electric vs Petrol Car: The Honest 5-Year Cost Comparison',
    excerpt: 'Running costs, green loans, insurance, resale risk and a full 5-year TCO table — when the EV premium pays back and when it does not.',
    category: 'Electric Vehicles',
    date: 'July 2026',
    readTime: '11 min read',
    keywords: ['electric car vs petrol cost', 'EV total cost of ownership India', 'green car loan', 'EV running cost per km'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'EV vs petrol car cost comparison for India: purchase taxes, green car loans, running cost per km, maintenance, insurance and resale, with a 5-year TCO worked example.'
  },
  {
    slug: 'car-depreciation-resale-value-india',
    title: 'Car Depreciation in India: Resale Value, IDV and When to Sell',
    excerpt: 'The value curve by year, negative equity on long loans, what makes cars hold value, and the smartest window to sell.',
    category: 'Ownership Costs',
    date: 'July 2026',
    readTime: '10 min read',
    keywords: ['car depreciation India', 'car resale value', 'IDV depreciation', 'negative equity car loan'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'How car depreciation works in India: year-by-year value curve, IDV slabs, negative equity on long-tenure loans, resale factors, and the best time to sell your car.'
  },
  {
    slug: 'car-down-payment-strategy-india',
    title: 'Car Down Payment Strategy: How Much to Put Down and Why',
    excerpt: 'What zero-down offers really finance, the interest math for 0–30% down, and how to build a down payment without borrowing it.',
    category: 'Car Buying Tips',
    date: 'July 2026',
    readTime: '9 min read',
    keywords: ['car down payment', 'zero down payment car', 'car loan LTV', 'down payment savings'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'Car down payment guide for India: why 20% of on-road price is the benchmark, EMI and interest comparisons at 0-30% down, and safe ways to build the amount.'
  },
  {
    slug: 'best-time-to-buy-car-india',
    title: 'Best Time to Buy a Car in India: Festive Offers, December Deals and Dealer Targets',
    excerpt: 'When discounts actually appear — festive season, month-end targets, facelift run-outs — and how to negotiate the on-road total.',
    category: 'Car Buying Tips',
    date: 'July 2026',
    readTime: '9 min read',
    keywords: ['best time to buy car India', 'car discounts festive season', 'December car discounts', 'car negotiation tips'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'When to buy a car in India for the best deal: festive season offers, December vs January registration trade-off, dealer month-end targets, and negotiation tactics.'
  },
  {
    slug: 'car-insurance-guide-new-car-buyers',
    title: 'Car Insurance for New Car Buyers: IDV, NCB and Riders That Matter',
    excerpt: 'What your lender requires, why you should never lower IDV, which riders earn their premium, and how to save 20-40% at renewal.',
    category: 'Insurance',
    date: 'July 2026',
    readTime: '11 min read',
    keywords: ['car insurance India', 'IDV meaning', 'no claim bonus', 'zero depreciation cover', 'hypothecation insurance'],
    content: '',
    author: 'Arjun Mehta',
    publishedDate: '2026-07-19',
    lastUpdated: '2026-07-19',
    metaDescription: 'Car insurance guide for India: comprehensive vs third party, IDV and NCB explained, zero depreciation and return-to-invoice riders, and rules for financed cars.'
  }
]
