/**
 * Safe calculation utilities for car affordability calculator
 * Handles all boundary conditions and edge cases from suggestions.txt
 */

import { CarData } from '@/app/page';

// Constants for validation limits
export const VALIDATION_LIMITS = {
  CAR_PRICE: { MIN: 1, MAX: 50000000 }, // ₹1 to ₹5 Crore
  DOWN_PAYMENT: { MIN: 0, MAX: 50000000 },
  INTEREST_RATE: { MIN: 0.1, MAX: 30 }, // 0.1% to 30% per annum
  TENURE_YEARS: { MIN: 1, MAX: 10 }, // 1 to 10 years
  MONTHLY_INCOME: { MIN: 1, MAX: 100000000 }, // ₹1 to ₹10 Crore
  OPERATIONAL_COSTS: { MIN: 0, MAX: 1000000 }, // ₹0 to ₹10 Lakh per month
} as const;

/**
 * Safe number validation and sanitization
 */
export const safeNumber = (value: unknown, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
  try {
    // Handle null, undefined, NaN, Infinity with more robust checks
    if (value == null) {
      return min;
    }
    
    let num: number;
    
    if (typeof value === 'string') {
      // Clean the string more carefully
      const cleaned = value.replace(/[^0-9.-]/g, '');
      num = parseFloat(cleaned);
    } else if (typeof value === 'number') {
      num = value;
    } else {
      // Try to convert other types
      num = Number(value);
    }
    
    // Check for invalid numbers with fallback compatibility
    if (typeof num !== 'number' || num !== num || !isFinite(num)) { // NaN and Infinity checks
      return min;
    }
    
    // Clamp to valid range
    return Math.max(min, Math.min(max, num));
  } catch (error) {
    // Fallback for any conversion errors
    return min;
  }
};

/**
 * Safe EMI calculation with proper boundary condition handling
 * Addresses division by zero and edge cases from suggestions.txt
 */
export const calculateSafeEMI = (principal: number, annualRate: number, years: number): number => {
  try {
    // Validate inputs using safe boundaries
    const safePrincipal = safeNumber(principal, VALIDATION_LIMITS.CAR_PRICE.MIN, VALIDATION_LIMITS.CAR_PRICE.MAX);
    const safeRate = safeNumber(annualRate, VALIDATION_LIMITS.INTEREST_RATE.MIN, VALIDATION_LIMITS.INTEREST_RATE.MAX);
    const safeYears = safeNumber(years, VALIDATION_LIMITS.TENURE_YEARS.MIN, VALIDATION_LIMITS.TENURE_YEARS.MAX);
    
    // Handle edge cases that cause calculation errors
    if (safePrincipal <= 0) return 0;
    if (safeYears <= 0) return 0;
    
    // Handle zero interest rate edge case
    if (safeRate <= 0 || safeRate < 0.001) {
      // For zero/minimal interest, EMI = Principal / Total Months
      return safePrincipal / (safeYears * 12);
    }
    
    const monthlyRate = safeRate / (12 * 100);
    const totalMonths = safeYears * 12;
    
    // Handle potential overflow in power calculation with robust checks
    let powerTerm: number;
    try {
      powerTerm = Math.pow(1 + monthlyRate, totalMonths);
    } catch (error) {
      // Fallback if power calculation fails
      return safePrincipal / totalMonths;
    }
    
    // Check for mathematical overflow or underflow with compatibility
    if (typeof powerTerm !== 'number' || powerTerm !== powerTerm || !isFinite(powerTerm) || powerTerm <= 1) {
      // Fallback to simple division for edge cases
      return safePrincipal / totalMonths;
    }
    
    const emi = (safePrincipal * monthlyRate * powerTerm) / (powerTerm - 1);
    
    // Validate final result
    return safeNumber(emi, 0, safePrincipal * 2); // EMI shouldn't exceed 2x principal
    
  } catch (error) {
    console.error('EMI calculation error:', error);
    // Fallback: Simple division
    const fallbackPrincipal = safeNumber(principal, 1, VALIDATION_LIMITS.CAR_PRICE.MAX);
    const fallbackYears = safeNumber(years, 1, VALIDATION_LIMITS.TENURE_YEARS.MAX);
    return fallbackPrincipal / (fallbackYears * 12);
  }
};

