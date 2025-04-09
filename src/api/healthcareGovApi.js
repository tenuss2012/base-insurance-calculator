/**
 * Healthcare.gov API Integration
 * 
 * This file would contain the actual integration with Healthcare.gov's API
 * Currently using mock data, but structured for easy replacement with real API calls
 */

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://marketplace.api.healthcare.gov/api/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    // In a real implementation, you'd include authentication headers
    // 'Authorization': `Bearer ${API_KEY}`,
  }
};

// Utility function for API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    console.log(`Making ${method} request to: ${url}`);
    
    const options = {
      method,
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw new Error(`Healthcare.gov API Error: ${error.message}`);
  }
};

// API Endpoints

/**
 * Get insurance plans by ZIP code
 * @param {string} zipCode - 5-digit ZIP code
 * @param {number} year - Plan year (e.g., 2023)
 * @returns {Promise<Array>} - Array of available plans
 */
export const getPlans = async (zipCode, year = new Date().getFullYear() + 1) => {
  // In a real implementation, this would call the Healthcare.gov API
  // Example: return apiRequest(`/plans?zipcode=${zipCode}&year=${year}`);
  
  console.log(`Getting plans for ZIP code ${zipCode} for year ${year}`);
  
  // Mock data
  return mockGetPlans(zipCode);
};

/**
 * Calculate premium Insurance credits (subsidies)
 * @param {Object} params - Calculation parameters
 * @param {number} params.income - Annual household income
 * @param {number} params.householdSize - Number of people in household
 * @param {string} params.zipCode - 5-digit ZIP code
 * @param {Array} params.applicants - Array of applicant objects with age and tobacco usage
 * @returns {Promise<Object>} - Subsidy information
 */
export const calculateSubsidy = async ({ income, householdSize, zipCode, applicants }) => {
  // In a real implementation, this would call the Healthcare.gov API
  // Example endpoint: /calculate/subsidies
  
  console.log('Calculating subsidy with parameters:', { income, householdSize, zipCode });
  
  // Mock data
  return mockCalculateSubsidy(income, householdSize, applicants);
};

/**
 * Get household FPL (Federal Poverty Level) information
 * @param {number} householdSize - Number of people in household
 * @param {string} state - Two-letter state code
 * @returns {Promise<Object>} - FPL information
 */
export const getFPLInfo = async (householdSize, state) => {
  // In a real implementation, this would call the Healthcare.gov API
  // Example: return apiRequest(`/fpl?household_size=${householdSize}&state=${state}`);
  
  console.log(`Getting FPL info for household size ${householdSize} in state ${state}`);
  
  // Mock data
  return mockGetFPLInfo(householdSize, state);
};

// Mock implementations (would be replaced with real API calls)

