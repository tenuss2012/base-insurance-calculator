import React from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';

const NeedsStep = () => {
  const { state, setNeeds } = useCalculator();

  const handleIncomeYearsChange = (years) => {
    setNeeds({ incomeYears: years });
  };

  const handleFinalExpensesChange = (e) => {
    // Allow only numbers, commas, and periods
    const value = e.target.value;
    if (/^[0-9,]*$/.test(value) || value === '') {
      setNeeds({ finalExpenses: value });
    }
  };

  const handleAdditionalNeedsChange = (e) => {
    // Allow only numbers, commas, and periods
    const value = e.target.value;
    if (/^[0-9,]*$/.test(value) || value === '') {
      setNeeds({ additionalNeeds: value });
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    
    // Remove commas first
    const number = value.replace(/,/g, '');
    
    // Format with commas for thousands
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Container>
      <Title>Additional Needs</Title>
      <Description>
        Let's fine-tune your life insurance needs calculation with a few more details about your specific situation.
      </Description>

      <FormGroup>
        <Label>How many years of income would you like to replace?</Label>
        <YearsOptions>
          <YearOption 
            selected={state.needs.incomeYears === 5}
            onClick={() => handleIncomeYearsChange(5)}
          >
            5 Years
          </YearOption>
          <YearOption 
            selected={state.needs.incomeYears === 10}
            onClick={() => handleIncomeYearsChange(10)}
          >
            10 Years
          </YearOption>
          <YearOption 
            selected={state.needs.incomeYears === 15}
            onClick={() => handleIncomeYearsChange(15)}
          >
            15 Years
          </YearOption>
          <YearOption 
            selected={state.needs.incomeYears === 20}
            onClick={() => handleIncomeYearsChange(20)}
          >
            20 Years
          </YearOption>
        </YearsOptions>
        <Tip>
          A longer income replacement period provides more financial security for your dependents.
        </Tip>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="finalExpenses">
          Final Expenses
          <Tooltip title="Funeral costs and other end-of-life expenses">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="finalExpenses"
            value={formatCurrency(state.needs.finalExpenses.toString())}
            onChange={handleFinalExpensesChange}
            placeholder="Final expenses budget"
          />
        </InputWrapper>
        <Tip>
          The average funeral in the US costs between $7,000 and $15,000.
        </Tip>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="additionalNeeds">
          Additional Needs
          <Tooltip title="Any other expenses or financial needs not covered in previous sections">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="additionalNeeds"
            value={formatCurrency(state.needs.additionalNeeds)}
            onChange={handleAdditionalNeedsChange}
            placeholder="Any additional financial needs"
          />
        </InputWrapper>
      </FormGroup>

      <InfoBox>
        <strong>Tip:</strong> Consider including funds for large future expenses like a home renovation, 
        care for aging parents, or a wedding fund for children.
      </InfoBox>
    </Container>
  );
};

const Container = styled.div`
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
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
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

const YearsOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
`;

const YearOption = styled.div`
  padding: 0.75rem 0;
  text-align: center;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.selected ? 'rgba(5, 127, 176, 0.05)' : 'white'};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Tip = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.darkGray};
  margin-top: 0.5rem;
`;

const InfoBox = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-top: 1rem;
  font-size: 0.9rem;
`;

export default NeedsStep; 