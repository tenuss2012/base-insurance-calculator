import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterContent>
          <Copyright>
            © {currentYear} Base Insurance. All rights reserved.
          </Copyright>
          <FooterLinks>
            <FooterLink href="https://baseinsurance.com/privacy" target="_blank">
              Privacy Policy
            </FooterLink>
            <FooterLink href="https://baseinsurance.com/terms" target="_blank">
              Terms of Service
            </FooterLink>
            <FooterLink href="https://baseinsurance.com/contact" target="_blank">
              Contact Us
            </FooterLink>
          </FooterLinks>
        </FooterContent>
        <Disclaimer>
          This calculator is for informational purposes only. The results shown are estimates and not a guarantee of subsidy eligibility or insurance costs. Please consult with a licensed insurance agent for personalized advice.
        </Disclaimer>
      </FooterContainer>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  background-color: ${props => props.theme.colors.white};
  border-top: 1px solid ${props => props.theme.colors.lightGray};
  margin-top: 2rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1.5rem 1rem;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Copyright = styled.p`
  color: ${props => props.theme.colors.darkGray};
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const FooterLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Disclaimer = styled.p`
  color: ${props => props.theme.colors.darkGray};
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.5;
`;

export default Footer; 