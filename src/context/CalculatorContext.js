import React, { createContext, useContext, useReducer } from 'react';

const CalculatorContext = createContext();

const initialState = {
  step: 1,
  location: {
    zipCode: '',
    state: '',
    county: '',
  },
  personal: {
    age: '',
    gender: 'male',
    smoker: false,
    healthStatus: 'average',
  },
  financial: {
    annualIncome: '',
    totalAssets: '',
    totalDebt: '',
    mortgageBalance: '',
    educationFund: '',
    retirementSavings: '',
  },
  family: {
    maritalStatus: 'single',
    spouseIncome: '',
    dependents: [],
    childrenEducation: false,
    educationCost: '',
  },
  needs: {
    incomeYears: 10,
    finalExpenses: 15000,
    additionalNeeds: '',
  },
  results: {
    recommendedCoverage: 0,
    breakdown: {
      incomeReplacement: 0,
      mortgagePayoff: 0,
      debtPayoff: 0,
      education: 0,
      finalExpenses: 0,
      additional: 0,
    },
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
    case 'SET_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } };
    case 'SET_FINANCIAL':
      return { ...state, financial: { ...state.financial, ...action.payload } };
    case 'SET_FAMILY':
      return { ...state, family: { ...state.family, ...action.payload } };
    case 'ADD_DEPENDENT':
      return {
        ...state,
        family: {
          ...state.family,
          dependents: [...state.family.dependents, action.payload],
        },
      };
    case 'REMOVE_DEPENDENT':
      return {
        ...state,
        family: {
          ...state.family,
          dependents: state.family.dependents.filter((_, index) => index !== action.payload),
        },
      };
    case 'SET_NEEDS':
      return { ...state, needs: { ...state.needs, ...action.payload } };
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
  const setPersonal = (personalData) => dispatch({ type: 'SET_PERSONAL', payload: personalData });
  const setFinancial = (financialData) => dispatch({ type: 'SET_FINANCIAL', payload: financialData });
  const setFamily = (familyData) => dispatch({ type: 'SET_FAMILY', payload: familyData });
  const addDependent = (dependent) => dispatch({ type: 'ADD_DEPENDENT', payload: dependent });
  const removeDependent = (index) => dispatch({ type: 'REMOVE_DEPENDENT', payload: index });
  const setNeeds = (needsData) => dispatch({ type: 'SET_NEEDS', payload: needsData });
  
  const fetchResults = async () => {
    dispatch({ type: 'FETCH_RESULTS_START' });
    try {
      // Calculate life insurance needs
      const results = calculateLifeInsuranceNeeds(state);
      dispatch({ type: 'FETCH_RESULTS_SUCCESS', payload: results });
      return results;
    } catch (error) {
      dispatch({ type: 'FETCH_RESULTS_ERROR', payload: error.message });
      throw error;
    }
  };
  
  const resetCalculator = () => dispatch({ type: 'RESET_CALCULATOR' });

  // Function to calculate life insurance needs
  const calculateLifeInsuranceNeeds = (userData) => {
    try {
      // Parse income and other financial data, removing commas
      const annualIncome = parseFloat(userData.financial.annualIncome.replace(/,/g, '')) || 0;
      const mortgageBalance = parseFloat(userData.financial.mortgageBalance.replace(/,/g, '')) || 0;
      const totalDebt = parseFloat(userData.financial.totalDebt.replace(/,/g, '')) || 0;
      const educationFund = parseFloat(userData.financial.educationFund.replace(/,/g, '')) || 0;
      const finalExpenses = parseFloat(userData.needs.finalExpenses) || 15000; // Default funeral costs
      const additionalNeeds = parseFloat(userData.needs.additionalNeeds.replace(/,/g, '')) || 0;
      const incomeYears = parseInt(userData.needs.incomeYears) || 10;
      
      // Calculate each component of insurance needs
      const incomeReplacement = annualIncome * incomeYears;
      const mortgagePayoff = mortgageBalance;
      const debtPayoff = totalDebt;
      const education = educationFund;
      
      // Calculate total recommended coverage
      const totalCoverage = incomeReplacement + mortgagePayoff + debtPayoff + education + finalExpenses + additionalNeeds;
      
      // Round to nearest $10,000 for cleaner presentation
      const roundedCoverage = Math.ceil(totalCoverage / 10000) * 10000;
      
      return {
        recommendedCoverage: roundedCoverage,
        breakdown: {
          incomeReplacement,
          mortgagePayoff,
          debtPayoff,
          education,
          finalExpenses,
          additional: additionalNeeds,
        }
      };
    } catch (error) {
      console.error('Error calculating life insurance needs:', error);
      throw new Error('Unable to calculate life insurance needs. Please check your inputs and try again.');
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
        setPersonal,
        setFinancial, 
        setFamily,
        addDependent,
        removeDependent,
        setNeeds,
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