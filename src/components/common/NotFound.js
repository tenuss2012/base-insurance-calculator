import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <Title>Page Not Found</Title>
        <Description>
          We couldn't find the page you were looking for. The page may have been moved or doesn't exist.
        </Description>
        <StyledLink to="/">
          <Button variant="primary">Return to Calculator</Button>
        </StyledLink>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 600px;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 2rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default NotFound; 