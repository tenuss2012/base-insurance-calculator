import React from 'react';
import styled, { css } from 'styled-components';

const Button = ({ 
  variant = 'primary', 
  children, 
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...rest 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 600;
  font-size: 1rem;
  transition: all ${props => props.theme.transitions.default};
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  ${props => props.variant === 'primary' && css`
    background-color: ${props.theme.colors.highlight};
    color: ${props.theme.colors.text};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #e2ba32;
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.small};
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: ${props.theme.colors.darkGray};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #5a5a5a;
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.small};
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background-color: transparent;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: rgba(5, 127, 176, 0.1);
    }
  `}
  
  ${props => props.variant === 'text' && css`
    background-color: transparent;
    color: ${props.theme.colors.primary};
    border: none;
    padding: 0.5rem 1rem;
    
    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `}
`;

export default Button; 