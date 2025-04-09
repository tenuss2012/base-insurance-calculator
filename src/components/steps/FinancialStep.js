import React from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';

const FinancialStep = () => {
  const { state, setFinancial } = useCalculator();

  const handleInputChange = (field, value) => {
    // Allow only numbers, commas, and periods
    if (/^[0-9,]*$/.test(value) || value === '') {
      setFinancial({ [field]: value });
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
      <Title>Financial Information</Title>
      <Description>
        This information helps us calculate how much life insurance coverage you may need 
        to protect your loved ones.
      </Description>

      <FormGroup>
        <Label htmlFor="annualIncome">
          Annual Income
          <Tooltip title="Your pre-tax annual salary, wages, and other income">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="annualIncome"
            value={formatCurrency(state.financial.annualIncome)}
            onChange={(e) => handleInputChange('annualIncome', e.target.value)}
            placeholder="Annual income before taxes"
          />
        </InputWrapper>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="mortgageBalance">
          Mortgage Balance
          <Tooltip title="The remaining balance on your home mortgage loan">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="mortgageBalance"
            value={formatCurrency(state.financial.mortgageBalance)}
            onChange={(e) => handleInputChange('mortgageBalance', e.target.value)}
            placeholder="Current mortgage balance"
          />
        </InputWrapper>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="totalDebt">
          Other Debt
          <Tooltip title="Credit cards, car loans, student loans, etc.">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="totalDebt"
            value={formatCurrency(state.financial.totalDebt)}
            onChange={(e) => handleInputChange('totalDebt', e.target.value)}
            placeholder="Total of other debts"
          />
        </InputWrapper>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="totalAssets">
          Total Assets
          <Tooltip title="Savings, investments, and other assets excluding your primary residence">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="totalAssets"
            value={formatCurrency(state.financial.totalAssets)}
            onChange={(e) => handleInputChange('totalAssets', e.target.value)}
            placeholder="Total value of assets"
          />
        </InputWrapper>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="retirementSavings">
          Retirement Savings
          <Tooltip title="401(k), IRA, and other retirement accounts">i</Tooltip>
        </Label>
        <InputWrapper>
          <DollarSign>$</DollarSign>
          <Input
            type="text"
            id="retirementSavings"
            value={formatCurrency(state.financial.retirementSavings)}
            onChange={(e) => handleInputChange('retirementSavings', e.target.value)}
            placeholder="Current retirement savings"
          />
        </InputWrapper>
      </FormGroup>
      
      <InfoBox>
        <strong>Tip:</strong> Life insurance can help cover income loss, pay off debts, and provide for future expenses your family might face.
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

const InfoBox = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-top: 1rem;
  font-size: 0.9rem;
`;

export default FinancialStep; 