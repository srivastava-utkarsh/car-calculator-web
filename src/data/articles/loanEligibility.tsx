import Link from 'next/link'

export const loanEligibility = (
  <>
    <p>
      Two colleagues with the same salary apply for the same car loan at the same bank. One gets approved in a day at 8.8%; the other waits a week and is offered 11.2%. The difference is rarely luck — it is eligibility mechanics: credit score, existing obligations, employment profile and documentation. This guide explains exactly how Indian lenders evaluate car loan applications, what documents you need ready, and the specific steps that move you into the best-rate bracket.
    </p>

    <h2>The Five Things Lenders Actually Check</h2>

    <h3>1. CIBIL Score: The Rate Decider</h3>
    <p>
      Your credit score (CIBIL is the most widely used bureau; Experian, Equifax and CRIF also operate in India) is the single biggest factor in the rate you are offered:
    </p>
    <table>
      <thead>
        <tr>
          <th>CIBIL Score</th>
          <th>What It Means for Your Car Loan</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>750–900</td>
          <td>Best advertised rates, fastest approval, highest LTV</td>
        </tr>
        <tr>
          <td>700–749</td>
          <td>Approval likely, rate 0.25–1% above the best slab</td>
        </tr>
        <tr>
          <td>650–699</td>
          <td>Approval possible with conditions — higher rate, larger down payment, or a co-applicant</td>
        </tr>
        <tr>
          <td>Below 650</td>
          <td>Banks usually decline; NBFCs may lend at 14–18%</td>
        </tr>
        <tr>
          <td>No history (NTC)</td>
          <td>&quot;New to credit&quot; — approval depends on income and employer profile; rates mid-range</td>
        </tr>
      </tbody>
    </table>
    <p>
      Many banks now publish score-linked rate grids openly, and a 100-point score difference can mean a 1–2% rate difference. On a ₹8 lakh, 5-year loan, 2% is roughly ₹45,000 of extra interest — the cost of a neglected credit score.
    </p>

    <h3>2. FOIR: How Much EMI You Can Carry</h3>
    <p>
      Lenders compute your <strong>Fixed Obligation to Income Ratio</strong> — all existing EMIs plus the proposed car EMI, divided by monthly income. Most banks cap FOIR at <strong>50–60%</strong>. If you earn ₹80,000 and already pay a ₹25,000 home loan EMI, a 55% FOIR cap leaves ₹19,000 of EMI headroom regardless of what the EMI calculator says you can afford.
    </p>
    <p>
      Note the distinction: the bank checks whether you <em>can</em> repay; it does not check whether the loan is <em>wise</em>. A 50% FOIR is approvable but financially suffocating. The <Link href="/blog/20-4-10-car-buying-rule-india/">20/4/10 rule</Link> — total car costs under 10% of gross income — is a far safer personal ceiling. Our <Link href="/car-affordability-calculator/">affordability calculator</Link> applies it automatically.
    </p>

    <h3>3. Income and Its Stability</h3>
    <p>
      Typical minimums are ₹2.5–3 lakh annual income for salaried applicants, higher for self-employed. Lenders also weigh <strong>who pays you</strong>: employees of government bodies, PSUs and large listed companies get better internal risk grades than employees of small firms, and salaried applicants generally get better terms than self-employed ones with equal income, because salary income is easier to verify.
    </p>

    <h3>4. Age and Work History</h3>
    <p>
      Most banks want applicants between 21 and 60–65 (at loan maturity), with at least 1–2 years of total work experience and often 6–12 months with the current employer. Job-hoppers with gaps face more scrutiny, not rejection.
    </p>

    <h3>5. The Car Itself</h3>
    <p>
      The loan is secured by hypothecation of the vehicle, so the lender cares what you are buying: new cars get the best LTV and rates; <Link href="/blog/used-car-loan-guide-india/">used cars</Link> get lower LTV and higher rates; and some lenders restrict financing for niche or commercial-use vehicles.
    </p>

    <h2>Documents Checklist</h2>

    <h3>Salaried Applicants</h3>
    <ul>
      <li>PAN card and Aadhaar (identity and address KYC)</li>
      <li>Last 3 months&apos; salary slips</li>
      <li>Form 16 or last 2 years&apos; ITR</li>
      <li>Last 6 months&apos; bank statements (salary account)</li>
      <li>Proforma invoice / quotation of the car from the dealer</li>
      <li>Passport-size photographs</li>
    </ul>

    <h3>Self-Employed Applicants</h3>
    <ul>
      <li>PAN, Aadhaar, and business address proof</li>
      <li>Last 2–3 years&apos; ITR with computation of income</li>
      <li>Audited financials (P&amp;L and balance sheet) where applicable</li>
      <li>Last 6–12 months&apos; bank statements (current account)</li>
      <li>Business continuity proof (GST registration, shop licence, etc.)</li>
    </ul>
    <p>
      Having these scanned and ready cuts approval time from days to hours, especially since most lenders now run digital KYC and account-aggregator based income verification.
    </p>

    <h2>How to Improve Your Eligibility Before Applying</h2>
    <ol>
      <li><strong>Check your own CIBIL report 2–3 months early.</strong> One free report per bureau per year is your right. Dispute errors — wrongly reported late payments and closed loans shown as open are common and fixable.</li>
      <li><strong>Bring credit card utilisation under 30%.</strong> Maxed-out cards depress your score quickly; paying them down recovers it within one or two billing cycles.</li>
      <li><strong>Avoid new credit applications for 3–6 months.</strong> Every application triggers a hard inquiry, and clusters of inquiries read as credit hunger.</li>
      <li><strong>Close small stray obligations.</strong> A ₹1,500 consumer-durable EMI reduces your FOIR headroom disproportionately for the joy it brings.</li>
      <li><strong>Add a co-applicant if needed.</strong> A spouse or parent with income and a clean score raises the approvable amount and can improve the rate. Remember the co-applicant is equally liable, and the loan appears on their credit report too.</li>
      <li><strong>Increase the down payment.</strong> Lower LTV means lower lender risk; at 70–80% LTV some banks shave the rate. It also simply makes the loan safer for you — see our <Link href="/blog/car-down-payment-strategy-india/">down payment strategy guide</Link>.</li>
    </ol>

    <h2>Pre-Approved Offers: Convenient, Not Always Cheapest</h2>
    <p>
      If your salary account bank flashes a &quot;pre-approved car loan&quot; with one-click disbursal, treat it as a starting quote, not a favour. Pre-approved means your KYC and income are already verified — it says nothing about the rate being competitive. Get one competing quote (a PSU bank is a good benchmark, with rates often starting around 8.5–9%) and ask your bank to match it. Rate negotiation on car loans works far more often than people assume, especially with a 750+ score.
    </p>

    <h2>If Your Application Is Rejected</h2>
    <p>
      Ask for the reason — lenders will tell you the broad category. Then fix the actual problem rather than reapplying immediately: repeated applications in quick succession damage your score further. Score issue → six months of clean repayment behaviour. FOIR issue → close an obligation, add a co-applicant, or reduce the loan amount. Documentation issue → usually resolvable within days. A rejection is recorded nowhere permanently; only the inquiry is.
    </p>

    <h2>Frequently Asked Questions</h2>

    <h3>Does checking my own CIBIL score reduce it?</h3>
    <p>
      No. Checking your own score is a &quot;soft inquiry&quot; and has zero impact. Only lender-initiated hard inquiries affect the score, and even those only mildly unless clustered.
    </p>

    <h3>Can I get a car loan without income proof?</h3>
    <p>
      Banks: effectively no. Some NBFCs lend against banking history or collateral at high rates. If you are new to credit with informal income, a larger down payment (40–50%) and a co-applicant are the practical path.
    </p>

    <h3>How long does approval take?</h3>
    <p>
      With clean documents and a good score: same day to 48 hours at most private banks; 2–5 working days at PSU banks. Disbursal happens directly to the dealer.
    </p>

    <h3>Should I max out the amount the bank approves?</h3>
    <p>
      No. Bank approval reflects repayment capacity at their risk tolerance, not your financial wellbeing. Decide your budget first with the <Link href="/car-affordability-calculator/">affordability calculator</Link>, then borrow the smaller of that number and the bank&apos;s offer.
    </p>

    <h2>The Bottom Line</h2>
    <p>
      Car loan eligibility is mostly decided before you ever apply — by your credit behaviour over the preceding year. Check your report early, clean up utilisation and errors, keep your FOIR sensible, and walk in with complete documents and a competing quote. Do that, and you are the applicant who gets the 8.8% same-day approval.
    </p>
  </>
)
