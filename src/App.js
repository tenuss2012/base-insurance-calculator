import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CalculatorProvider } from './context/CalculatorContext';
import { theme } from './styles/theme';
import CalculatorWizard from './components/CalculatorWizard';
import Results from './components/Results';
import NotFound from './components/common/NotFound';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CalculatorProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<CalculatorWizard />} />
              <Route path="/results" element={<Results />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CalculatorProvider>
    </ThemeProvider>
  );
}

export default App;