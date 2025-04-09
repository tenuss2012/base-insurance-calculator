// Project structure for Base Insurance Health Calculator

// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CalculatorProvider } from './context/CalculatorContext';
import { theme } from './styles/theme';
import CalculatorWizard from './components/CalculatorWizard';
import Results from './components/Results';
import NotFound from './components/common/NotFound';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CalculatorProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<CalculatorWizard />} />
              <Route path="/results" element={<Results />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CalculatorProvider>
    </ThemeProvider>
  );
}

export default App;

// File: src/styles/theme.js
export const theme = {
  colors: {
    primary: '#057fb0',    // primary blue
    secondary: '#247fb0',  // blue
    accent: '#4054b2',     // accent blue
    highlight: '#fad03b',  // yellow
    white: '#ffffff',
    lightGray: '#f4f6f8',
    gray: '#e0e0e0',
    darkGray: '#757575',
    text: '#333333',
  },
  fonts: {
    main: "'Poppins', sans-serif",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1440px',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    large: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
  transitions: {
    default: '0.3s ease',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    circle: '50%',
  },
};

// File: src/context/CalculatorContext.js
import React, { createContext, useContext, useReducer } from 'react';

const CalculatorContext = createContext();

const initialState = {
  step: 1,
  location: {
    zipCode: '',
    state: '',
    county: '',
  },
  household: {
    coverageType: 'individual', // 'individual' or 'family'
    applicants: [
      {
        type: 'primary',
        age: '',
        tobaccoUse: false,
      }
    ],
  },
  income: {
    annualIncome: '',
    employerCoverage: false,
    employerCoverageAffordable: null,
  },
  healthcareNeeds: {
    usageLevel: 'medium', // 'low', 'medium', 'high'
    concerns: [], // array of specific concerns
  },
  results: {
    subsidy: 0,
    recommendedPlan: null,
    plans: [],
    loading: false,
    error: null,
  },
};

function calculatorReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: { ...state.location, ...action.payload } };
    case 'SET_HOUSEHOLD':
      return { ...state, household: { ...state.household, ...action.payload } };
    case 'ADD_FAMILY_MEMBER':
      return {
        ...state,
        household: {
          ...state.household,
          applicants: [...state.household.applicants, action.payload],
        },
      };
    case 'REMOVE_FAMILY_MEMBER':
      return {
        ...state,
        household: {
          ...state.household,
          applicants: state.household.applicants.filter((_, index) => index !== action.payload),
        },
      };
    case 'SET_INCOME':
      return { ...state, income: { ...state.income, ...action.payload } };
    case 'SET_HEALTHCARE_NEEDS':
      return { ...state, healthcareNeeds: { ...state.healthcareNeeds, ...action.payload } };
    case 'FETCH_RESULTS_START':
      return { ...state, results: { ...state.results, loading: true, error: null } };
    case 'FETCH_RESULTS_SUCCESS':
      return { ...state, results: { ...state.results, ...action.payload, loading: false } };
    case 'FETCH_RESULTS_ERROR':
      return { ...state, results: { ...state.results, error: action.payload, loading: false } };
    case 'RESET_CALCULATOR':
      return initialState;
    default:
      return state;
  }
}

