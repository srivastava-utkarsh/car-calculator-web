'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'

export default function PrivacyPolicyPage() {
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
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
            
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 mt-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Privacy Policy
            </h1>
            
            <div className={`mb-8 p-4 rounded-lg ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
              <p className={`text-sm ${isLight ? 'text-blue-900' : 'text-blue-200'}`}>
                <strong>Last Updated:</strong> November 7, 2024<br />
                <strong>Effective Date:</strong> November 7, 2024
              </p>
            </div>

            <div className={`prose prose-lg max-w-none ${isLight ? 'prose-slate' : 'prose-invert'}`}>
              <h2>1. Introduction</h2>
              <p>
                Welcome to BudgetGear (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your information. This Privacy Policy explains our practices regarding data collection and usage when you visit our website at budgetgear.in (the &quot;Site&quot;).
              </p>
              <p>
                BudgetGear provides free car financing calculators and educational content to help users in India make informed car buying decisions. We respect your privacy and are committed to protecting any personal information you may provide while using our services.
              </p>

              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Information You Provide</h3>
              <p>
                We collect information that you voluntarily provide to us when you:
              </p>
              <ul>
                <li>Use our calculators (all calculations are performed locally in your browser)</li>
                <li>Contact us through our contact form</li>
                <li>Subscribe to our newsletter (if applicable)</li>
                <li>Leave comments on our blog posts (if enabled)</li>
              </ul>
              <p>
                This may include: name, email address, and any information you choose to include in your messages to us.
              </p>

              <h3>2.2 Automatically Collected Information</h3>
              <p>
                When you visit our Site, we automatically collect certain information about your device and browsing activity, including:
              </p>
              <ul>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device type</li>
                <li><strong>Usage Information:</strong> Pages visited, time spent on pages, links clicked, referring website</li>
                <li><strong>Location Information:</strong> General geographic location based on IP address (country/city level)</li>
              </ul>

              <h3>2.3 Cookies and Tracking Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our Site. Cookies are small text files stored on your device that help us:
              </p>
              <ul>
                <li>Remember your preferences (such as theme selection)</li>
                <li>Understand how you use our Site</li>
                <li>Improve our content and services</li>
                <li>Serve relevant advertisements</li>
              </ul>

              <h2>3. Third-Party Advertising and Cookies</h2>
              
              <h3>3.1 Google AdSense</h3>
              <p>
                <strong>We use Google AdSense to display advertisements on our Site.</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website and/or other websites on the Internet.
              </p>
              <p>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our Site and/or other sites on the Internet. These cookies are used to:
              </p>
              <ul>
                <li>Serve personalized advertisements based on your interests</li>
                <li>Measure ad performance and effectiveness</li>
                <li>Prevent showing you the same ads repeatedly</li>
                <li>Report on ad impressions, ad service usage, and interactions</li>
              </ul>

              <h3>3.2 Your Advertising Choices</h3>
              <p>
                You have choices regarding personalized advertising:
              </p>
              <ul>
                <li>
                  <strong>Opt out of personalized ads:</strong> Visit{' '}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Google Ads Settings
                  </a>{' '}
                  to opt out of personalized advertising by Google
                </li>
                <li>
                  <strong>Opt out of third-party vendor cookies:</strong> Visit{' '}
                  <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    aboutads.info
                  </a>{' '}
                  to opt out of third-party vendor use of cookies for personalized advertising
                </li>
                <li>
                  <strong>Browser settings:</strong> You can set your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our Site may not function properly without cookies
                </li>
              </ul>

              <h3>3.3 Google Analytics</h3>
              <p>
                We use Google Analytics to understand how visitors use our Site. Google Analytics uses cookies to collect information such as:
              </p>
              <ul>
                <li>How often users visit our Site</li>
                <li>What pages they visit and in what sequence</li>
                <li>How long they stay on each page</li>
                <li>What site referred them to us</li>
              </ul>
              <p>
                We use this information to improve our Site and services. Google Analytics collects only the IP address assigned to you on the date you visit our Site, not your name or other identifying information. You can opt out of Google Analytics by installing the{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </p>

              <h2>4. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our calculators and content</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
                <li>Analyze usage patterns and improve user experience</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Display relevant advertisements through Google AdSense</li>
              </ul>

              <h2>5. Calculator Data Privacy</h2>
              <p>
                <strong>Important:</strong> All calculations performed using our car affordability, EMI, and prepayment calculators are processed entirely in your browser. We do not collect, store, or transmit any of the financial information you enter into our calculators. Your calculation data never leaves your device.
              </p>

              <h2>6. Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul>
                <li><strong>With your consent:</strong> When you explicitly agree to share your information</li>
                <li><strong>Service providers:</strong> With trusted third-party service providers who assist us in operating our Site (e.g., hosting, analytics, email services) under strict confidentiality agreements</li>
                <li><strong>Advertising partners:</strong> With Google AdSense and other advertising partners as described in Section 3</li>
                <li><strong>Legal requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Protection of rights:</strong> To protect our rights, property, or safety, or that of our users or the public</li>
              </ul>

              <h2>7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure hosting infrastructure</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal information</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>

              <h2>8. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>

              <h2>9. Your Rights and Choices</h2>
              <p>
                You have the following rights regarding your personal information:
              </p>
              <ul>
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications at any time</li>
                <li><strong>Cookie control:</strong> Manage cookie preferences through your browser settings</li>
                <li><strong>Ad preferences:</strong> Control personalized advertising through Google Ads Settings</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided in Section 13.
              </p>

              <h2>10. Children&apos;s Privacy</h2>
              <p>
                Our Site is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our systems.
              </p>

              <h2>11. Third-Party Links</h2>
              <p>
                Our Site may contain links to third-party websites, including bank websites, car manufacturer sites, and other resources. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>

              <h2>12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul>
                <li>Posting the updated policy on this page with a new &quot;Last Updated&quot; date</li>
                <li>Displaying a notice on our homepage</li>
                <li>Sending an email notification (if you have subscribed to our communications)</li>
              </ul>
              <p>
                Your continued use of our Site after any changes indicates your acceptance of the updated Privacy Policy.
              </p>

              <h2>13. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className={`p-6 rounded-lg my-6 ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                <p className="mb-2"><strong>BudgetGear</strong></p>
                <p className="mb-2">Email: <a href="mailto:privacy@budgetgear.in" className="text-blue-600 hover:underline">privacy@budgetgear.in</a></p>
                <p className="mb-2">Website: <a href="https://budgetgear.in" className="text-blue-600 hover:underline">https://budgetgear.in</a></p>
                <p>Contact Form: <Link href="/contact" className="text-blue-600 hover:underline">budgetgear.in/contact</Link></p>
              </div>

              <h2>14. Governing Law</h2>
              <p>
                This Privacy Policy is governed by and construed in accordance with the laws of India. Any disputes arising from this Privacy Policy or your use of our Site shall be subject to the exclusive jurisdiction of the courts in India.
              </p>

              <h2>15. Consent</h2>
              <p>
                By using our Site, you consent to the collection, use, and sharing of your information as described in this Privacy Policy. If you do not agree with this Privacy Policy, please do not use our Site.
              </p>

              <div className={`p-6 rounded-lg mt-8 ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
                <h3 className="text-xl font-bold mb-3">Summary of Key Points</h3>
                <ul className="space-y-2">
                  <li>✓ We use cookies and Google AdSense for advertising</li>
                  <li>✓ Calculator data is processed locally and never stored</li>
                  <li>✓ You can opt out of personalized ads via Google Ads Settings</li>
                  <li>✓ We do not sell your personal information</li>
                  <li>✓ You have rights to access, correct, and delete your data</li>
                  <li>✓ Contact us at privacy@budgetgear.in for any privacy concerns</li>
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
