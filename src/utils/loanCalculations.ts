// Loan calculation utilities based on formulas from suggestions.txt
// Updated with safe calculations to handle boundary conditions

import { safeNumber, safeMath, VALIDATION_LIMITS } from './safeCalculations';

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
  try {
    // Validate and sanitize inputs
    const safePrincipal = safeNumber(loanDetails.principal, 1, VALIDATION_LIMITS.CAR_PRICE.MAX);
    const safeEMI = safeNumber(loanDetails.monthlyEMI, 1);
    const safeRate = safeNumber(loanDetails.monthlyRate, 0, 1);
    const safeTenure = safeNumber(loanDetails.remainingTenure, 1, 360);
    const safePrepayment = safeNumber(prepaymentAmount, 0, safePrincipal);
    const safePenaltyRate = safeNumber(penaltyRate, 0, 100);
    
    // Step 1: Remaining Principal after prepayment
    const newPrincipal = Math.max(0, safePrincipal - safePrepayment);
    
    // Calculate penalty amount for fixed-rate loans
    const penaltyAmount = loanType === 'fixed' ? safeMath.multiply(safePrepayment, safePenaltyRate / 100) : 0;
    
    if (newPrincipal <= 0) {
      const totalInterestSaved = calculateRemainingInterest({ ...loanDetails, principal: safePrincipal, monthlyEMI: safeEMI, remainingTenure: safeTenure, monthlyRate: safeRate });
      return {
        newTenureMonths: 0,
        newTenureYears: 0,
        monthsReduced: safeTenure,
        interestSaved: totalInterestSaved,
        totalSavings: totalInterestSaved,
        penaltyAmount,
        netSavings: Math.max(0, totalInterestSaved - penaltyAmount)
      };
    }
    
    // Step 2: Calculate new tenure using formula from suggestions.txt with safe math
    // n = ln(EMI / (EMI - r * P_new)) / ln(1 + r)
    const denominator = safeEMI - safeMath.multiply(safeRate, newPrincipal);
    
    // Handle edge case where EMI <= r * P_new (invalid scenario)
    if (denominator <= 0) {
      return {
        newTenureMonths: safeTenure,
        newTenureYears: Math.ceil(safeTenure / 12),
        monthsReduced: 0,
        interestSaved: 0,
        totalSavings: 0,
        penaltyAmount,
        netSavings: -penaltyAmount
      };
    }
    
    const ratio = safeMath.divide(safeEMI, denominator);
    if (ratio <= 1) {
      // Invalid calculation, return safe fallback
      return {
        newTenureMonths: safeTenure,
        newTenureYears: Math.ceil(safeTenure / 12),
        monthsReduced: 0,
        interestSaved: 0,
        totalSavings: 0,
        penaltyAmount,
        netSavings: -penaltyAmount
      };
    }
    
    const numerator = Math.log(ratio);
    const logDenominator = Math.log(1 + safeRate);
    
    if (logDenominator <= 0) {
      // Handle zero or negative interest rate
      const newTenureMonths = Math.ceil(safeMath.divide(newPrincipal, safeEMI));
      const monthsReduced = Math.max(0, safeTenure - newTenureMonths);
      const originalInterest = calculateRemainingInterest({ principal: safePrincipal, monthlyEMI: safeEMI, remainingTenure: safeTenure, monthlyRate: safeRate });
      const newInterest = calculateTotalInterest(newPrincipal, safeEMI, newTenureMonths);
      const interestSaved = Math.max(0, originalInterest - newInterest);
      
      return {
        newTenureMonths: safeNumber(newTenureMonths, 0, 360),
        newTenureYears: Math.ceil(newTenureMonths / 12),
        monthsReduced,
        interestSaved,
        totalSavings: interestSaved,
        penaltyAmount,
        netSavings: interestSaved - penaltyAmount
      };
    }
    
    const newTenureMonths = Math.ceil(safeMath.divide(numerator, logDenominator));
    const safeNewTenure = safeNumber(newTenureMonths, 0, safeTenure);
    
    const monthsReduced = Math.max(0, safeTenure - safeNewTenure);
    const originalInterest = calculateRemainingInterest({ principal: safePrincipal, monthlyEMI: safeEMI, remainingTenure: safeTenure, monthlyRate: safeRate });
    const newInterest = calculateTotalInterest(newPrincipal, safeEMI, safeNewTenure);
    const interestSaved = Math.max(0, originalInterest - newInterest);
    const netSavings = interestSaved - penaltyAmount;
    
    return {
      newTenureMonths: safeNewTenure,
      newTenureYears: Math.ceil(safeNewTenure / 12),
      monthsReduced,
      interestSaved,
      totalSavings: interestSaved,
      penaltyAmount,
      netSavings
    };
  } catch (error) {
    console.error('Prepayment calculation error:', error);
    // Return safe fallback values
    return {
      newTenureMonths: safeNumber(loanDetails.remainingTenure, 0, 360),
      newTenureYears: Math.ceil(safeNumber(loanDetails.remainingTenure, 0, 360) / 12),
      monthsReduced: 0,
      interestSaved: 0,
      totalSavings: 0,
      penaltyAmount: 0,
      netSavings: 0
    };
  }
};

