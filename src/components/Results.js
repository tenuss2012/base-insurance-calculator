import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCalculator } from '../context/CalculatorContext';
import Button from './common/Button';

const Results = () => {
  const { state, resetCalculator } = useCalculator();
  const navigate = useNavigate();
  
  // Redirect if no results are available
  useEffect(() => {
    if (!state.results.recommendedCoverage && !state.results.loading) {
      navigate('/');
    }
  }, [state.results, navigate]);

  const handleStartOver = () => {
    resetCalculator();
    navigate('/');
  };

  const handleEmailResults = () => {
    alert('Email results functionality would be implemented here');
  };

  const handleSpeakToAdvisor = () => {
    alert('Speak to advisor functionality would be implemented here');
  };

  if (state.results.loading) {
    return (
      <LoadingContainer>
        <h2>Calculating your life insurance needs...</h2>
        <LoadingSpinner />
      </LoadingContainer>
    );
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

  // Format currency numbers
  const formatCurrency = (value) => {
    return '$' + value.toLocaleString();
  };

  return (
    <ResultsContainer>
      <ResultsHeader>
        <h1>Your Life Insurance Needs</h1>
        <p>Based on the information you provided, here's our recommendation for your coverage amount:</p>
      </ResultsHeader>

      <RecommendationContainer>
        <RecommendedAmount>
          {formatCurrency(state.results.recommendedCoverage)}
        </RecommendedAmount>
        <RecommendationSubtitle>
          Recommended Coverage Amount
        </RecommendationSubtitle>
      </RecommendationContainer>

      <BreakdownContainer>
        <BreakdownTitle>How We Calculated This Amount</BreakdownTitle>
        
        <BreakdownRow>
          <BreakdownLabel>Income Replacement:</BreakdownLabel>
          <BreakdownValue>{formatCurrency(state.results.breakdown.incomeReplacement)}</BreakdownValue>
          <BreakdownDescription>
            This covers your income for {state.needs.incomeYears} years to support your family.
          </BreakdownDescription>
        </BreakdownRow>
        
        <BreakdownRow>
          <BreakdownLabel>Mortgage Balance:</BreakdownLabel>
          <BreakdownValue>{formatCurrency(state.results.breakdown.mortgagePayoff)}</BreakdownValue>
          <BreakdownDescription>
            This covers your outstanding mortgage balance.
          </BreakdownDescription>
        </BreakdownRow>
        
        <BreakdownRow>
          <BreakdownLabel>Other Debt:</BreakdownLabel>
          <BreakdownValue>{formatCurrency(state.results.breakdown.debtPayoff)}</BreakdownValue>
          <BreakdownDescription>
            This covers your other outstanding debts.
          </BreakdownDescription>
        </BreakdownRow>
        
        <BreakdownRow>
          <BreakdownLabel>Education Costs:</BreakdownLabel>
          <BreakdownValue>{formatCurrency(state.results.breakdown.education)}</BreakdownValue>
          <BreakdownDescription>
            This covers future education expenses for your dependents.
          </BreakdownDescription>
        </BreakdownRow>
        
        <BreakdownRow>
          <BreakdownLabel>Final Expenses:</BreakdownLabel>
          <BreakdownValue>{formatCurrency(state.results.breakdown.finalExpenses)}</BreakdownValue>
          <BreakdownDescription>
            This covers funeral and end-of-life expenses.
          </BreakdownDescription>
        </BreakdownRow>
        
        {state.results.breakdown.additional > 0 && (
          <BreakdownRow>
            <BreakdownLabel>Additional Needs:</BreakdownLabel>
            <BreakdownValue>{formatCurrency(state.results.breakdown.additional)}</BreakdownValue>
            <BreakdownDescription>
              This covers other financial needs you specified.
            </BreakdownDescription>
          </BreakdownRow>
        )}
        
        <TotalRow>
          <BreakdownLabel>Total Coverage Needed:</BreakdownLabel>
          <BreakdownValue>{formatCurrency(state.results.recommendedCoverage)}</BreakdownValue>
        </TotalRow>
      </BreakdownContainer>

      <RecommendationNote>
        <strong>Note:</strong> This is an estimate based on the information you provided. 
        For a more personalized recommendation, please consult with a licensed insurance professional.
      </RecommendationNote>

      <NextStepsContainer>
        <NextStepsTitle>Next Steps</NextStepsTitle>
        <NextStepsDescription>
          Now that you know how much life insurance you need, you can:
        </NextStepsDescription>
        
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
      </NextStepsContainer>
    </ResultsContainer>
  );
};

const ResultsContainer = styled.div`
  max-width: 800px;
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

const RecommendationContainer = styled.div`
  background-color: ${props => props.theme.colors.primary};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 2rem;
  text-align: center;
  color: white;
`;

const RecommendedAmount = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const RecommendationSubtitle = styled.div`
  font-size: 1.1rem;
`;

const BreakdownContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const BreakdownTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.primary};
`;

const BreakdownRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const BreakdownLabel = styled.div`
  font-weight: 600;
`;

const BreakdownValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const BreakdownDescription = styled.div`
  color: ${props => props.theme.colors.darkGray};
  font-size: 0.9rem;
`;

const TotalRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem 0 0.5rem;
  margin-top: 0.5rem;
  border-top: 2px solid ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const RecommendationNote = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const NextStepsContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const NextStepsTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const NextStepsDescription = styled.p`
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  h2 {
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${props => props.theme.colors.lightGray};
  border-top: 5px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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