/**
 * Validate car data inputs with comprehensive boundary checking
 */
export const validateCarData = (data: CarData | Record<string, unknown>) => {
  const validated = {
    carPrice: safeNumber(data.carPrice, VALIDATION_LIMITS.CAR_PRICE.MIN, VALIDATION_LIMITS.CAR_PRICE.MAX),
    downPayment: safeNumber(data.downPayment, VALIDATION_LIMITS.DOWN_PAYMENT.MIN, VALIDATION_LIMITS.DOWN_PAYMENT.MAX),
    interestRate: safeNumber(data.interestRate, VALIDATION_LIMITS.INTEREST_RATE.MIN, VALIDATION_LIMITS.INTEREST_RATE.MAX),
    tenure: safeNumber(data.tenure, VALIDATION_LIMITS.TENURE_YEARS.MIN, VALIDATION_LIMITS.TENURE_YEARS.MAX),
    monthlyIncome: safeNumber(data.monthlyIncome, 0, VALIDATION_LIMITS.MONTHLY_INCOME.MAX),
    kmPerMonth: safeNumber(data.kmPerMonth, 0, 10000),
    fuelCostPerLiter: safeNumber(data.fuelCostPerLiter, 0, 1000),
    processingFee: safeNumber(data.processingFee, 0, 1000000),
    insuranceAndMaintenance: safeNumber(data.insuranceAndMaintenance, 0, VALIDATION_LIMITS.OPERATIONAL_COSTS.MAX),
    monthlyFuelExpense: safeNumber(data.monthlyFuelExpense, 0, VALIDATION_LIMITS.OPERATIONAL_COSTS.MAX),
    parkingFee: safeNumber(data.parkingFee, 0, VALIDATION_LIMITS.OPERATIONAL_COSTS.MAX),
    maintenanceCostPerYear: safeNumber(data.maintenanceCostPerYear, 0, VALIDATION_LIMITS.OPERATIONAL_COSTS.MAX * 12),
  };
  
  // Ensure down payment doesn't exceed car price
  if (validated.downPayment > validated.carPrice) {
    validated.downPayment = validated.carPrice;
  }
  
  return validated;
};

/**
 * Safe loan amount calculation
 */
export const calculateSafeLoanAmount = (carPrice: number, downPayment: number): number => {
  const safeCarPrice = safeNumber(carPrice, VALIDATION_LIMITS.CAR_PRICE.MIN, VALIDATION_LIMITS.CAR_PRICE.MAX);
  const safeDownPayment = safeNumber(downPayment, 0, safeCarPrice);
  
  const loanAmount = safeCarPrice - safeDownPayment;
  return Math.max(0, loanAmount); // Ensure non-negative
};

/**
 * Safe percentage calculations with proper boundary handling
 */
export const calculateSafePercentage = (value: number, total: number): number => {
  const safeValue = safeNumber(value, 0);
  const safeTotal = safeNumber(total, 0.01); // Prevent division by zero
  
  if (safeTotal <= 0) return 0;
  
  const percentage = (safeValue / safeTotal) * 100;
  return safeNumber(percentage, 0, 100);
};

/**
 * Safe affordability rule checks with exact boundary handling
 */
