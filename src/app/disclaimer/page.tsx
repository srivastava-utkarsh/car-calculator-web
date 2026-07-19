'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'

export default function DisclaimerPage() {
  const { isLight } = useTheme()

  return (
    <main className={`min-h-screen ${isLight ? 'bg-[#F4F5F8]' : 'bg-black'}`}>
      <header className={`${isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/bck-logo.svg" alt="BudgetGear Logo" className="w-10 h-10 sm:w-12 sm:h-12" width={48} height={48} />
              <span className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>BudgetGear</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Home</Link>
              <Link href="/blog" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Blog</Link>
              <Link href="/about" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>About</Link>
              <Link href="/contact" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Disclaimer' }]} />
            
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 mt-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Disclaimer
            </h1>
            
            <div className={`mb-8 p-4 rounded-lg ${isLight ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-700/50'}`}>
              <p className={`text-sm ${isLight ? 'text-red-900' : 'text-red-200'}`}>
                <strong>Important:</strong> Please read this disclaimer carefully before using BudgetGear&apos;s calculators and content.
              </p>
            </div>

            <div className={`prose prose-lg max-w-none ${isLight ? 'prose-slate' : 'prose-invert'}`}>
              <h2>General Disclaimer</h2>
              <p>
                The information provided on BudgetGear (budgetgear.in) is for general informational and educational purposes only. While we strive to provide accurate, up-to-date, and useful information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, calculators, tools, or related content on the website.
              </p>

              <h2>Not Financial Advice</h2>
              <p>
                <strong>BudgetGear does not provide financial, legal, tax, or investment advice.</strong> The content on this website, including calculator results, articles, guides, and recommendations, should not be construed as professional financial advice. You should not rely solely on the information provided on this website to make financial decisions.
              </p>
              <p>
                Before making any financial decisions, including but not limited to:
              </p>
              <ul>
                <li>Taking out a car loan</li>
                <li>Choosing a lender or loan product</li>
                <li>Making prepayments on existing loans</li>
                <li>Purchasing a vehicle</li>
                <li>Entering into any financial commitment</li>
              </ul>
              <p>
                You should consult with qualified financial advisors, certified financial planners, accountants, or other licensed professionals who can assess your individual circumstances and provide personalized advice.
              </p>

              <h2>Calculator Accuracy and Limitations</h2>
              
              <h3>Estimates Only</h3>
              <p>
                All calculators on BudgetGear provide <strong>estimates</strong> based on the information you input and standard financial formulas. Calculator results are approximations and should not be considered exact or guaranteed figures.
              </p>
              
              <h3>Factors Affecting Accuracy</h3>
              <p>
                Calculator results may vary from actual loan terms due to numerous factors, including but not limited to:
              </p>
              <ul>
                <li><strong>Individual circumstances:</strong> Your credit score, income, employment history, and existing debts</li>
                <li><strong>Lender policies:</strong> Each bank or financial institution has unique eligibility criteria and interest rate structures</li>
                <li><strong>Market conditions:</strong> Interest rates fluctuate based on Reserve Bank of India policies and market dynamics</li>
                <li><strong>Hidden fees:</strong> Processing fees, documentation charges, insurance costs, and other charges not included in basic calculations</li>
                <li><strong>Loan terms:</strong> Specific terms and conditions that vary by lender and loan product</li>
                <li><strong>Rounding:</strong> Calculator results may be rounded for display purposes</li>
              </ul>
              
              <h3>Verification Required</h3>
              <p>
                <strong>Always verify calculator results with actual lenders before making any financial commitments.</strong> Obtain written loan offers and read all terms and conditions carefully. The actual EMI, interest rate, and total cost may differ from calculator estimates.
              </p>

              <h2>Interest Rates and Market Data</h2>
              <p>
                Interest rates, bank offers, and market data mentioned on BudgetGear are based on publicly available information and are subject to change without notice. We update our content regularly, but:
              </p>
              <ul>
                <li>Interest rates change frequently based on RBI policy and market conditions</li>
                <li>Banks may offer different rates to different customers based on credit profiles</li>
                <li>Promotional rates and special offers may have limited availability or specific eligibility criteria</li>
                <li>The rates mentioned in our articles may not reflect current rates at the time you read them</li>
              </ul>
              <p>
                <strong>Always check current interest rates directly with lenders before applying for a loan.</strong>
              </p>

              <h2>Third-Party Information</h2>
              <p>
                Our website may reference or link to third-party websites, including banks, financial institutions, car manufacturers, and other service providers. We do not:
              </p>
              <ul>
                <li>Endorse or recommend any specific lender, product, or service</li>
                <li>Guarantee the accuracy of information on third-party websites</li>
                <li>Control or assume responsibility for third-party content, policies, or practices</li>
                <li>Verify the credentials or legitimacy of third-party entities</li>
              </ul>
              <p>
                Any reliance you place on information from third-party sources is strictly at your own risk.
              </p>

              <h2>No Lender Relationship</h2>
              <p>
                BudgetGear is an independent information and calculator platform. We are not:
              </p>
              <ul>
                <li>A bank, financial institution, or lender</li>
                <li>A loan broker or financial intermediary</li>
                <li>Affiliated with any specific bank or lender</li>
                <li>Authorized to approve or process loan applications</li>
                <li>Responsible for loan approval or rejection decisions</li>
              </ul>
              <p>
                We do not receive compensation from banks or lenders for loan referrals. Our content and recommendations are independent and unbiased.
              </p>

              <h2>Personal Responsibility</h2>
              <p>
                You are solely responsible for:
              </p>
              <ul>
                <li><strong>Accuracy of inputs:</strong> Ensuring all information you enter into calculators is accurate and complete</li>
                <li><strong>Financial decisions:</strong> Any decisions you make based on information from our website</li>
                <li><strong>Due diligence:</strong> Researching and verifying information before making financial commitments</li>
                <li><strong>Understanding terms:</strong> Reading and understanding all loan documents and terms before signing</li>
                <li><strong>Affordability assessment:</strong> Determining whether you can afford a particular loan or vehicle</li>
                <li><strong>Legal compliance:</strong> Ensuring your actions comply with applicable laws and regulations</li>
              </ul>

              <h2>Regional Variations</h2>
              <p>
                BudgetGear primarily focuses on the Indian market. Information, interest rates, and recommendations are based on Indian banking practices, regulations, and market conditions. If you are located outside India:
              </p>
              <ul>
                <li>The information may not be applicable to your region</li>
                <li>Interest rates and loan terms will differ significantly</li>
                <li>Regulatory requirements and consumer protections may vary</li>
                <li>You should consult local financial resources and professionals</li>
              </ul>

              <h2>Content Accuracy and Updates</h2>
              <p>
                While we make every effort to keep our content accurate and up-to-date:
              </p>
              <ul>
                <li>Information may become outdated due to market changes</li>
                <li>Errors or omissions may occur despite our best efforts</li>
                <li>We cannot guarantee that all information is current at the time you access it</li>
                <li>We reserve the right to update or correct content at any time without notice</li>
              </ul>
              <p>
                <strong>Last Updated dates</strong> on articles indicate when content was last reviewed, but market conditions may have changed since then.
              </p>

              <h2>Case Studies and Examples</h2>
              <p>
                Case studies, examples, and scenarios presented on BudgetGear are:
              </p>
              <ul>
                <li>Hypothetical or based on generalized situations</li>
                <li>Intended for illustrative purposes only</li>
                <li>Not guarantees of similar results for your situation</li>
                <li>Simplified for educational clarity and may not reflect all real-world complexities</li>
              </ul>
              <p>
                Individual results will vary based on personal circumstances, market conditions, and lender policies.
              </p>

              <h2>No Guarantee of Results</h2>
              <p>
                We make no guarantees or warranties regarding:
              </p>
              <ul>
                <li>Loan approval or specific interest rates you may receive</li>
                <li>Savings you may achieve through prepayment strategies</li>
                <li>Accuracy of affordability assessments</li>
                <li>Success of negotiation strategies or tactics</li>
                <li>Improvement in credit scores or financial situations</li>
              </ul>

              <h2>Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, BudgetGear and its owners, employees, and contributors shall not be liable for any:
              </p>
              <ul>
                <li>Financial losses resulting from use of our calculators or content</li>
                <li>Decisions made based on information from our website</li>
                <li>Errors, inaccuracies, or omissions in calculator results or content</li>
                <li>Damages arising from reliance on our information</li>
                <li>Consequences of loan applications or financial commitments</li>
                <li>Issues arising from third-party websites or services</li>
              </ul>

              <h2>Professional Consultation Recommended</h2>
              <p>
                We strongly recommend consulting with qualified professionals before making significant financial decisions:
              </p>
              <ul>
                <li><strong>Financial Advisors:</strong> For personalized financial planning and loan advice</li>
                <li><strong>Tax Professionals:</strong> For tax implications of car loans and deductions</li>
                <li><strong>Legal Advisors:</strong> For understanding loan agreements and legal obligations</li>
                <li><strong>Accountants:</strong> For business use of vehicles and financial record-keeping</li>
              </ul>

              <h2>Changes to This Disclaimer</h2>
              <p>
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to the website. Your continued use of BudgetGear after any changes constitutes acceptance of the updated disclaimer.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this disclaimer or need clarification on any information provided on our website, please contact us:
              </p>
              <div className={`p-6 rounded-lg my-6 ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                <p className="mb-2"><strong>BudgetGear</strong></p>
                <p className="mb-2">Email: <a href="mailto:info@budgetgear.in" className="text-blue-600 hover:underline">info@budgetgear.in</a></p>
                <p className="mb-2">Website: <a href="https://budgetgear.in" className="text-blue-600 hover:underline">https://budgetgear.in</a></p>
                <p>Contact Form: <Link href="/contact" className="text-blue-600 hover:underline">budgetgear.in/contact</Link></p>
              </div>

              <div className={`p-6 rounded-lg mt-8 ${isLight ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-700/50'}`}>
                <h3 className="text-xl font-bold mb-3">Key Takeaways</h3>
                <ul className="space-y-2">
                  <li>⚠️ BudgetGear provides information only, not financial advice</li>
                  <li>⚠️ Calculator results are estimates - verify with lenders</li>
                  <li>⚠️ Interest rates and terms vary by individual and lender</li>
                  <li>⚠️ Always consult qualified professionals before major financial decisions</li>
                  <li>⚠️ You are responsible for your own financial decisions</li>
                  <li>⚠️ Read all loan documents carefully before signing</li>
                </ul>
              </div>

              <p className="text-sm mt-8 italic">
                <strong>Last Updated:</strong> November 7, 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