export function CalculatorProvider({ children }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Helper actions
  const setStep = (step) => dispatch({ type: 'SET_STEP', payload: step });
  const nextStep = () => dispatch({ type: 'SET_STEP', payload: state.step + 1 });
  const prevStep = () => dispatch({ type: 'SET_STEP', payload: state.step - 1 });
  
  const setLocation = (locationData) => dispatch({ type: 'SET_LOCATION', payload: locationData });
  const setHousehold = (householdData) => dispatch({ type: 'SET_HOUSEHOLD', payload: householdData });
  const addFamilyMember = (member) => dispatch({ type: 'ADD_FAMILY_MEMBER', payload: member });
  const removeFamilyMember = (index) => dispatch({ type: 'REMOVE_FAMILY_MEMBER', payload: index });
  const setIncome = (incomeData) => dispatch({ type: 'SET_INCOME', payload: incomeData });
  const setHealthcareNeeds = (needsData) => dispatch({ type: 'SET_HEALTHCARE_NEEDS', payload: needsData });
  
  const fetchResults = async () => {
    dispatch({ type: 'FETCH_RESULTS_START' });
    try {
      // This would be replaced with actual API call
      const response = await calculateInsuranceOptions(state);
      dispatch({ type: 'FETCH_RESULTS_SUCCESS', payload: response });
      return response;
    } catch (error) {
      dispatch({ type: 'FETCH_RESULTS_ERROR', payload: error.message });
      throw error;
    }
  };
  
  const resetCalculator = () => dispatch({ type: 'RESET_CALCULATOR' });

  // Mock function to simulate API calculation
  const calculateInsuranceOptions = async (userData) => {
    // In a real implementation, this would call your backend API
    // which would then fetch from healthcare.gov or other sources
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sample calculation logic
        const income = parseFloat(userData.income.annualIncome);
        const subsidy = calculateSubsidy(income, userData.household.applicants);
        const plans = generateSamplePlans(userData, subsidy);
        
        resolve({
          subsidy,
          plans,
          recommendedPlan: determineRecommendedPlan(plans, userData.healthcareNeeds),
        });
      }, 1500); // Simulate API delay
    });
  };

  // Helper calculation functions (would be much more complex in real implementation)
  const calculateSubsidy = (income, applicants) => {
    // Simplified subsidy calculation
    if (income <= 0) return 0;
    
    const householdSize = applicants.length;
    const fpl = 13590 + (householdSize > 1 ? (householdSize - 1) * 4720 : 0); // 2022 FPL values
    
    const fplPercentage = (income / fpl) * 100;
    
    if (fplPercentage <= 150) return 350;
    if (fplPercentage <= 200) return 300;
    if (fplPercentage <= 250) return 250;
    if (fplPercentage <= 300) return 200;
    if (fplPercentage <= 400) return 150;
    return 0;
  };

  const generateSamplePlans = (userData, subsidy) => {
    // Generate sample plans based on user data
    const bronzePlan = {
      id: 'bronze-1',
      name: 'Bronze Plan',
      tier: 'Bronze',
      premium: 400,
      premiumAfterSubsidy: Math.max(0, 400 - subsidy),
      deductible: 8700,
      outOfPocketMax: 8700,
      coinsurance: 0.5,
      primaryCareCopay: 50,
      specialistCopay: 100,
      genericDrugCopay: 25,
      isHSAEligible: true,
    };

    const silverPlan = {
      id: 'silver-1',
      name: 'Silver Plan',
      tier: 'Silver',
      premium: 625,
      premiumAfterSubsidy: Math.max(0, 625 - subsidy),
      deductible: 3500,
      outOfPocketMax: 8700,
      coinsurance: 0.3,
      primaryCareCopay: 30,
      specialistCopay: 60,
      genericDrugCopay: 15,
      isHSAEligible: false,
    };

    const goldPlan = {
      id: 'gold-1',
      name: 'Gold Plan',
      tier: 'Gold',
      premium: 775,
      premiumAfterSubsidy: Math.max(0, 775 - subsidy),
      deductible: 1500,
      outOfPocketMax: 7000,
      coinsurance: 0.2,
      primaryCareCopay: 20,
      specialistCopay: 40,
      genericDrugCopay: 10,
      isHSAEligible: false,
    };

    const platinumPlan = {
      id: 'platinum-1',
      name: 'Platinum Plan',
      tier: 'Platinum',
      premium: 950,
      premiumAfterSubsidy: Math.max(0, 950 - subsidy),
      deductible: 0,
      outOfPocketMax: 4000,
      coinsurance: 0.1,
      primaryCareCopay: 10,
      specialistCopay: 20,
      genericDrugCopay: 5,
      isHSAEligible: false,
    };

    return [bronzePlan, silverPlan, goldPlan, platinumPlan];
  };

  const determineRecommendedPlan = (plans, healthcareNeeds) => {
    // Logic to determine the recommended plan based on needs
    const { usageLevel, concerns } = healthcareNeeds;
    
    if (usageLevel === 'low' && concerns.length <= 1) {
      return plans.find(plan => plan.tier === 'Bronze') || plans[0];
    } else if (usageLevel === 'high' || concerns.includes('maternity') || concerns.includes('planned-procedures')) {
      return plans.find(plan => plan.tier === 'Gold') || plans[2];
    } else {
      return plans.find(plan => plan.tier === 'Silver') || plans[1];
    }
  };

  return (
    <CalculatorContext.Provider
      value={{
        state,
        setStep,
        nextStep,
        prevStep,
        setLocation,
        setHousehold,
        addFamilyMember,
        removeFamilyMember,
        setIncome,
        setHealthcareNeeds,
        fetchResults,
        resetCalculator,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};

// File: src/components/CalculatorWizard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCalculator } from '../context/CalculatorContext';
import StepIndicator from './common/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import LocationStep from './steps/LocationStep';
import HouseholdStep from './steps/HouseholdStep';
import IncomeStep from './steps/IncomeStep';
import HealthcareNeedsStep from './steps/HealthcareNeedsStep';
import Button from './common/Button';

const CalculatorWizard = () => {
  const { state, nextStep, prevStep, fetchResults } = useCalculator();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await fetchResults();
      navigate('/results');
    } catch (error) {
      console.error('Error calculating results:', error);
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <WelcomeStep onContinue={nextStep} />;
      case 2:
        return <LocationStep />;
      case 3:
        return <HouseholdStep />;
      case 4:
        return <IncomeStep />;
      case 5:
        return <HealthcareNeedsStep />;
      default:
        return <WelcomeStep onContinue={nextStep} />;
    }
  };

  return (
    <WizardContainer>
      <WizardCard>
        <WizardHeader>
          {state.step > 1 && (
            <StepIndicator 
              currentStep={state.step} 
              totalSteps={5} 
            />
          )}
        </WizardHeader>
        
        <WizardContent>
          {renderStep()}
        </WizardContent>
        
        <WizardFooter>
          {state.step > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              Back
            </Button>
          )}
          
          {state.step < 5 ? (
            <Button variant="primary" onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Get Results
            </Button>
          )}
        </WizardFooter>
      </WizardCard>
    </WizardContainer>
  );
};

const WizardContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const WizardCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  overflow: hidden;
`;

const WizardHeader = styled.div`
  padding: 1.5rem;
`;

const WizardContent = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

const WizardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
`;

export default CalculatorWizard;

// File: src/components/steps/WelcomeStep.js
import React from 'react';
import styled from 'styled-components';
import InfoBox from '../common/InfoBox';
import Button from '../common/Button';

const WelcomeStep = ({ onContinue }) => {
  return (
    <WelcomeContainer>
      <Title>Find the Right Health Insurance Plan</Title>
      <Description>
        Use our calculator to find affordable health insurance options that fit your needs and budget. 
        Get personalized recommendations in minutes.
      </Description>
      
      <InfoBox>
        <strong>What you'll need:</strong>
        <ul>
          <li>ZIP code</li>
          <li>Age and number of family members</li>
          <li>Estimated annual household income</li>
          <li>Basic information about your healthcare needs</li>
        </ul>
      </InfoBox>
      
      <ButtonContainer>
        <Button variant="primary" onClick={onContinue}>
          Get Started
        </Button>
      </ButtonContainer>
    </WelcomeContainer>
  );
};

const WelcomeContainer = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

export default WelcomeStep;

// File: src/components/steps/LocationStep.js
import React from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';
import Tooltip from '../common/Tooltip';
import { validateZipCode, fetchLocationData } from '../../utils/locationUtils';

const LocationStep = () => {
  const { state, setLocation } = useCalculator();
  const [error, setError] = React.useState(null);

  const handleZipChange = async (e) => {
    const zipCode = e.target.value;
    setLocation({ zipCode });
    
    if (zipCode.length === 5) {
      if (validateZipCode(zipCode)) {
        setError(null);
        try {
          // In real implementation, this would fetch state and county
          const locationData = await fetchLocationData(zipCode);
          setLocation({
            zipCode,
            state: locationData.state,
            county: locationData.county,
          });
        } catch (err) {
          setError('Unable to verify this ZIP code. Please check and try again.');
        }
      } else {
        setError('Please enter a valid 5-digit ZIP code');
      }
    }
  };

  return (
    <LocationContainer>
      <Title>Where are you located?</Title>
      <Description>
        Your ZIP code helps us determine available plans and pricing in your area.
      </Description>
      
      <FormGroup>
        <Label htmlFor="zipCode">
          ZIP Code
          <Tooltip content="We use your ZIP code to find plans available in your area" />
        </Label>
        <Input
          type="text"
          id="zipCode"
          value={state.location.zipCode}
          onChange={handleZipChange}
          maxLength={5}
          placeholder="Enter your 5-digit ZIP code"
          error={error}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormGroup>
      
      {state.location.state && (
        <LocationConfirmation>
          Location: {state.location.county}, {state.location.state}
        </LocationConfirmation>
      )}
    </LocationContainer>
  );
};

const LocationContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem 0;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? 'red' : props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 127, 176, 0.2);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LocationConfirmation = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
`;

export default LocationStep;

// File: src/components/Results.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCalculator } from '../context/CalculatorContext';
import PlanCard from './results/PlanCard';
import CostComparisonChart from './results/CostComparisonChart';
import Button from './common/Button';
import InfoBox from './common/InfoBox';
import Loader from './common/Loader';

const Results = () => {
  const { state, resetCalculator } = useCalculator();
  const navigate = useNavigate();
  
  // Redirect if no results are available
  React.useEffect(() => {
    if (!state.results.plans.length && !state.results.loading) {
      navigate('/');
    }
  }, [state.results, navigate]);

  if (state.results.loading) {
    return <Loader message="Calculating your personalized options..." />;
  }

  if (state.results.error) {
    return (
      <ErrorContainer>
        <h2>Something went wrong</h2>
        <p>{state.results.error}</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Start Over
        </Button>
      </ErrorContainer>
    );
  }

  const recommendedPlan = state.results.recommendedPlan;
  const otherPlans = state.results.plans.filter(plan => plan.id !== recommendedPlan?.id);

  const handleStartOver = () => {
    resetCalculator();
    navigate('/');
  };

  const handleEmailResults = () => {
    // Implementation for emailing results
    console.log('Email results functionality would go here');
  };

  const handleSpeakToAdvisor = () => {
    // Implementation for contacting an advisor
    console.log('Speak to advisor functionality would go here');
  };

  return (
    <ResultsContainer>
      <ResultsHeader>
        <h1>Your Personalized Results</h1>
        <p>Based on your information, here are your recommended options:</p>
      </ResultsHeader>

      {state.results.subsidy > 0 && (
        <SubsidyBox>
          <strong>Your Premium Insurance Credit: </strong>
          <SubsidyAmount>${state.results.subsidy} per month</SubsidyAmount>
          <p>This credit will reduce your monthly premium costs.</p>
        </SubsidyBox>
      )}

      <RecommendationSection>
        {recommendedPlan && (
          <>
            <PlanCard 
              plan={recommendedPlan}
              isRecommended={true}
              subsidy={state.results.subsidy}
            />
            
            <RecommendationReason>
              <h3>Why We Recommended {recommendedPlan.tier}</h3>
              <p>
                Based on your {state.healthcareNeeds.usageLevel} healthcare usage
                {state.healthcareNeeds.concerns.length > 0 && ` and specific concerns about ${state.healthcareNeeds.concerns.join(', ')}`}, 
                a {recommendedPlan.tier} plan provides a good balance of monthly premiums and out-of-pocket costs.
                {state.results.subsidy > 0 && ` With your income level, you qualify for premium Insurance credits that significantly reduce your monthly costs.`}
              </p>
            </RecommendationReason>
          </>
        )}
      </RecommendationSection>

      <OtherPlansSection>
        <h2>Alternative Options</h2>
        <PlansGrid>
          {otherPlans.map(plan => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              isRecommended={false}
              subsidy={state.results.subsidy}
            />
          ))}
        </PlansGrid>
      </OtherPlansSection>

      <AnalysisSection>
        <h2>Cost Comparison Analysis</h2>
        <CostComparisonChart plans={state.results.plans} />
        <p>
          This chart shows your estimated annual costs under different scenarios. 
          {recommendedPlan && ` The ${recommendedPlan.tier} plan offers the best balance of premium and out-of-pocket costs for your expected healthcare usage.`}
        </p>
      </AnalysisSection>

      <NextStepsBox>
        <strong>Next Steps:</strong>
        <ol>
          <li>Review plan details and compare options</li>
          <li>Enroll during the Open Enrollment Period (November 1 - January 15)</li>
          <li>Have questions? Speak with a Base Insurance advisor for personalized guidance</li>
        </ol>
      </NextStepsBox>

      <ActionButtons>
        <Button variant="primary" onClick={handleEmailResults}>
          Email My Results
        </Button>
        <Button variant="secondary" onClick={handleSpeakToAdvisor}>
          Speak With an Advisor
        </Button>
        <Button variant="text" onClick={handleStartOver}>
          Start Over
        </Button>
      </ActionButtons>
    </ResultsContainer>
  );
};

const ResultsContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }
`;

