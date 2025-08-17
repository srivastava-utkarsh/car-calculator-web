'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Script from 'next/script'
// Material-UI components
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  IconButton,
  Chip,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material'
import { 
  Savings as PiggyBank, 
  TrendingUp, 
  Schedule as Clock, 
  ChevronLeft, 
  ChevronRight, 
  Palette 
} from '@mui/icons-material'
// Import Version 2 components
import CarDetailsFormV2 from '@/components/v2/CarDetailsFormV2'
import FinancialFormV2 from '@/components/v2/FinancialFormV2'
import ResultsDisplayV2 from '@/components/v2/ResultsDisplayV2'
import TotalCostDisplayV2 from '@/components/v2/TotalCostDisplayV2'
import CostDistributionChart from '@/components/v2/CostDistributionChart'
import EducationalSummary from '@/components/v2/EducationalSummary'

export interface CarData {
  carPrice: number
  downPayment: number
  interestRate: number
  tenure: number
  processingFee: number
  kmPerMonth: number
  fuelCostPerLiter: number
  monthlyIncome: number
  insuranceAndMaintenance?: number
  monthlySavings?: number
  includeFuelInAffordability?: boolean
  monthlyFuelExpense?: number
  loanType?: 'fixed' | 'floating'
  prepaymentPenaltyRate?: number
  parkingFee?: number
  maintenanceCostPerYear?: number
  insuranceCostPerYear?: number
}


