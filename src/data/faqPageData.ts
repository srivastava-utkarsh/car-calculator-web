// FAQ page data - shared between the FAQ page UI and its FAQPage structured data
export interface FAQPageEntry {
  question: string;
  answer: string;
}

export interface FAQPageCategory {
  title: string;
  questions: FAQPageEntry[];
}

export const faqPageCategories: FAQPageCategory[] = [
    {
      title: "Car Affordability & Budgeting",
      questions: [
        {
          question: "How much car can I afford based on my salary?",
          answer: "Use the 20/4/10 rule: 20% down payment, maximum 4-year loan, and total car expenses should not exceed 10% of your gross monthly income. For example, if you earn ₹50,000/month, your total car expenses (EMI + insurance + fuel + maintenance) should stay under ₹5,000."
        },
        {
          question: "What is the 20/4/10 rule for car buying?",
          answer: "The 20/4/10 rule is a proven car financing guideline: Pay at least 20% down payment to reduce loan amount, keep loan tenure under 4 years to minimize total interest, and ensure total monthly car expenses don't exceed 10% of your gross monthly income."
        },
        {
          question: "Should I include fuel and maintenance in my car budget?",
          answer: "Yes, absolutely. Total cost of car ownership includes EMI, insurance, fuel, regular maintenance, parking fees, and annual servicing. These recurring costs can add up to ₹3,000-8,000 per month depending on usage and car type."
        },
        {
          question: "How much down payment should I make?",
          answer: "Minimum: 10-15% (lender requirement), Recommended: 20-25% (20/4/10 rule), Optimal: 30-40% if you have surplus funds. Higher down payment reduces EMI, total interest cost, and improves loan approval chances."
        }
      ]
    },
    {
      title: "EMI Calculations & Loan Terms",
      questions: [
        {
          question: "How is car loan EMI calculated?",
          answer: "EMI is calculated using the PMT formula: EMI = P × r × (1+r)^n / [(1+r)^n - 1], where P is principal loan amount (car price - down payment), r is monthly interest rate (annual rate ÷ 12 ÷ 100), and n is total number of months (tenure × 12)."
        },
        {
          question: "What factors affect my car loan interest rate?",
          answer: "Interest rates depend on: credit score (750+ gets best rates), income stability, employer type, loan amount, loan tenure, car age (new vs used), and lender policies. Rates typically range from 7-15% per annum."
        },
        {
          question: "Should I choose a longer or shorter loan tenure?",
          answer: "Shorter tenure (2-3 years): Lower total interest, higher monthly EMI, faster equity building. Longer tenure (5-7 years): Lower monthly EMI, more budget flexibility, but significantly higher total interest cost. Follow 20/4/10 rule and keep under 4 years."
        },
        {
          question: "Can I get pre-approved for a car loan?",
          answer: "Yes, many banks offer pre-approval. Benefits include knowing your budget, better negotiating power with dealers, faster processing, and confirmed interest rates. Pre-approval is typically valid for 30-90 days."
        }
      ]
    },
    {
      title: "Loan Prepayment & Savings",
      questions: [
        {
          question: "Should I prepay my car loan?",
          answer: "Consider prepaying if: you have surplus funds, loan interest rate is high (>10%), you want to reduce financial burden, or you're planning another major purchase. Compare prepayment savings vs other investment opportunities."
        },
        {
          question: "How much can I save by prepaying my car loan?",
          answer: "Savings depend on remaining tenure and interest rate. Example: ₹5 lakh loan at 9% for 5 years. Prepaying ₹50,000 in year 2 can save ₹30,000-50,000 in interest and reduce tenure by 8-12 months."
        },
        {
          question: "Are there charges for car loan prepayment?",
          answer: "Floating rate loans: Usually no charges. Fixed rate loans: May have 2-5% penalty on prepaid amount. Check your loan agreement for specific terms. Many banks waive prepayment charges after 12 months."
        },
        {
          question: "What's the best prepayment strategy?",
          answer: "Options include: lump sum prepayment (when you receive bonus/windfall), increasing EMI by 10-20% monthly, yearly prepayments, or part-prepayments to reduce tenure. Each strategy has different savings potential."
        }
      ]
    },
    {
      title: "Car Buying Tips & Best Practices",
      questions: [
        {
          question: "New car vs used car financing - which is better?",
          answer: "New cars: Lower interest rates (7-10%), longer tenure options, full warranty, latest features. Used cars: Higher rates (10-15%), shorter tenure, lower insurance, faster depreciation. Choose based on budget and needs."
        },
        {
          question: "How to negotiate the best car loan deal?",
          answer: "Compare offers from multiple banks, check online aggregators, negotiate interest rates based on your credit profile, ask about processing fee waivers, consider dealer financing vs bank loans, and read all terms carefully."
        },
        {
          question: "What documents are needed for car loan approval?",
          answer: "Income proof (salary slips, ITR, bank statements), identity proof (Aadhar, PAN, passport), address proof, employer certificate, car quotation/invoice, insurance documents, and co-applicant documents if applicable."
        },
        {
          question: "How does car insurance affect my total budget?",
          answer: "Car insurance typically costs 2-4% of car value annually. Include comprehensive coverage, third-party liability, and useful add-ons in your budget. Compare policies, check claim settlement ratio, and factor renewal costs into monthly ownership expenses."
        }
      ]
    }
  ]