/**
 * Calculate the impact of increasing EMI (Step Up EMI)
 * Formula from suggestions.txt: n = ln(New_EMI / (New_EMI - r * P)) / ln(1 + r)
 */
export const calculateStepUpEMIImpact = (
  loanDetails: LoanDetails,
  newEMI: number
): StepUpResult => {
  try {
    // Validate and sanitize inputs
    const safePrincipal = safeNumber(loanDetails.principal, 1, VALIDATION_LIMITS.CAR_PRICE.MAX);
    const safeEMI = safeNumber(loanDetails.monthlyEMI, 1);
    const safeNewEMI = safeNumber(newEMI, 1);
    const safeRate = safeNumber(loanDetails.monthlyRate, 0, 1);
    const safeTenure = safeNumber(loanDetails.remainingTenure, 1, 360);
    
    if (safeNewEMI <= safeEMI) {
      return {
        newTenureMonths: safeTenure,
        newTenureYears: Math.ceil(safeTenure / 12),
        monthsReduced: 0,
        interestSaved: 0,
        totalSavings: 0,
        additionalEMIPerMonth: 0
      };
    }
    
    // Calculate new tenure with increased EMI with safe math
    // n = ln(New_EMI / (New_EMI - r * P)) / ln(1 + r)
    const denominator = safeNewEMI - safeMath.multiply(safeRate, safePrincipal);
    
    // Handle edge case where NewEMI <= r * P (invalid scenario)
    if (denominator <= 0) {
      return {
        newTenureMonths: safeTenure,
        newTenureYears: Math.ceil(safeTenure / 12),
        monthsReduced: 0,
        interestSaved: 0,
        totalSavings: 0,
        additionalEMIPerMonth: safeNewEMI - safeEMI
      };
    }
    
    const ratio = safeMath.divide(safeNewEMI, denominator);
    if (ratio <= 1) {
      return {
        newTenureMonths: safeTenure,
        newTenureYears: Math.ceil(safeTenure / 12),
        monthsReduced: 0,
        interestSaved: 0,
        totalSavings: 0,
        additionalEMIPerMonth: safeNewEMI - safeEMI
      };
    }
    
    const numerator = Math.log(ratio);
    const logDenominator = Math.log(1 + safeRate);
    
    if (logDenominator <= 0) {
      // Handle zero or negative interest rate
      const newTenureMonths = Math.ceil(safeMath.divide(safePrincipal, safeNewEMI));
      const safeNewTenure = safeNumber(newTenureMonths, 0, safeTenure);
      const monthsReduced = Math.max(0, safeTenure - safeNewTenure);
      const originalInterest = calculateRemainingInterest({ principal: safePrincipal, monthlyEMI: safeEMI, remainingTenure: safeTenure, monthlyRate: safeRate });
      const newInterest = calculateTotalInterest(safePrincipal, safeNewEMI, safeNewTenure);
      const interestSaved = Math.max(0, originalInterest - newInterest);
      
      return {
        newTenureMonths: safeNewTenure,
        newTenureYears: Math.ceil(safeNewTenure / 12),
        monthsReduced,
        interestSaved,
        totalSavings: interestSaved,
        additionalEMIPerMonth: safeNewEMI - safeEMI
      };
    }
    
    const newTenureMonths = Math.ceil(safeMath.divide(numerator, logDenominator));
    const safeNewTenure = safeNumber(newTenureMonths, 0, safeTenure);
    
    const monthsReduced = Math.max(0, safeTenure - safeNewTenure);
    const originalInterest = calculateRemainingInterest({ principal: safePrincipal, monthlyEMI: safeEMI, remainingTenure: safeTenure, monthlyRate: safeRate });
    const newInterest = calculateTotalInterest(safePrincipal, safeNewEMI, safeNewTenure);
    const interestSaved = Math.max(0, originalInterest - newInterest);
    
    return {
      newTenureMonths: safeNewTenure,
      newTenureYears: Math.ceil(safeNewTenure / 12),
      monthsReduced,
      interestSaved,
      totalSavings: interestSaved,
      additionalEMIPerMonth: safeNewEMI - safeEMI
    };
  } catch (error) {
    console.error('Step-up EMI calculation error:', error);
    const safeTenure = safeNumber(loanDetails.remainingTenure, 0, 360);
    return {
      newTenureMonths: safeTenure,
      newTenureYears: Math.ceil(safeTenure / 12),
      monthsReduced: 0,
      interestSaved: 0,
      totalSavings: 0,
      additionalEMIPerMonth: 0
    };
  }
};