const SubsidyBox = styled(InfoBox)`
  margin-bottom: 2rem;
  text-align: center;
`;

const SubsidyAmount = styled.span`
  color: ${props => props.theme.colors.accent};
  font-weight: bold;
  font-size: 1.25rem;
`;

const RecommendationSection = styled.div`
  margin-bottom: 2rem;
`;

const RecommendationReason = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: 1.5rem;
  
  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }
`;

const OtherPlansSection = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const AnalysisSection = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }
`;

const NextStepsBox = styled(InfoBox)`
  margin-bottom: 2rem;
  
  ol {
    margin-top: 0.5rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const ErrorContainer = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  
  h2 {
    color: red;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

export default Results;

// File: src/components/common/Button.js
import React from 'react';
import styled, { css } from 'styled-components';

const Button = ({ 
  variant = 'primary', 
  children, 
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...rest 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 600;
  font-size: 1rem;
  transition: all ${props => props.theme.transitions.default};
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  ${props => props.variant === 'primary' && css`
    background-color: ${props.theme.colors.highlight};
    color: ${props.theme.colors.text};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #e2ba32;
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.small};
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: ${props.theme.colors.darkGray};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #5a5a5a;
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.small};
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background-color: transparent;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: rgba(5, 127, 176, 0.1);
    }
  `}
  
  ${props => props.variant === 'text' && css`
    background-color: transparent;
    color: ${props.theme.colors.primary};
    border: none;
    padding: 0.5rem 1rem;
    
    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `}
`;

export default Button;

// File: src/components/common/StepIndicator.js
import React from 'react';
import styled from 'styled-components';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <StepIndicatorContainer>
      <StepLine />
      {Array.from({ length: totalSteps }, (_, index) => (
        <Step 
          key={index}
          isActive={currentStep === index + 1}
          isCompleted={currentStep > index + 1}
        >
          {index + 1}
        </Step>
      ))}
    </StepIndicatorContainer>
  );
};

const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 2rem 0;
`;

const StepLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: ${props => props.theme.colors.gray};
  z-index: 1;
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.isActive) return props.theme.colors.primary;
    if (props.isCompleted) return props.theme.colors.accent;
    return props.theme.colors.gray;
  }};
  color: ${props => {
    if (props.isActive || props.isCompleted) return 'white';
    return props.theme.colors.text;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
`;

export default StepIndicator;

// File: src/components/common/InfoBox.js
import React from 'react';
import styled from 'styled-components';

const InfoBox = ({ children, className }) => {
  return (
    <InfoBoxContainer className={className}>
      {children}
    </InfoBoxContainer>
  );
};

const InfoBoxContainer = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin: 1rem 0;
`;

export default InfoBox;

// File: src/components/results/PlanCard.js
import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const PlanCard = ({ plan, isRecommended = false, subsidy = 0 }) => {
  return (
    <PlanCardContainer isRecommended={isRecommended}>
      {isRecommended && <RecommendedBadge>RECOMMENDED</RecommendedBadge>}
      
      <PlanTitle>{plan.name}</PlanTitle>
      
      <PriceDisplay>
        ${plan.premiumAfterSubsidy}
        <PriceUnit>/month</PriceUnit>
      </PriceDisplay>
      
      {subsidy > 0 && (
        <SubsidyInfo>After ${subsidy} Insurance credit</SubsidyInfo>
      )}
      
      <OriginalPrice>
        <strong>Original Price:</strong> ${plan.premium}/month
      </OriginalPrice>
      
      <Divider />
      
      <PlanDetail>
        <strong>Annual Deductible:</strong> ${plan.deductible.toLocaleString()}
      </PlanDetail>
      
      <PlanDetail>
        <strong>Out-of-Pocket Maximum:</strong> ${plan.outOfPocketMax.toLocaleString()}
      </PlanDetail>
      
      <PlanDetail>
        <strong>Coinsurance:</strong> {plan.coinsurance * 100}% after deductible
      </PlanDetail>
      
      <PlanDetail>
        <strong>Primary Care Visit:</strong> ${plan.primaryCareCopay} copay
      </PlanDetail>
      
      <PlanDetail>
        <strong>Specialist Visit:</strong> ${plan.specialistCopay} copay
      </PlanDetail>
      
      <PlanDetail>
        <strong>Generic Drugs:</strong> ${plan.genericDrugCopay} copay
      </PlanDetail>
      
      {plan.isHSAEligible && (
        <HSABadge>HSA Eligible</HSABadge>
      )}
      
      <ActionButton 
        variant={isRecommended ? "primary" : "secondary"}
        fullWidth
      >
        View {plan.tier} Plans
      </ActionButton>
    </PlanCardContainer>
  );
};

const PlanCardContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 1.5rem;
  position: relative;
  border: 2px solid ${props => props.isRecommended ? props.theme.colors.primary : 'transparent'};
  
  ${props => props.isRecommended && `
    background-color: rgba(5, 127, 176, 0.05);
  `}
`;

