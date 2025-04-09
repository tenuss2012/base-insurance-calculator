import React, { useState } from 'react';
import styled from 'styled-components';
import { useCalculator } from '../../context/CalculatorContext';

const FamilyStep = () => {
  const { state, setFamily } = useCalculator();
  const [tempDependent, setTempDependent] = useState({ 
    name: '', 
    relation: 'Child',
    age: '',
    college: false 
  });

  const handleAddDependent = () => {
    if (tempDependent.name.trim() && tempDependent.age.trim()) {
      const updatedDependents = [...state.family.dependents, { ...tempDependent, id: Date.now() }];
      setFamily({ dependents: updatedDependents });
      setTempDependent({ name: '', relation: 'Child', age: '', college: false });
    }
  };

  const handleRemoveDependent = (id) => {
    const updatedDependents = state.family.dependents.filter(d => d.id !== id);
    setFamily({ dependents: updatedDependents });
  };

  const handleSpouseChange = (value) => {
    setFamily({ hasSpouse: value });
  };

  const handleTempDependentChange = (field, value) => {
    setTempDependent({ ...tempDependent, [field]: value });
  };

  return (
    <Container>
      <Title>Family Information</Title>
      <Description>
        Tell us about your family situation to help calculate the right amount of life insurance coverage.
      </Description>

      <FormGroup>
        <Label>Do you have a spouse or partner?</Label>
        <RadioGroup>
          <RadioOption>
            <input
              type="radio"
              id="spouseYes"
              name="hasSpouse"
              checked={state.family.hasSpouse === true}
              onChange={() => handleSpouseChange(true)}
            />
            <label htmlFor="spouseYes">Yes</label>
          </RadioOption>
          <RadioOption>
            <input
              type="radio"
              id="spouseNo"
              name="hasSpouse"
              checked={state.family.hasSpouse === false}
              onChange={() => handleSpouseChange(false)}
            />
            <label htmlFor="spouseNo">No</label>
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      <Divider />

      <FormGroup>
        <Label>Dependents</Label>
        <Description style={{ marginBottom: '1rem' }}>
          Add children or other dependents that rely on your financial support.
        </Description>

        {state.family.dependents.length > 0 && (
          <DependentsList>
            {state.family.dependents.map(dependent => (
              <DependentItem key={dependent.id}>
                <DependentInfo>
                  <strong>{dependent.name}</strong>
                  <div>
                    {dependent.relation}, Age: {dependent.age}
                    {dependent.college && <span> (College plans)</span>}
                  </div>
                </DependentInfo>
                <RemoveButton onClick={() => handleRemoveDependent(dependent.id)}>
                  ✕
                </RemoveButton>
              </DependentItem>
            ))}
          </DependentsList>
        )}

        <SubTitle>Add Dependent</SubTitle>
        <DependentForm>
          <DependentInput
            type="text"
            placeholder="Name"
            value={tempDependent.name}
            onChange={(e) => handleTempDependentChange('name', e.target.value)}
          />
          <DependentSelect
            value={tempDependent.relation}
            onChange={(e) => handleTempDependentChange('relation', e.target.value)}
          >
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Other">Other</option>
          </DependentSelect>
          <DependentInput
            type="number"
            placeholder="Age"
            value={tempDependent.age}
            onChange={(e) => handleTempDependentChange('age', e.target.value)}
          />
          <CheckboxContainer>
            <input
              type="checkbox"
              id="college"
              checked={tempDependent.college}
              onChange={(e) => handleTempDependentChange('college', e.target.checked)}
            />
            <label htmlFor="college">College Plans</label>
          </CheckboxContainer>
          <AddButton onClick={handleAddDependent}>Add</AddButton>
        </DependentForm>
      </FormGroup>

      <InfoBox>
        <strong>Tip:</strong> If you have dependents planning to attend college, you might need additional coverage to help with tuition and expenses.
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

const SubTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${props => props.theme.colors.gray};
  margin: 1.5rem 0;
`;

const DependentsList = styled.div`
  margin-bottom: 1.5rem;
`;

const DependentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 0.5rem;
`;

const DependentInfo = styled.div`
  flex: 1;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.darkGray};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const DependentForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const DependentInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DependentSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  grid-column: 2;
  justify-self: end;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const InfoBox = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-top: 1rem;
  font-size: 0.9rem;
`;

export default FamilyStep; 