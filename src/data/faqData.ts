// FAQ data for car calculator page - moved to separate file for code splitting
export interface FAQItem {
  question: string;
  answer: string;
}

export const carCalculatorFAQs: FAQItem[] = [
  {
    question: "What is the 20/4/10 rule for car buying?",
    answer: "The 20/4/10 rule is a smart car buying guideline that suggests:\n\n• 20% Down Payment: Pay at least 20% of the car's price upfront to reduce your loan amount and lower monthly EMI\n• 4 Years Maximum: Keep your loan tenure to a maximum of 4 years to minimize total interest paid\n• 10% of Income: Your total monthly car expenses (EMI + insurance + maintenance + fuel) should not exceed 10% of your gross monthly income\n\nFollowing this rule helps ensure you can afford the car without straining your finances."
  },
  {
    question: "How is EMI calculated for car loans?",
    answer: "EMI (Equated Monthly Installment) is calculated using the standard PMT formula:\n\nEMI = P × r × (1+r)^n / [(1+r)^n - 1]\n\nWhere:\n• P = Principal loan amount (car price - down payment)\n• r = Monthly interest rate (annual rate ÷ 12 ÷ 100)\n• n = Total number of months (tenure in years × 12)\n\nExample: For a ₹10 lakh loan at 8% interest for 5 years:\nEMI = ₹20,276 per month"
  },
  {
    question: "What factors should I consider for car loan affordability?",
    answer: "Key factors that affect car loan affordability include:\n\n• Monthly Income: Your gross monthly salary determines how much EMI you can afford\n• Existing EMIs: Other loan commitments reduce your borrowing capacity\n• Down Payment: Higher down payment means lower loan amount and EMI\n• Interest Rate: Lower rates reduce your monthly payment\n• Loan Tenure: Longer tenure means lower EMI but higher total interest\n• Additional Costs: Insurance, maintenance, fuel, and parking expenses\n\nUse our calculator to see how these factors impact your budget."
  },
  {
    question: "Should I choose a longer or shorter loan tenure?",
    answer: "The choice depends on your financial situation:\n\nShorter Tenure (2-3 years):\n• Lower total interest paid\n• Higher monthly EMI\n• Builds equity faster\n• Less financial risk\n\nLonger Tenure (5-7 years):\n• Lower monthly EMI\n• Higher total interest cost\n• More budget flexibility\n• Higher financial risk if income changes\n\nRecommendation: Follow the 20/4/10 rule and keep it under 4 years for optimal balance."
  },
  {
    question: "How much down payment should I make?",
    answer: "Down payment recommendations:\n\nMinimum: 10-15% (lender requirement)\nRecommended: 20-25% (20/4/10 rule)\nOptimal: 30-40% (if you have surplus funds)\n\nBenefits of higher down payment:\n• Lower EMI amount\n• Reduced total interest cost\n• Better loan approval chances\n• Less risk of being underwater on the loan\n\nExample: On a ₹15 lakh car:\n• 20% down payment = ₹3 lakh down, ₹12 lakh loan\n• 30% down payment = ₹4.5 lakh down, ₹10.5 lakh loan"
  },
  {
    question: "What additional costs should I budget for a car?",
    answer: "Beyond the EMI, budget for these ongoing costs:\n\nMonthly Costs:\n• Fuel: ₹3,000-8,000 (depending on usage)\n• Parking: ₹500-2,000 in cities\n• Insurance: ₹800-1,500 (annual premium ÷ 12)\n\nAnnual Costs:\n• Service & Maintenance: ₹10,000-25,000\n• Insurance renewal: ₹10,000-18,000\n• Registration renewal: ₹1,000-5,000\n\nOne-time Costs:\n• Registration & RTO: ₹8,000-15,000\n• Extended warranty: ₹20,000-40,000 (optional)\n\nTotal monthly car ownership cost typically ranges from ₹15,000-35,000."
  },
  {
    question: "Car loan prepayment vs investment: Which is better?",
    answer: "Compare loan interest rate vs investment returns:\n\nChoose Prepayment When:\n• Loan interest rate > 10% (guaranteed savings)\n• No penalty on prepayment (floating rate loans)\n• Risk-averse investor profile\n• No tax benefits from investment\n\nChoose Investment When:\n• Expected returns > loan interest rate\n• Tax-saving investments (ELSS, PPF)\n• Diversified investment portfolio\n• Emergency fund already established\n\nExample: 8% car loan vs 12% mutual fund returns = Invest. But consider risk factors and guaranteed vs expected returns."
  },
  {
    question: "What's the difference between fixed vs floating rate car loans for prepayment?",
    answer: "Key differences for prepayment strategy:\n\nFixed Rate Loans:\n• Prepayment penalty: 2-5% of prepaid amount\n• Interest rate remains constant\n• Predictable EMI throughout tenure\n• Calculate penalty cost vs interest savings\n\nFloating Rate Loans:\n• No prepayment penalty (industry standard)\n• Interest rate varies with market rates\n• EMI can increase/decrease over time\n• Always beneficial to prepay when surplus available\n\nRecommendation: Choose floating rate for maximum prepayment flexibility and savings."
  },
  {
    question: "How to calculate if car loan prepayment is worth it?",
    answer: "Step-by-step calculation method:\n\n1. Calculate Interest Savings:\n   • Use our prepayment calculator for exact figures\n   • Interest saved = Original interest - New interest\n\n2. Calculate Total Penalty Cost:\n   • Penalty = Prepayment amount × Penalty rate%\n\n3. Calculate Net Savings:\n   • Net savings = Interest savings - Penalty cost\n\n4. Compare with Investment Returns:\n   • If net savings > expected investment returns, prepay\n\nExample: ₹2L prepayment on 10% loan saves ₹1.8L interest, ₹10K penalty = ₹1.7L net benefit. Use our calculator for personalized analysis."
  },
  {
    question: "Best car loan prepayment strategy for maximum savings?",
    answer: "Optimal prepayment strategies by income pattern:\n\n1. Bonus-Based Strategy:\n   • Use annual bonus for yearly prepayment\n   • Reduces principal significantly in one go\n   • Good for irregular income patterns\n\n2. Monthly Surplus Strategy:\n   • Add ₹2,000-5,000 to monthly EMI\n   • Consistent reduction in principal\n   • Best for stable monthly income\n\n3. Tax Refund Strategy:\n   • Use income tax refunds for prepayment\n   • Typically ₹20,000-50,000 annually\n   • Good middle-ground approach\n\n4. Step-up Strategy:\n   • Increase prepayment with salary hikes\n   • Start with ₹1,000/month, increase yearly\n   • Balances current needs with future savings\n\nChoice depends on your income stability, risk appetite, and financial goals."
  },
  {
    question: "How to lower car EMI India with best car loan calculator?",
    answer: "Multiple strategies to reduce your car EMI using our best car loan calculator online:\n\n1. Increase Down Payment:\n   • 20% down payment: Reduces loan amount significantly\n   • 30% down payment: Even lower EMI and interest burden\n   • Use calculator to see exact EMI reduction\n\n2. Choose Longer Tenure (with caution):\n   • 5 years vs 3 years: Lower EMI but higher total interest\n   • Use our calculator to compare total cost\n\n3. Negotiate Better Interest Rate:\n   • Compare rates from multiple lenders\n   • Good credit score can reduce rate by 1-2%\n   • Use our interest rate calculator for comparisons\n\n4. Car Loan Part Payment:\n   • Make partial prepayments to reduce principal\n   • Results in lower remaining EMIs\n   • Use part payment calculator for savings analysis\n\nBest approach: Use our car finance calculator India to find optimal combination of down payment, tenure, and interest rate."
  },
  {
    question: "Best time to prepay car loan India with zero prepayment penalty?",
    answer: "Optimal timing for car loan prepayment in India:\n\n1. Early Years (1st-2nd year):\n   • Maximum interest savings potential\n   • Principal reduction has highest impact\n   • Best time for lump sum prepayment\n\n2. When You Have Surplus Funds:\n   • Annual bonus, tax refunds, or windfall gains\n   • Emergency fund is already established\n   • No higher-return investment opportunities\n\n3. Zero Prepayment Penalty Loans:\n   • Floating rate loans: Usually no penalty\n   • Check loan agreement for penalty clauses\n   • Calculate net savings using our prepayment calculator\n\n4. Interest Rate Environment:\n   • When loan rate > FD/investment returns\n   • Guaranteed savings vs uncertain market returns\n   • Risk-free way to 'earn' your loan interest rate\n\nUse our loan prepayment calculator India to determine exact savings and optimal prepayment amount for your situation."
  },
  {
    question: "Car loan repayment schedule and EMI calculation for budget planning?",
    answer: "Understanding your complete car loan repayment schedule for smart budget planning:\n\n1. EMI Components:\n   • Principal repayment: Reduces loan balance\n   • Interest payment: Decreases over time\n   • Early EMIs: Higher interest, lower principal\n   • Later EMIs: Higher principal, lower interest\n\n2. Total Cost Calculation:\n   • EMI × Tenure = Total amount paid\n   • Total interest = Total paid - Loan amount\n   • Use our total car cost calculator for exact figures\n\n3. Budget Planning Tips:\n   • EMI should be max 40% of monthly income\n   • Include insurance, maintenance, fuel costs\n   • Keep 10% buffer for unexpected expenses\n   • Follow 20/4/10 rule for overall affordability\n\n4. Repayment Schedule Benefits:\n   • Track principal reduction progress\n   • Plan for prepayment opportunities\n   • Budget for changing financial situations\n\nOur car loan repayment schedule calculator shows month-by-month breakdown for complete financial planning."
  }
];