import React from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';

const IncomeStep = () => {
  const { state, setIncome } = useCalculator();

  const handleIncomeChange = (e) => {
    const value = e.target.value;
    // Allow only numbers, commas, and periods
    if (/^[0-9,]*$/.test(value) || value === '') {
      setIncome({ annualIncome: value });
    }
  };

  const handleEmployerCoverageChange = (hasEmployerCoverage) => {
    setIncome({ 
      employerCoverage: hasEmployerCoverage,
      employerCoverageAffordable: hasEmployerCoverage ? state.income.employerCoverageAffordable : null 
    });
  };

  const handleAffordableChange = (isAffordable) => {
    setIncome({ employerCoverageAffordable: isAffordable });
  };

  const formatIncomeDisplay = (income) => {
    if (!income) return '';
    
    // Remove commas first
    const number = income.replace(/,/g, '');
    
    // Format with commas for thousands
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <IncomeContainer>
      <Title>Financial Information</Title>
      <Description>
        This helps determine your eligibility for premium Insurance credits and other savings.
      </Description>

      <FormGroup>
        <Label htmlFor="income">
          Estimated Annual Household Income for {new Date().getFullYear() + 1}
          <Tooltip title="Include income from all members of your Insurance household">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="income"
            value={formatIncomeDisplay(state.income.annualIncome)}
            onChange={handleIncomeChange}
            placeholder="Annual household income"
          />
        </InputWrapper>
      </FormGroup>
      
      <FormGroup>
        <Label>Does anyone in your household have access to health insurance through an employer?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              id="employer-yes"
              name="employer-coverage"
              checked={state.income.employerCoverage === true}
              onChange={() => handleEmployerCoverageChange(true)}
            />
            <RadioLabel htmlFor="employer-yes">Yes</RadioLabel>
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              id="employer-no"
              name="employer-coverage"
              checked={state.income.employerCoverage === false}
              onChange={() => handleEmployerCoverageChange(false)}
            />
            <RadioLabel htmlFor="employer-no">No</RadioLabel>
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {state.income.employerCoverage && (
        <FormGroup>
          <Label>Is the employer coverage considered affordable?</Label>
          <InfoBox>
            Employer coverage is considered affordable if the employee's share of the premium for the lowest-cost self-only coverage is less than 9.12% of household income.
          </InfoBox>
          <RadioGroup>
            <RadioOption>
              <RadioInput
                type="radio"
                id="affordable-yes"
                name="affordable-coverage"
                checked={state.income.employerCoverageAffordable === true}
                onChange={() => handleAffordableChange(true)}
              />
              <RadioLabel htmlFor="affordable-yes">Yes</RadioLabel>
            </RadioOption>
            <RadioOption>
              <RadioInput
                type="radio"
                id="affordable-no"
                name="affordable-coverage"
                checked={state.income.employerCoverageAffordable === false}
                onChange={() => handleAffordableChange(false)}
              />
              <RadioLabel htmlFor="affordable-no">No</RadioLabel>
            </RadioOption>
            <RadioOption>
              <RadioInput
                type="radio"
                id="affordable-unsure"
                name="affordable-coverage"
                checked={state.income.employerCoverageAffordable === null}
                onChange={() => handleAffordableChange(null)}
              />
              <RadioLabel htmlFor="affordable-unsure">Not Sure</RadioLabel>
            </RadioOption>
          </RadioGroup>
        </FormGroup>
      )}
      
      {state.income.employerCoverageAffordable === true && (
        <InfoAlert>
          <strong>Note:</strong> If you have access to affordable employer coverage, you typically won't qualify for premium Insurance credits for Marketplace coverage. However, you'll still see available plans in your area.
        </InfoAlert>
      )}
    </IncomeContainer>
  );
};

const IncomeContainer = styled.div`
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

const Tooltip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background-color: ${props => props.theme.colors.darkGray};
  color: white;
  font-size: 0.75rem;
  border-radius: 50%;
  cursor: help;
  position: relative;
  
  &:hover::after {
    content: attr(title);
    position: absolute;
    width: 200px;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${props => props.theme.colors.text};
    color: white;
    padding: 0.5rem;
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: 0.75rem;
    z-index: 10;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DollarSign = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2rem;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 127, 176, 0.2);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RadioInput = styled.input`
  margin: 0;
  cursor: pointer;
`;

const RadioLabel = styled.label`
  cursor: pointer;
`;

const InfoBox = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin: 0.5rem 0 1rem;
  font-size: 0.9rem;
`;

const InfoAlert = styled.div`
  background-color: #fff8e1;
  border-left: 4px solid ${props => props.theme.colors.highlight};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin: 1.5rem 0;
`;

export default IncomeStep; 