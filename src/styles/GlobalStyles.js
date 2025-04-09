import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${props => props.theme.fonts.main};
    background-color: ${props => props.theme.colors.lightGray};
    color: ${props => props.theme.colors.text};
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    cursor: pointer;
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
`;

export default GlobalStyles; 