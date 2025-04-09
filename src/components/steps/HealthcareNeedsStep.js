import React from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';

const HealthcareNeedsStep = () => {
  const { state, setHealthcareNeeds } = useCalculator();
  
  const handleUsageLevelChange = (level) => {
    setHealthcareNeeds({ usageLevel: level });
  };
  
  const handleConcernToggle = (concern) => {
    const currentConcerns = [...state.healthcareNeeds.concerns];
    const index = currentConcerns.indexOf(concern);
    
    if (index === -1) {
      // Add concern if not already selected
      setHealthcareNeeds({ concerns: [...currentConcerns, concern] });
    } else {
      // Remove concern if already selected
      currentConcerns.splice(index, 1);
      setHealthcareNeeds({ concerns: currentConcerns });
    }
  };
  
  const isConcernSelected = (concern) => {
    return state.healthcareNeeds.concerns.includes(concern);
  };

  return (
    <NeedsContainer>
      <Title>Healthcare Usage</Title>
      <Description>
        Help us understand your healthcare needs to recommend the right coverage level.
      </Description>
      
      <FormGroup>
        <Label>How would you describe your expected healthcare usage?</Label>
        <UsageOptions>
          <UsageOption 
            selected={state.healthcareNeeds.usageLevel === 'low'}
            onClick={() => handleUsageLevelChange('low')}
          >
            <OptionTitle>Low</OptionTitle>
            <OptionDescription>
              Rarely visit doctors, no chronic conditions, few or no prescriptions
            </OptionDescription>
          </UsageOption>
          
          <UsageOption 
            selected={state.healthcareNeeds.usageLevel === 'medium'}
            onClick={() => handleUsageLevelChange('medium')}
          >
            <OptionTitle>Medium</OptionTitle>
            <OptionDescription>
              Regular check-ups, occasional specialist visits, some prescriptions
            </OptionDescription>
          </UsageOption>
          
          <UsageOption 
            selected={state.healthcareNeeds.usageLevel === 'high'}
            onClick={() => handleUsageLevelChange('high')}
          >
            <OptionTitle>High</OptionTitle>
            <OptionDescription>
              Frequent doctor visits, ongoing care for conditions, multiple prescriptions
            </OptionDescription>
          </UsageOption>
        </UsageOptions>
      </FormGroup>
      
      <FormGroup>
        <Label>Do you have specific healthcare concerns?</Label>
        <Description>
          Select all that apply to help us find plans that best meet your needs.
        </Description>
        
        <ConcernsGrid>
          <ConcernOption 
            selected={isConcernSelected('primary-care')}
            onClick={() => handleConcernToggle('primary-care')}
          >
            <ConcernLabel>Regular primary care visits</ConcernLabel>
          </ConcernOption>
          
          <ConcernOption
            selected={isConcernSelected('specialist-care')}
            onClick={() => handleConcernToggle('specialist-care')}
          >
            <ConcernLabel>Specialist care</ConcernLabel>
          </ConcernOption>
          
          <ConcernOption
            selected={isConcernSelected('prescriptions')}
            onClick={() => handleConcernToggle('prescriptions')}
          >
            <ConcernLabel>Prescription medications</ConcernLabel>
          </ConcernOption>
          
          <ConcernOption
            selected={isConcernSelected('mental-health')}
            onClick={() => handleConcernToggle('mental-health')}
          >
            <ConcernLabel>Mental health services</ConcernLabel>
          </ConcernOption>
          
          <ConcernOption
            selected={isConcernSelected('planned-procedures')}
            onClick={() => handleConcernToggle('planned-procedures')}
          >
            <ConcernLabel>Planned procedures/surgeries</ConcernLabel>
          </ConcernOption>
          
          <ConcernOption
            selected={isConcernSelected('maternity')}
            onClick={() => handleConcernToggle('maternity')}
          >
            <ConcernLabel>Maternity care</ConcernLabel>
          </ConcernOption>
          
          <ConcernOption
            selected={isConcernSelected('chronic-conditions')}
            onClick={() => handleConcernToggle('chronic-conditions')}
          >
            <ConcernLabel>Chronic condition management</ConcernLabel>
          </ConcernOption>
          
          <ConcernOption
            selected={isConcernSelected('emergency-care')}
            onClick={() => handleConcernToggle('emergency-care')}
          >
            <ConcernLabel>Emergency services</ConcernLabel>
          </ConcernOption>
        </ConcernsGrid>
      </FormGroup>
      
      {state.healthcareNeeds.usageLevel === 'high' && (
        <InfoAlert>
          With high expected usage, you may want to consider plans with lower deductibles and copays, even if they have slightly higher monthly premiums.
        </InfoAlert>
      )}
    </NeedsContainer>
  );
};

const NeedsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem 0;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const UsageOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const UsageOption = styled.div`
  padding: 1.25rem;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.selected ? 'rgba(5, 127, 176, 0.05)' : 'white'};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.default};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const OptionTitle = styled.h4`
  margin: 0 0 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const OptionDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.darkGray};
`;

const ConcernsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ConcernOption = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.selected ? 'rgba(5, 127, 176, 0.05)' : 'white'};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ConcernLabel = styled.span`
  font-size: 0.95rem;
`;

const InfoAlert = styled.div`
  background-color: #e3f2fd;
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin: 1rem 0;
  font-size: 0.9rem;
`;

export default HealthcareNeedsStep; 