/**
 * Calculate EMI for a shorter tenure (Opt for Shorter Remaining Tenure)
 * Formula from suggestions.txt: EMI = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 */
export const calculateShorterTenureEMI = (
  loanDetails: LoanDetails,
  newTenureMonths: number
): ShorterTenureResult => {
  try {
    // Validate and sanitize inputs
    const safePrincipal = safeNumber(loanDetails.principal, 1, VALIDATION_LIMITS.CAR_PRICE.MAX);
    const safeEMI = safeNumber(loanDetails.monthlyEMI, 1);
    const safeRate = safeNumber(loanDetails.monthlyRate, 0, 1);
    const safeTenure = safeNumber(loanDetails.remainingTenure, 1, 360);
    const safeNewTenure = safeNumber(newTenureMonths, 1, safeTenure);
    
    if (safeNewTenure >= safeTenure) {
      return {
        newEMI: safeEMI,
        emiIncrease: 0,
        interestSaved: 0,
        totalSavings: 0
      };
    }
    
    // Calculate new EMI using formula from suggestions.txt with safe math
    // EMI = P * [r(1 + r)^n] / [(1 + r)^n - 1]
    let newEMI: number;
    
    if (safeRate <= 0.001) {
      // Handle zero or minimal interest rate
      newEMI = safeMath.divide(safePrincipal, safeNewTenure);
    } else {
      const rPowerN = safeMath.power(1 + safeRate, safeNewTenure);
      
      // Check for potential overflow or underflow
      if (!Number.isFinite(rPowerN) || rPowerN <= 1) {
        // Fallback to simple division
        newEMI = safeMath.divide(safePrincipal, safeNewTenure);
      } else {
        const numerator = safeMath.multiply(safePrincipal, safeMath.multiply(safeRate, rPowerN));
        const denominator = rPowerN - 1;
        newEMI = safeMath.divide(numerator, denominator);
      }
    }
    
    const safeNewEMI = safeNumber(newEMI, safeEMI, safePrincipal * 2);
    
    const originalInterest = calculateRemainingInterest({ principal: safePrincipal, monthlyEMI: safeEMI, remainingTenure: safeTenure, monthlyRate: safeRate });
    const newInterest = calculateTotalInterest(safePrincipal, safeNewEMI, safeNewTenure);
    const interestSaved = Math.max(0, originalInterest - newInterest);
    
    return {
      newEMI: safeNewEMI,
      emiIncrease: safeNewEMI - safeEMI,
      interestSaved,
      totalSavings: interestSaved
    };
  } catch (error) {
    console.error('Shorter tenure EMI calculation error:', error);
    const safeEMI = safeNumber(loanDetails.monthlyEMI, 1);
    return {
      newEMI: safeEMI,
      emiIncrease: 0,
      interestSaved: 0,
      totalSavings: 0
    };
  }
};

/**
 * Calculate remaining interest for current loan
 */
export const calculateRemainingInterest = (loanDetails: LoanDetails): number => {
  try {
    const safePrincipal = safeNumber(loanDetails.principal, 0);
    const safeEMI = safeNumber(loanDetails.monthlyEMI, 0);
    const safeTenure = safeNumber(loanDetails.remainingTenure, 0, 360);
    
    const totalPayment = safeMath.multiply(safeEMI, safeTenure);
    return Math.max(0, totalPayment - safePrincipal);
  } catch (error) {
    console.error('Remaining interest calculation error:', error);
    return 0;
  }
};

/**
 * Calculate total interest for given parameters
 */
export const calculateTotalInterest = (
  principal: number,
  monthlyEMI: number,
  tenureMonths: number
): number => {
  try {
    const safePrincipal = safeNumber(principal, 0);
    const safeEMI = safeNumber(monthlyEMI, 0);
    const safeTenure = safeNumber(tenureMonths, 0, 360);
    
    const totalPayment = safeMath.multiply(safeEMI, safeTenure);
    return Math.max(0, totalPayment - safePrincipal);
  } catch (error) {
    console.error('Total interest calculation error:', error);
    return 0;
  }
};

/**
 * Format currency to Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  try {
    const safeAmount = safeNumber(amount, 0);
    return `₹${Math.round(safeAmount).toLocaleString('en-IN')}`;
  } catch (error) {
    console.error('Currency formatting error:', error);
    return '₹0';
  }
};

/**
 * Format tenure to readable format
 */
export const formatTenure = (months: number): string => {
  try {
    const safeMonths = safeNumber(months, 0, 360);
    
    if (safeMonths < 12) {
      return `${safeMonths} month${safeMonths === 1 ? '' : 's'}`;
    }
    
    const years = Math.floor(safeMonths / 12);
    const remainingMonths = safeMonths % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years === 1 ? '' : 's'}`;
    }
    
    return `${years} year${years === 1 ? '' : 's'} ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
  } catch (error) {
    console.error('Tenure formatting error:', error);
    return '0 months';
  }
};