// AdSense Component
const AdSenseAd = ({ slot, format, style, responsive = true }: {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}) => {
  useEffect(() => {
    try {
      // @ts-expect-error - AdSense global not typed
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <Box textAlign="center" my={2}>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        Advertisement
      </Typography>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </Box>
  );
};

export default function HomePage() {
  const [showResults, setShowResults] = useState(false) // Toggle results view
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false) // Collapsible state
  const monthlyIncomeInputRef = useRef<HTMLInputElement>(null)

  const [carData, setCarData] = useState<CarData>({
    carPrice: 0,
    downPayment: 0,
    interestRate: 8,
    tenure: 0,
    processingFee: 0,
    kmPerMonth: 0,
    fuelCostPerLiter: 0,
    monthlyIncome: 0,
    insuranceAndMaintenance: 0,
    includeFuelInAffordability: false,
    monthlyFuelExpense: 0,
    parkingFee: 0,
    maintenanceCostPerYear: 0,
    insuranceCostPerYear: 0
  })


  const updateCarData = (updates: Partial<CarData>) => {
    setCarData(prev => ({ ...prev, ...updates }))
  }

  const hideResultsView = () => setShowResults(false)

  const restart = () => {
    setShowResults(false)
    setCarData({
      carPrice: 0,
      downPayment: 0,
      interestRate: 8,
      tenure: 0,
      processingFee: 0,
      kmPerMonth: 0,
      fuelCostPerLiter: 0,
      monthlyIncome: 0,
      insuranceAndMaintenance: 0,
      includeFuelInAffordability: false,
      monthlyFuelExpense: 0,
      parkingFee: 0,
      maintenanceCostPerYear: 0,
      insuranceCostPerYear: 0
    })
  }


  // Material Design implementation
  return (
    <Box component="main" sx={{ minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
      {/* AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* Header Navigation */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: 80 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mr: 2 }}>
              <Box sx={{ width: { xs: 40, sm: 64 }, height: { xs: 40, sm: 64 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image 
                  src="/bck-logo.svg" 
                  alt="BudgetGear Logo" 
                  width={64}
                  height={64}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>
              <Typography 
                variant="h5" 
                component="span" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '1rem', sm: '1.5rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                BudgetGear
              </Typography>
            </Box>

            {/* Navigation Menu - Center */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
              <Typography 
                component="a" 
                href="#calculator" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.75rem', sm: '1rem' },
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  color: 'text.primary',
                  px: { xs: 1, sm: 4 },
                  py: 1,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'text.secondary' }
                }}
              >
                Car Affordability Calculator
              </Typography>
            </Box>

            {/* Material UI Badge */}
            <Chip 
              icon={<Palette />}
              label="Material Design" 
              color="primary" 
              variant="filled"
              sx={{ fontWeight: 500 }}
            />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Section */}
      <Container maxWidth="xl" sx={{ pt: 2 }} id="calculator">
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Typography 
            id="calculator-heading" 
            sx={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
          >
            Car Finance Calculator Tool
          </Typography>
          
          {/* Estimates Notice */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Information</AlertTitle>
            All calculations are estimates for informational purposes only
          </Alert>

          {/* Content Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Column - Calculator Form Panel */}
            <Box sx={{ width: { xs: '100%', lg: isLeftCollapsed ? '80px' : '50%' } }}>
              <motion.div 
                animate={{ width: isLeftCollapsed ? '80px' : 'auto' }}
                transition={{ duration: 0.5 }}
              >
                {isLeftCollapsed ? (
                  // Collapsed State
                  <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400 }}>
                    <IconButton
                      onClick={() => setIsLeftCollapsed(false)}
                      color="primary"
                      sx={{ mb: 2 }}
                      aria-label="Show calculator panel"
                    >
                      <ChevronRight />
                    </IconButton>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        transform: 'rotate(-90deg)', 
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                        letterSpacing: '0.1em'
                      }}
                    >
                      CALCULATOR
                    </Typography>
                  </Paper>
                ) : (
                  // Expanded State
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <AnimatePresence mode="wait">
                      {!showResults ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Paper elevation={2} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                              <Typography variant="h6" fontWeight={600}>
                                Car Cost Details
                              </Typography>
                              <IconButton
                                onClick={() => setIsLeftCollapsed(true)}
                                size="small"
                                color="inherit"
                              >
                                <ChevronLeft />
                              </IconButton>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              <CarDetailsFormV2 
                                carData={carData} 
                                updateCarData={updateCarData}
                                monthlyIncomeInputRef={monthlyIncomeInputRef}
                              />
                              <FinancialFormV2 
                                carData={carData} 
                                updateCarData={updateCarData}
                                monthlyIncomeInputRef={monthlyIncomeInputRef}
                              />
                            </Box>
                          </Paper>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                              Calculation Results
                            </Typography>
                            
                            <ResultsDisplayV2 
                              carData={carData}
                              onBack={hideResultsView}
                              onRestart={restart}
                            />
                          </Paper>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Divider */}
                    <Divider sx={{ my: 1 }} />

                    {/* Cost Distribution Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <Paper elevation={2} sx={{ p: 3 }}>
                        <CostDistributionChart carData={carData} />
                      </Paper>
                    </motion.div>
                  </Box>
                )}
              </motion.div>
            </Box>

            {/* Right Panel - Live Preview */}
            <Box sx={{ width: { xs: '100%', lg: isLeftCollapsed ? 'calc(100% - 80px - 24px)' : '50%' } }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box sx={{ position: { lg: 'sticky' }, top: 32 }}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography 
                      id="results-heading" 
                      sx={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
                    >
                      Loan Calculation Results
                    </Typography>
                    <TotalCostDisplayV2 carData={carData} updateCarData={updateCarData} />
                  </Paper>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Container>


      {/* Smart Prepayment Section */}
      {carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0 && (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card 
              elevation={8} 
              sx={{ 
                background: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 50%, rgba(129,199,132,0.1) 100%)',
                borderRadius: 4,
                border: '1px solid rgba(76,175,80,0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(76,175,80,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'rgba(76,175,80,0.2)', 
                      borderRadius: 3, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <PiggyBank sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </Box>
                
                <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: 'text.primary' }}>
                  Ready to Save on Interest?
                </Typography>
                
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                  Discover how strategic prepayments can reduce your loan tenure by years and save lakhs in interest payments
                </Typography>
                
                {/* Benefits Preview */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, maxWidth: 600, mx: 'auto', flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'rgba(76,175,80,0.05)', border: '1px solid rgba(76,175,80,0.2)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            bgcolor: 'rgba(76,175,80,0.2)', 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        >
                          <Clock sx={{ fontSize: 24, color: 'success.main' }} />
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="success.main">
                            Reduce Tenure
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Finish loan 3-5 years earlier
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'rgba(76,175,80,0.05)', border: '1px solid rgba(76,175,80,0.2)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            bgcolor: 'rgba(76,175,80,0.2)', 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        >
                          <TrendingUp sx={{ fontSize: 24, color: 'success.main' }} />
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="success.main">
                            Massive Savings
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Save ₹10L+ in interest
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                <Button
                  onClick={() => {
                    const params = new URLSearchParams({
                      carPrice: (carData.carPrice || 0).toString(),
                      downPayment: (carData.downPayment || 0).toString(),
                      interestRate: (carData.interestRate || 8).toString(),
                      tenure: (carData.tenure || 0).toString()
                    })
                    window.open(`/prepayment?${params.toString()}`, '_blank')
                  }}
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<PiggyBank />}
                  sx={{ 
                    px: 4, 
                    py: 2, 
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(76,175,80,0.25)'
                    }
                  }}
                >
                  Calculate Smart Prepayment
                </Button>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                  Free analysis • No hidden charges • Instant results
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      )}

      {/* Educational Summary Section */}
      <EducationalSummary carData={carData} />

      {/* Footer Ad */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <AdSenseAd 
            slot="1234567894" 
            format="auto"
            style={{ width: '728px', height: '90px', margin: '0 auto' }}
          />
        </Box>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <AdSenseAd 
            slot="1234567895" 
            format="auto"
            style={{ width: '320px', height: '50px', margin: '0 auto' }}
          />
        </Box>
      </Container>

      {/* Footer - Disclaimer */}
      <Box component="footer" sx={{ mt: 12, mb: 6 }}>
        <Container maxWidth="xl">
          <Paper elevation={2} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box 
                sx={{ 
                  flexShrink: 0, 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: 'action.hover',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mt: 0.5
                }}
              >
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>i</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Disclaimer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  This car affordability calculator serves as a helpful tool to understand potential financial outcomes when planning your vehicle purchase. It is designed for informational and educational purposes only and does not constitute professional financial advice for your specific loan decisions. The calculations and projections shown are estimates and should be treated as general guidance rather than exact financial recommendations. For personalized advice tailored to your unique financial circumstances, we strongly encourage you to consult with a qualified financial advisor who can discuss the various options and their implications for your situation.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Sticky Bottom Mobile Ad */}
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1300,
          display: { xs: 'block', md: 'none' },
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
          <AdSenseAd 
            slot="1234567896" 
            format="auto"
            style={{ width: '320px', height: '50px', margin: '0 auto' }}
          />
          <IconButton 
            onClick={(e) => {
              const stickyAd = e.currentTarget.parentElement?.parentElement;
              if (stickyAd) (stickyAd as HTMLElement).style.display = 'none';
            }}
            size="small"
            color="inherit"
            aria-label="Close ad"
            sx={{ ml: 1 }}
          >
            ×
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}