const RecommendedBadge = styled.div`
  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  display: inline-block;
  margin-bottom: 0.75rem;
`;

const PlanTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const PriceDisplay = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const PriceUnit = styled.span`
  font-size: 1rem;
  font-weight: 400;
`;

const SubsidyInfo = styled.div`
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const OriginalPrice = styled.div`
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
  margin: 1rem 0;
`;

const PlanDetail = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const HSABadge = styled.div`
  display: inline-block;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin: 1rem 0;
`;

const ActionButton = styled(Button)`
  margin-top: 1rem;
`;

export default PlanCard;

// File: src/components/results/CostComparisonChart.js
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styled from 'styled-components';

const CostComparisonChart = ({ plans }) => {
  // Calculate annual costs for different usage scenarios
  const generateChartData = () => {
    return [
      {
        name: 'Low Usage',
        ...plans.reduce((acc, plan) => {
          // For low usage, mostly just monthly premiums
          const annualPremium = plan.premiumAfterSubsidy * 12;
          const estimatedCare = 500; // Assume minimal healthcare costs
          acc[plan.tier] = annualPremium + estimatedCare;
          return acc;
        }, {})
      },
      {
        name: 'Medium Usage',
        ...plans.reduce((acc, plan) => {
          // For medium usage, premium + partial deductible + some copays
          const annualPremium = plan.premiumAfterSubsidy * 12;
          const partialDeductible = plan.deductible * 0.5; 
          const copays = (plan.primaryCareCopay * 4) + (plan.specialistCopay * 2);
          acc[plan.tier] = annualPremium + partialDeductible + copays;
          return acc;
        }, {})
      },
      {
        name: 'High Usage',
        ...plans.reduce((acc, plan) => {
          // For high usage, premium + full deductible + coinsurance up to OOP max
          const annualPremium = plan.premiumAfterSubsidy * 12;
          const oop = Math.min(
            plan.deductible + ((15000 - plan.deductible) * plan.coinsurance), 
            plan.outOfPocketMax
          );
          acc[plan.tier] = annualPremium + oop;
          return acc;
        }, {})
      },
      {
        name: 'Maximum Cost',
        ...plans.reduce((acc, plan) => {
          // Worst case: premium + full out-of-pocket maximum
          acc[plan.tier] = (plan.premiumAfterSubsidy * 12) + plan.outOfPocketMax;
          return acc;
        }, {})
      }
    ];
  };

  const data = generateChartData();

  const getBarColors = () => {
    const tiers = plans.map(plan => plan.tier);
    const colors = {
      Bronze: '#CD7F32',
      Silver: '#C0C0C0',
      Gold: '#FFD700',
      Platinum: '#E5E4E2'
    };
    
    return tiers.map(tier => colors[tier]);
  };

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
            label={{ value: 'Annual Cost', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Cost']} />
          <Legend />
          {plans.map((plan, index) => (
            <Bar 
              key={plan.tier} 
              dataKey={plan.tier} 
              fill={getBarColors()[index]} 
              name={`${plan.tier} Plan`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1rem;
  box-shadow: ${props => props.theme.shadows.small};
  margin: 1.5rem 0;
`;

export default CostComparisonChart;

// Additional files needed:
// - src/utils/locationUtils.js - utilities for ZIP code validation and data fetching
// - src/api/insuranceApi.js - API integration with healthcare.gov or mock data
// - src/styles/GlobalStyles.js - global CSS styles
// - src/components/common/Tooltip.js - reusable tooltip component
// - src/components/common/Loader.js - loading indicator
// - src/components/common/NotFound.js - 404 page
// - src/components/layout/Header.js - site header with logo
// - src/components/layout/Footer.js - site footer with links
// - src/components/steps/HouseholdStep.js - step 3 component
// - src/components/steps/IncomeStep.js - step 4 component
// - src/components/steps/HealthcareNeedsStep.js - step 5 component