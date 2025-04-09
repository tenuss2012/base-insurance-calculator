import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo to="/">
          <LogoText>Base<LogoHighlight>Insurance</LogoHighlight></LogoText>
          <LogoSubtext>Insurance Calculator</LogoSubtext>
        </Logo>
        <Navigation>
          <NavLink href="https://baseinsurance.com/about" target="_blank">About</NavLink>
          <NavLink href="https://baseinsurance.com/contact" target="_blank">Contact</NavLink>
        </Navigation>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.small};
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
`;

const LogoText = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.2;
`;

const LogoHighlight = styled.span`
  color: ${props => props.theme.colors.highlight};
`;

const LogoSubtext = styled.span`
  color: ${props => props.theme.colors.darkGray};
  font-size: 0.875rem;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.theme.colors.accent};
    text-decoration: underline;
  }
`;

export default Header; 