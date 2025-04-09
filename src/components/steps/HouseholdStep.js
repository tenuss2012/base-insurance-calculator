import React, { useState } from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';
import Button from '../common/Button';

const HouseholdStep = () => {
  const { state, setHousehold, addFamilyMember, removeFamilyMember } = useCalculator();
  const [newMember, setNewMember] = useState({
    type: 'dependent',
    age: '',
    tobaccoUse: false,
  });

  const handleCoverageTypeChange = (type) => {
    setHousehold({ coverageType: type });
  };

  const handlePrimaryAgeChange = (e) => {
    const primaryApplicant = { ...state.household.applicants[0], age: e.target.value };
    setHousehold({
      applicants: [primaryApplicant, ...state.household.applicants.slice(1)]
    });
  };

  const handlePrimaryTobaccoChange = (e) => {
    const primaryApplicant = { ...state.household.applicants[0], tobaccoUse: e.target.checked };
    setHousehold({
      applicants: [primaryApplicant, ...state.household.applicants.slice(1)]
    });
  };

  const handleNewMemberChange = (field, value) => {
    setNewMember({ ...newMember, [field]: value });
  };

  const handleAddMember = () => {
    if (newMember.age) {
      addFamilyMember(newMember);
      setNewMember({
        type: 'dependent',
        age: '',
        tobaccoUse: false,
      });
    }
  };

  return (
    <HouseholdContainer>
      <Title>Tell us about your household</Title>
      <Description>
        This helps us determine the right coverage options and potential subsidies.
      </Description>

      <FormGroup>
        <Label>Who needs coverage?</Label>
        <CoverageOptions>
          <CoverageOption 
            selected={state.household.coverageType === 'individual'}
            onClick={() => handleCoverageTypeChange('individual')}
          >
            <OptionTitle>Just Me</OptionTitle>
            <OptionDescription>Coverage for one person</OptionDescription>
          </CoverageOption>
          
          <CoverageOption 
            selected={state.household.coverageType === 'family'}
            onClick={() => handleCoverageTypeChange('family')}
          >
            <OptionTitle>My Family</OptionTitle>
            <OptionDescription>Coverage for multiple people</OptionDescription>
          </CoverageOption>
        </CoverageOptions>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="primaryAge">Your Age</Label>
        <Input
          type="number"
          id="primaryAge"
          value={state.household.applicants[0].age}
          onChange={handlePrimaryAgeChange}
          min="0"
          max="120"
          placeholder="Enter your age"
        />
      </FormGroup>

      <FormGroup>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={state.household.applicants[0].tobaccoUse}
            onChange={handlePrimaryTobaccoChange}
          />
          <span>Tobacco use in the last 6 months</span>
        </CheckboxLabel>
      </FormGroup>

      {state.household.coverageType === 'family' && (
        <>
          <SectionTitle>Family Members</SectionTitle>
          
          {state.household.applicants.length > 1 && (
            <FamilyMembersList>
              {state.household.applicants.slice(1).map((member, index) => (
                <FamilyMemberCard key={index}>
                  <FamilyMemberHeader>
                    <MemberType>{member.type}</MemberType>
                    <RemoveButton onClick={() => removeFamilyMember(index + 1)}>
                      Remove
                    </RemoveButton>
                  </FamilyMemberHeader>
                  <MemberDetails>
                    <span>Age: {member.age}</span>
                    <span>Tobacco Use: {member.tobaccoUse ? 'Yes' : 'No'}</span>
                  </MemberDetails>
                </FamilyMemberCard>
              ))}
            </FamilyMembersList>
          )}

          <FormGroup>
            <Label>Add Family Member</Label>
            <AddMemberForm>
              <FormRow>
                <FormColumn>
                  <Label htmlFor="memberType">Relationship</Label>
                  <Select
                    id="memberType"
                    value={newMember.type}
                    onChange={(e) => handleNewMemberChange('type', e.target.value)}
                  >
                    <option value="spouse">Spouse</option>
                    <option value="dependent">Child/Dependent</option>
                  </Select>
                </FormColumn>
                <FormColumn>
                  <Label htmlFor="memberAge">Age</Label>
                  <Input
                    type="number"
                    id="memberAge"
                    value={newMember.age}
                    onChange={(e) => handleNewMemberChange('age', e.target.value)}
                    min="0"
                    max="120"
                    placeholder="Age"
                  />
                </FormColumn>
              </FormRow>
              <FormRow>
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    checked={newMember.tobaccoUse}
                    onChange={(e) => handleNewMemberChange('tobaccoUse', e.target.checked)}
                  />
                  <span>Tobacco use in the last 6 months</span>
                </CheckboxLabel>
              </FormRow>
              <AddButton 
                variant="outline" 
                onClick={handleAddMember}
                disabled={!newMember.age}
              >
                + Add Family Member
              </AddButton>
            </AddMemberForm>
          </FormGroup>
        </>
      )}
    </HouseholdContainer>
  );
};

const HouseholdContainer = styled.div`
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

const SectionTitle = styled.h3`
  margin: 2rem 0 1rem;
  color: ${props => props.theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const CoverageOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const CoverageOption = styled.div`
  flex: 1;
  padding: 1.5rem;
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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 127, 176, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 127, 176, 0.2);
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

const FamilyMembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FamilyMemberCard = styled.div`
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  overflow: hidden;
`;

const FamilyMemberHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.lightGray};
`;

const MemberType = styled.span`
  font-weight: 600;
  text-transform: capitalize;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MemberDetails = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AddMemberForm = styled.div`
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  flex: 1;
`;

const AddButton = styled(Button)`
  width: auto;
  margin-top: 0.5rem;
`;

export default HouseholdStep; 