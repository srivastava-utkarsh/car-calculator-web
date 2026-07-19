'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'

export default function TermsPage() {
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
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }]} />
            
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 mt-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Terms & Conditions
            </h1>
            
            <div className={`mb-8 p-4 rounded-lg ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
              <p className={`text-sm ${isLight ? 'text-blue-900' : 'text-blue-200'}`}>
                <strong>Last Updated:</strong> November 7, 2024<br />
                <strong>Effective Date:</strong> November 7, 2024
              </p>
            </div>

            <div className={`prose prose-lg max-w-none ${isLight ? 'prose-slate' : 'prose-invert'}`}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to BudgetGear. By accessing or using our website at budgetgear.in (the &quot;Site&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Site.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and BudgetGear (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We reserve the right to modify these Terms at any time, and your continued use of the Site after such modifications constitutes your acceptance of the updated Terms.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                BudgetGear provides free online calculators and educational content related to car financing, including but not limited to:
              </p>
              <ul>
                <li>Car affordability calculator</li>
                <li>Car loan EMI calculator</li>
                <li>Loan prepayment calculator</li>
                <li>Educational articles and guides on car financing</li>
                <li>Comparison tools and financial planning resources</li>
              </ul>
              <p>
                Our services are provided for informational and educational purposes only. We do not provide financial advice, loan services, or act as a financial intermediary.
              </p>

              <h2>3. Use of Calculators and Tools</h2>
              
              <h3>3.1 Accuracy of Calculations</h3>
              <p>
                While we strive to ensure the accuracy of our calculators and tools, we make no warranties or representations regarding the accuracy, completeness, or reliability of the results. Calculator results are estimates based on the information you provide and standard financial formulas.
              </p>
              
              <h3>3.2 No Financial Advice</h3>
              <p>
                The calculators and content on our Site are for informational purposes only and do not constitute financial, legal, or professional advice. You should consult with qualified financial advisors, accountants, or other professionals before making any financial decisions.
              </p>
              
              <h3>3.3 Your Responsibility</h3>
              <p>
                You are solely responsible for:
              </p>
              <ul>
                <li>Verifying the accuracy of information you input into our calculators</li>
                <li>Confirming calculations with lenders before making financial commitments</li>
                <li>Understanding the terms and conditions of any financial products you consider</li>
                <li>Making informed decisions based on your personal financial situation</li>
              </ul>

              <h2>4. Intellectual Property Rights</h2>
              
              <h3>4.1 Our Content</h3>
              <p>
                All content on the Site, including but not limited to text, graphics, logos, images, calculator code, articles, and software, is the property of BudgetGear or its content suppliers and is protected by Indian and international copyright, trademark, and other intellectual property laws.
              </p>
              
              <h3>4.2 Limited License</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and use the Site for personal, non-commercial purposes. You may not:
              </p>
              <ul>
                <li>Copy, modify, distribute, or reproduce any content without our written permission</li>
                <li>Use our calculators or content for commercial purposes</li>
                <li>Reverse engineer, decompile, or disassemble any software or code</li>
                <li>Remove or alter any copyright, trademark, or other proprietary notices</li>
                <li>Frame or mirror any part of the Site without our express written consent</li>
              </ul>

              <h2>5. User Conduct</h2>
              <p>
                You agree not to use the Site to:
              </p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the Site or servers</li>
                <li>Use automated systems (bots, scrapers) without our permission</li>
                <li>Collect or harvest information about other users</li>
                <li>Impersonate any person or entity</li>
              </ul>

              <h2>6. Third-Party Links and Content</h2>
              <p>
                Our Site may contain links to third-party websites, including banks, financial institutions, and car manufacturers. These links are provided for your convenience only. We do not endorse, control, or assume responsibility for:
              </p>
              <ul>
                <li>The content, privacy policies, or practices of third-party websites</li>
                <li>Products or services offered by third parties</li>
                <li>The accuracy of information on third-party sites</li>
                <li>Any transactions you enter into with third parties</li>
              </ul>
              <p>
                Your use of third-party websites is at your own risk and subject to their terms and conditions.
              </p>

              <h2>7. Disclaimer of Warranties</h2>
              <p>
                THE SITE AND ALL CONTENT, TOOLS, AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul>
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Warranties that the Site will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p>
                We do not warrant that the Site will meet your requirements or that any errors will be corrected. Your use of the Site is at your sole risk.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, BUDGETGEAR AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
              </p>
              <ul>
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or use</li>
                <li>Financial losses resulting from use of our calculators or content</li>
                <li>Errors or inaccuracies in calculator results</li>
                <li>Decisions made based on information from our Site</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Any other matter relating to the Site or services</li>
              </ul>
              <p>
                This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if we have been advised of the possibility of such damage.
              </p>

              <h2>9. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless BudgetGear and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys&apos; fees) arising out of or related to:
              </p>
              <ul>
                <li>Your use of the Site</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any content you submit or transmit through the Site</li>
                <li>Financial decisions made based on our calculators or content</li>
              </ul>

              <h2>10. Advertising and Sponsored Content</h2>
              <p>
                Our Site displays advertisements through Google AdSense and may contain sponsored content or affiliate links. We may receive compensation when you click on certain links or advertisements. However:
              </p>
              <ul>
                <li>We do not endorse any specific products, services, or lenders</li>
                <li>Our editorial content is independent and unbiased</li>
                <li>Advertising does not influence our calculator algorithms or educational content</li>
                <li>We clearly distinguish between editorial content and advertisements</li>
              </ul>

              <h2>11. Privacy and Data Protection</h2>
              <p>
                Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>{' '}
                to understand how we collect, use, and protect your information.
              </p>

              <h2>12. Modifications to the Site</h2>
              <p>
                We reserve the right to:
              </p>
              <ul>
                <li>Modify, suspend, or discontinue any part of the Site at any time</li>
                <li>Change calculator formulas or methodologies</li>
                <li>Update content, features, or functionality</li>
                <li>Impose limits on certain features or restrict access to parts of the Site</li>
              </ul>
              <p>
                We will not be liable to you or any third party for any modification, suspension, or discontinuance of the Site.
              </p>

              <h2>13. Termination</h2>
              <p>
                We may terminate or suspend your access to the Site immediately, without prior notice or liability, for any reason, including but not limited to:
              </p>
              <ul>
                <li>Breach of these Terms</li>
                <li>Violation of applicable laws</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>At our sole discretion</li>
              </ul>
              <p>
                Upon termination, your right to use the Site will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>

              <h2>14. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts located in India.
              </p>

              <h2>15. Dispute Resolution</h2>
              <p>
                In the event of any dispute, claim, or controversy arising out of or relating to these Terms or your use of the Site, you agree to first attempt to resolve the dispute informally by contacting us at legal@budgetgear.in. If the dispute cannot be resolved within 30 days, either party may pursue formal legal action.
              </p>

              <h2>16. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>

              <h2>17. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any other legal notices published on the Site, constitute the entire agreement between you and BudgetGear regarding your use of the Site and supersede all prior agreements and understandings.
              </p>

              <h2>18. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <div className={`p-6 rounded-lg my-6 ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                <p className="mb-2"><strong>BudgetGear</strong></p>
                <p className="mb-2">Email: <a href="mailto:legal@budgetgear.in" className="text-blue-600 hover:underline">legal@budgetgear.in</a></p>
                <p className="mb-2">Website: <a href="https://budgetgear.in" className="text-blue-600 hover:underline">https://budgetgear.in</a></p>
                <p>Contact Form: <Link href="/contact" className="text-blue-600 hover:underline">budgetgear.in/contact</Link></p>
              </div>

              <div className={`p-6 rounded-lg mt-8 ${isLight ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-700/50'}`}>
                <h3 className="text-xl font-bold mb-3">Important Reminders</h3>
                <ul className="space-y-2">
                  <li>⚠️ Our calculators provide estimates only - verify with lenders</li>
                  <li>⚠️ We do not provide financial advice - consult professionals</li>
                  <li>⚠️ Calculator results depend on accuracy of your inputs</li>
                  <li>⚠️ Interest rates and terms vary by lender and individual circumstances</li>
                  <li>⚠️ Always read loan documents carefully before signing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
