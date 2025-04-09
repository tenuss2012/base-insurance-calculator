import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const WelcomeStep = ({ onContinue }) => {
  return (
    <WelcomeContainer>
      <Title>Calculate Your Life Insurance Needs</Title>
      <Description>
        Use our calculator to determine how much life insurance coverage you need to protect 
        your family's financial future.
      </Description>
      
      <InfoBox>
        <strong>What you'll need:</strong>
        <ul>
          <li>Information about your income and assets</li>
          <li>Household details and family obligations</li>
          <li>Details about your mortgage or rent</li>
          <li>Educational expenses (current and future)</li>
          <li>Estimated retirement and long-term goals</li>
        </ul>
      </InfoBox>
      
      <ButtonContainer>
        <Button variant="primary" onClick={onContinue}>
          Calculate My Needs
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

const InfoBox = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: left;
  margin-bottom: 2rem;
  
  ul {
    margin-top: 0.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

export default WelcomeStep; 