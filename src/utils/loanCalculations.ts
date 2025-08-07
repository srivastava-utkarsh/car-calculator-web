// Loan calculation utilities based on formulas from suggestions.txt

export interface LoanDetails {
  principal: number;
  monthlyEMI: number;
  monthlyRate: number;
  remainingTenure: number;
}

export interface PrepaymentResult {
  newTenureMonths: number;
  newTenureYears: number;
  monthsReduced: number;
  interestSaved: number;
  totalSavings: number;
  penaltyAmount?: number;
  netSavings?: number;
}

export interface StepUpResult {
  newTenureMonths: number;
  newTenureYears: number;
  monthsReduced: number;
  interestSaved: number;
  totalSavings: number;
  additionalEMIPerMonth: number;
}

export interface ShorterTenureResult {
  newEMI: number;
  emiIncrease: number;
  interestSaved: number;
  totalSavings: number;
}

/**
 * Calculate the impact of a lump sum prepayment (Reduce Tenure)
 * Formula from suggestions.txt: n = ln(EMI / (EMI - r * P_new)) / ln(1 + r)
 * Includes penalty calculation for fixed-rate loans
 */
export const calculatePrepaymentImpact = (
  loanDetails: LoanDetails,
  prepaymentAmount: number,
  loanType: 'fixed' | 'floating' = 'floating',
  penaltyRate: number = 0
): PrepaymentResult => {
  const { principal, monthlyEMI, monthlyRate, remainingTenure } = loanDetails;
  
  // Step 1: Remaining Principal after prepayment
  const newPrincipal = principal - prepaymentAmount;
  
  // Calculate penalty amount for fixed-rate loans
  const penaltyAmount = loanType === 'fixed' ? (prepaymentAmount * penaltyRate / 100) : 0;
  
  if (newPrincipal <= 0) {
    const totalInterestSaved = calculateRemainingInterest(loanDetails);
    return {
      newTenureMonths: 0,
      newTenureYears: 0,
      monthsReduced: remainingTenure,
      interestSaved: totalInterestSaved,
      totalSavings: totalInterestSaved,
      penaltyAmount,
      netSavings: totalInterestSaved - penaltyAmount
    };
  }
  
  // Step 2: Calculate new tenure using formula from suggestions.txt
  // n = ln(EMI / (EMI - r * P_new)) / ln(1 + r)
  const numerator = Math.log(monthlyEMI / (monthlyEMI - monthlyRate * newPrincipal));
  const denominator = Math.log(1 + monthlyRate);
  const newTenureMonths = Math.ceil(numerator / denominator);
  
  const monthsReduced = remainingTenure - newTenureMonths;
  const originalInterest = calculateRemainingInterest(loanDetails);
  const newInterest = calculateTotalInterest(newPrincipal, monthlyEMI, newTenureMonths);
  const interestSaved = originalInterest - newInterest;
  const netSavings = interestSaved - penaltyAmount;
  
  return {
    newTenureMonths,
    newTenureYears: Math.ceil(newTenureMonths / 12),
    monthsReduced,
    interestSaved,
    totalSavings: interestSaved,
    penaltyAmount,
    netSavings
  };
};

/**
 * Calculate the impact of increasing EMI (Step Up EMI)
 * Formula from suggestions.txt: n = ln(New_EMI / (New_EMI - r * P)) / ln(1 + r)
 */
export const calculateStepUpEMIImpact = (
  loanDetails: LoanDetails,
  newEMI: number
): StepUpResult => {
  const { principal, monthlyEMI, monthlyRate, remainingTenure } = loanDetails;
  
  if (newEMI <= monthlyEMI) {
    return {
      newTenureMonths: remainingTenure,
      newTenureYears: Math.ceil(remainingTenure / 12),
      monthsReduced: 0,
      interestSaved: 0,
      totalSavings: 0,
      additionalEMIPerMonth: 0
    };
  }
  
  // Calculate new tenure with increased EMI
  // n = ln(New_EMI / (New_EMI - r * P)) / ln(1 + r)
  const numerator = Math.log(newEMI / (newEMI - monthlyRate * principal));
  const denominator = Math.log(1 + monthlyRate);
  const newTenureMonths = Math.ceil(numerator / denominator);
  
  const monthsReduced = remainingTenure - newTenureMonths;
  const originalInterest = calculateRemainingInterest(loanDetails);
  const newInterest = calculateTotalInterest(principal, newEMI, newTenureMonths);
  const interestSaved = originalInterest - newInterest;
  
  return {
    newTenureMonths,
    newTenureYears: Math.ceil(newTenureMonths / 12),
    monthsReduced,
    interestSaved,
    totalSavings: interestSaved,
    additionalEMIPerMonth: newEMI - monthlyEMI
  };
};

/**
 * Calculate EMI for a shorter tenure (Opt for Shorter Remaining Tenure)
 * Formula from suggestions.txt: EMI = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 */
export const calculateShorterTenureEMI = (
  loanDetails: LoanDetails,
  newTenureMonths: number
): ShorterTenureResult => {
  const { principal, monthlyEMI, monthlyRate, remainingTenure } = loanDetails;
  
  if (newTenureMonths >= remainingTenure) {
    return {
      newEMI: monthlyEMI,
      emiIncrease: 0,
      interestSaved: 0,
      totalSavings: 0
    };
  }
  
  // Calculate new EMI using formula from suggestions.txt
  // EMI = P * [r(1 + r)^n] / [(1 + r)^n - 1]
  const rPowerN = Math.pow(1 + monthlyRate, newTenureMonths);
  const newEMI = principal * (monthlyRate * rPowerN) / (rPowerN - 1);
  
  const originalInterest = calculateRemainingInterest(loanDetails);
  const newInterest = calculateTotalInterest(principal, newEMI, newTenureMonths);
  const interestSaved = originalInterest - newInterest;
  
  return {
    newEMI,
    emiIncrease: newEMI - monthlyEMI,
    interestSaved,
    totalSavings: interestSaved
  };
};

/**
 * Calculate remaining interest for current loan
 */
export const calculateRemainingInterest = (loanDetails: LoanDetails): number => {
  const { principal, monthlyEMI, remainingTenure } = loanDetails;
  const totalPayment = monthlyEMI * remainingTenure;
  return totalPayment - principal;
};

/**
 * Calculate total interest for given parameters
 */
export const calculateTotalInterest = (
  principal: number,
  monthlyEMI: number,
  tenureMonths: number
): number => {
  const totalPayment = monthlyEMI * tenureMonths;
  return totalPayment - principal;
};

/**
 * Format currency to Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

/**
 * Format tenure to readable format
 */
export const formatTenure = (months: number): string => {
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'}`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  
  return `${years} year${years === 1 ? '' : 's'} ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
};