export const checkAffordabilityRules = (carData: Record<string, unknown>) => {
  const validated = validateCarData(carData);
  
  // 20/4/10 Rule checks with proper boundary handling
  const downPaymentPercentage = calculateSafePercentage(validated.downPayment, validated.carPrice);
  const loanAmount = calculateSafeLoanAmount(validated.carPrice, validated.downPayment);
  const emi = calculateSafeEMI(loanAmount, validated.interestRate, validated.tenure);
  
  // Calculate total monthly car expenses
  const totalMonthlyCost = emi + 
    (validated.monthlyFuelExpense || 0) + 
    (validated.parkingFee || 0) + 
    ((validated.maintenanceCostPerYear || 0) / 12) +
    ((validated.insuranceAndMaintenance || 0) / 12);
  
  const incomePercentage = validated.monthlyIncome > 0 
    ? calculateSafePercentage(totalMonthlyCost, validated.monthlyIncome)
    : 0;
  
  return {
    // Exact boundary handling for 20% rule
    downPaymentOk: downPaymentPercentage >= 19.99, // Handle floating point precision
    downPaymentPercentage,
    
    // Exact boundary handling for 4-year rule
    tenureOk: validated.tenure <= 4.01, // Handle floating point precision
    
    // Exact boundary handling for 10% rule
    incomeOk: incomePercentage <= 10.01, // Handle floating point precision
    incomePercentage,
    
    // Safe calculations
    emi: safeNumber(emi),
    loanAmount: safeNumber(loanAmount),
    totalMonthlyCost: safeNumber(totalMonthlyCost),
    
    // Overall affordability
    isAffordable: downPaymentPercentage >= 19.99 && validated.tenure <= 4.01 && incomePercentage <= 10.01
  };
};

/**
 * Safe input sanitization for form fields
 */
export const sanitizeInput = (value: string, type: 'number' | 'currency' = 'number'): string => {
  if (!value) return '';
  
  try {
    // Remove all non-numeric characters except decimal point and comma
    let sanitized = value.replace(/[^0-9.,]/g, '');
    
    // Handle multiple decimal points
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Remove commas for calculation but keep for display
    const numericValue = sanitized.replace(/,/g, '');
    
    if (type === 'currency') {
      // Format with Indian locale comma separation
      const num = parseFloat(numericValue);
      if (!isNaN(num) && isFinite(num)) {
        return num.toLocaleString('en-IN');
      }
    }
    
    return sanitized;
  } catch (error) {
    console.error('Input sanitization error:', error);
    return '';
  }
};

/**
 * Safe math operations with error handling
 */
export const safeMath = {
  add: (...numbers: number[]): number => {
    try {
      const result = numbers.reduce((sum, num) => sum + safeNumber(num), 0);
      return safeNumber(result);
    } catch {
      return 0;
    }
  },
  
  multiply: (a: number, b: number): number => {
    try {
      const result = safeNumber(a) * safeNumber(b);
      return safeNumber(result);
    } catch {
      return 0;
    }
  },
  
  divide: (a: number, b: number, fallback: number = 0): number => {
    try {
      const safeA = safeNumber(a);
      const safeB = safeNumber(b, 0.001); // Prevent division by zero
      
      if (safeB === 0) return fallback;
      
      const result = safeA / safeB;
      return safeNumber(result);
    } catch {
      return fallback;
    }
  },
  
  power: (base: number, exponent: number): number => {
    try {
      const safeBase = safeNumber(base);
      const safeExponent = safeNumber(exponent);
      
      const result = Math.pow(safeBase, safeExponent);
      return safeNumber(result, 0, Number.MAX_SAFE_INTEGER);
    } catch {
      return 1;
    }
  }
};

/**
 * Format currency safely
 */
export const formatCurrencySafe = (amount: number): string => {
  try {
    const safeAmount = safeNumber(amount, 0);
    return `₹${Math.round(safeAmount).toLocaleString('en-IN')}`;
  } catch {
    return '₹0';
  }
};

/**
 * Format number with commas safely
 */
export const formatNumberSafe = (num: number): string => {
  try {
    const safeNum = safeNumber(num, 0);
    return safeNum.toLocaleString('en-IN');
  } catch {
    return '0';
  }
};