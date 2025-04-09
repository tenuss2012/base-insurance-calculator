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