import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCalculator } from '../context/CalculatorContext';
import StepIndicator from './common/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import LocationStep from './steps/LocationStep';
import FamilyStep from './steps/FamilyStep';
import FinancialStep from './steps/FinancialStep';
import NeedsStep from './steps/NeedsStep';
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
        return <FamilyStep />;
      case 4:
        return <FinancialStep />;
      case 5:
        return <NeedsStep />;
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
            state.step > 1 && (
              <Button variant="primary" onClick={nextStep}>
                Continue
              </Button>
            )
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