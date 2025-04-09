import React, { useState } from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';
import { validateZipCode, fetchLocationData } from '../../utils/locationUtils';

const LocationStep = () => {
  const { state, setLocation, setPersonal } = useCalculator();
  const [error, setError] = useState(null);

  const handleZipChange = async (e) => {
    const zipCode = e.target.value;
    setLocation({ zipCode });
    
    if (zipCode.length === 5) {
      if (validateZipCode(zipCode)) {
        setError(null);
        try {
          // Fetch location data based on ZIP code
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

  const handleAgeChange = (e) => {
    setPersonal({ age: e.target.value });
  };

  const handleGenderChange = (gender) => {
    setPersonal({ gender });
  };

  const handleHealthStatusChange = (status) => {
    setPersonal({ healthStatus: status });
  };

  const handleSmokerChange = (e) => {
    setPersonal({ smoker: e.target.checked });
  };

  return (
    <LocationContainer>
      <Title>Personal Information</Title>
      <Description>
        Let's start with some basic information about you. This helps us provide 
        more accurate life insurance needs estimates.
      </Description>
      
      <FormGroup>
        <Label htmlFor="zipCode">
          ZIP Code
          <Tooltip title="Your location may affect insurance rates and coverage options">i</Tooltip>
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

      <FormGroup>
        <Label htmlFor="age">Your Age</Label>
        <Input
          type="number"
          id="age"
          value={state.personal.age}
          onChange={handleAgeChange}
          min="18"
          max="85"
          placeholder="Enter your age"
        />
      </FormGroup>

      <FormGroup>
        <Label>Gender</Label>
        <RadioGroup>
          <RadioOption 
            selected={state.personal.gender === 'male'}
            onClick={() => handleGenderChange('male')}
          >
            Male
          </RadioOption>
          <RadioOption 
            selected={state.personal.gender === 'female'}
            onClick={() => handleGenderChange('female')}
          >
            Female
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      <FormGroup>
        <Label>Health Status</Label>
        <RadioGroup>
          <RadioOption 
            selected={state.personal.healthStatus === 'excellent'}
            onClick={() => handleHealthStatusChange('excellent')}
          >
            Excellent
          </RadioOption>
          <RadioOption 
            selected={state.personal.healthStatus === 'average'}
            onClick={() => handleHealthStatusChange('average')}
          >
            Average
          </RadioOption>
          <RadioOption 
            selected={state.personal.healthStatus === 'poor'}
            onClick={() => handleHealthStatusChange('poor')}
          >
            Below Average
          </RadioOption>
        </RadioGroup>
      </FormGroup>
      
      <FormGroup>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={state.personal.smoker}
            onChange={handleSmokerChange}
          />
          <span>I use tobacco products</span>
        </CheckboxLabel>
      </FormGroup>
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
  margin-bottom: 1.5rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioOption = styled.div`
  flex: 1;
  padding: 0.75rem;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

export default LocationStep; 