const mockGetPlans = (zipCode) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample plans with different tiers
      const plans = [
        {
          id: 'bronze-1',
          name: 'Bronze Plan',
          tier: 'Bronze',
          carrier: 'HealthCo Insurance',
          premium: 400,
          deductible: 8700,
          outOfPocketMax: 8700,
          coinsurance: 0.5,
          primaryCareCopay: 50,
          specialistCopay: 100,
          genericDrugCopay: 25,
          isHSAEligible: true,
        },
        {
          id: 'silver-1',
          name: 'Silver Plan',
          tier: 'Silver',
          carrier: 'HealthCo Insurance',
          premium: 625,
          deductible: 3500,
          outOfPocketMax: 8700,
          coinsurance: 0.3,
          primaryCareCopay: 30,
          specialistCopay: 60,
          genericDrugCopay: 15,
          isHSAEligible: false,
        },
        {
          id: 'gold-1',
          name: 'Gold Plan',
          tier: 'Gold',
          carrier: 'HealthCo Insurance',
          premium: 775,
          deductible: 1500,
          outOfPocketMax: 7000,
          coinsurance: 0.2,
          primaryCareCopay: 20,
          specialistCopay: 40,
          genericDrugCopay: 10,
          isHSAEligible: false,
        },
        {
          id: 'platinum-1',
          name: 'Platinum Plan',
          tier: 'Platinum',
          carrier: 'HealthCo Insurance',
          premium: 950,
          deductible: 0,
          outOfPocketMax: 4000,
          coinsurance: 0.1,
          primaryCareCopay: 10,
          specialistCopay: 20,
          genericDrugCopay: 5,
          isHSAEligible: false,
        },
        // Add variations with different carriers
        {
          id: 'bronze-2',
          name: 'Bronze Value Plan',
          tier: 'Bronze',
          carrier: 'Blue Health',
          premium: 380,
          deductible: 8900,
          outOfPocketMax: 8900,
          coinsurance: 0.5,
          primaryCareCopay: 45,
          specialistCopay: 95,
          genericDrugCopay: 20,
          isHSAEligible: true,
        },
        {
          id: 'silver-2',
          name: 'Silver Plus Plan',
          tier: 'Silver',
          carrier: 'National Health',
          premium: 650,
          deductible: 3000,
          outOfPocketMax: 8500,
          coinsurance: 0.25,
          primaryCareCopay: 25,
          specialistCopay: 55,
          genericDrugCopay: 10,
          isHSAEligible: false,
        },
      ];
      
      resolve(plans);
    }, 1200); // Simulate network delay
  });
};

const mockCalculateSubsidy = (income, householdSize, applicants) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simplified subsidy calculation
      if (!income || income <= 0) {
        resolve({ subsidy: 0, eligible: false });
        return;
      }
      
      // Calculate FPL percentage
      const fpl = getFPLValue(householdSize);
      const fplPercentage = (income / fpl) * 100;
      
      let subsidy = 0;
      let eligible = false;
      
      // Subsidy based on FPL percentage
      if (fplPercentage <= 150) {
        subsidy = 350;
        eligible = true;
      } else if (fplPercentage <= 200) {
        subsidy = 300;
        eligible = true;
      } else if (fplPercentage <= 250) {
        subsidy = 250;
        eligible = true;
      } else if (fplPercentage <= 300) {
        subsidy = 200;
        eligible = true;
      } else if (fplPercentage <= 400) {
        subsidy = 150;
        eligible = true;
      } else {
        // 2022 ACA change: removed the 400% FPL cap
        // Calculate subsidy based on limiting premium to 8.5% of income
        const maxPremium = income * 0.085 / 12; // 8.5% of income, monthly
        const benchmarkPremium = 625; // Silver plan monthly premium
        
        if (benchmarkPremium > maxPremium) {
          subsidy = benchmarkPremium - maxPremium;
          eligible = true;
        }
      }
      
      // Age adjustment - slightly higher for older individuals
      const oldestAge = Math.max(...applicants.map(a => parseInt(a.age) || 0));
      if (oldestAge > 50) {
        subsidy += 25;
      }
      
      resolve({ 
        subsidy: Math.round(subsidy),
        eligible,
        fplPercentage: Math.round(fplPercentage),
        annualSubsidy: Math.round(subsidy * 12),
      });
    }, 800); // Simulate network delay
  });
};

const mockGetFPLInfo = (householdSize, state) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fpl = getFPLValue(householdSize);
      
      resolve({
        fpl,
        fpl150: fpl * 1.5,
        fpl200: fpl * 2.0,
        fpl250: fpl * 2.5,
        fpl300: fpl * 3.0,
        fpl400: fpl * 4.0,
      });
    }, 500);
  });
};

// Helper function to get FPL (Federal Poverty Level) values
// These would be fetched from the API in a real implementation
const getFPLValue = (householdSize) => {
  // 2023 FPL values for 48 contiguous states and DC
  const baseFPL = 14580; // For a household of 1
  const additionalPersonAmount = 5140;
  
  if (householdSize <= 0) return 0;
  if (householdSize === 1) return baseFPL;
  
  return baseFPL + ((householdSize - 1) * additionalPersonAmount);
};

export default {
  getPlans,
  calculateSubsidy,
  getFPLInfo,
}; 