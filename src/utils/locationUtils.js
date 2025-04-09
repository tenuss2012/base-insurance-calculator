// Validates that a string is a 5-digit US ZIP code
export const validateZipCode = (zipCode) => {
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zipCode);
};

// Function to fetch state and county from a ZIP code
// In a real implementation, this would call an API or service
export const fetchLocationData = async (zipCode) => {
  // Simulating API call with sample data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // More comprehensive ZIP code sample data mapping
      const zipData = {
        // Texas
        '75001': { state: 'TX', county: 'Dallas County' },
        '75002': { state: 'TX', county: 'Collin County' },
        '75006': { state: 'TX', county: 'Dallas County' },
        '75007': { state: 'TX', county: 'Denton County' },
        '77001': { state: 'TX', county: 'Harris County' },
        '77002': { state: 'TX', county: 'Harris County' },
        '78701': { state: 'TX', county: 'Travis County' },
        '78704': { state: 'TX', county: 'Travis County' },
        '79901': { state: 'TX', county: 'El Paso County' },
        // New York
        '10001': { state: 'NY', county: 'New York County' },
        '10002': { state: 'NY', county: 'New York County' },
        '10003': { state: 'NY', county: 'New York County' },
        '11201': { state: 'NY', county: 'Kings County' },
        '14201': { state: 'NY', county: 'Erie County' },
        // California
        '90001': { state: 'CA', county: 'Los Angeles County' },
        '90210': { state: 'CA', county: 'Los Angeles County' },
        '94016': { state: 'CA', county: 'San Francisco County' },
        '95814': { state: 'CA', county: 'Sacramento County' },
        // Florida
        '33101': { state: 'FL', county: 'Miami-Dade County' },
        '33602': { state: 'FL', county: 'Hillsborough County' },
        '32801': { state: 'FL', county: 'Orange County' },
        // Illinois
        '60601': { state: 'IL', county: 'Cook County' },
        '60605': { state: 'IL', county: 'Cook County' },
        '62701': { state: 'IL', county: 'Sangamon County' },
      };
      
      if (zipData[zipCode]) {
        resolve(zipData[zipCode]);
      } else {
        // For any ZIP not in our database, generate more specific data
        const firstDigit = parseInt(zipCode.charAt(0));
        
        // Map the first digit to states and more specific counties
        let state, county;
        switch(firstDigit) {
          case 0:
            state = 'MA';
            county = 'Suffolk County';
            break;
          case 1:
            state = 'NY';
            county = 'Albany County';
            break;
          case 2:
            state = 'VA';
            county = 'Fairfax County';
            break;
          case 3:
            state = 'FL';
            county = 'Broward County';
            break;
          case 4:
            state = 'GA';
            county = 'Fulton County';
            break;
          case 5:
            state = 'MI';
            county = 'Wayne County';
            break;
          case 6:
            state = 'IL';
            county = 'DuPage County';
            break;
          case 7:
            state = 'TX';
            county = `${zipCode.substring(1, 3)} County`;
            break;
          case 8:
            state = 'CO';
            county = 'Denver County';
            break;
          case 9:
            state = 'CA';
            county = 'Orange County';
            break;
          default:
            state = 'Unknown';
            county = 'Unknown County';
        }
        
        resolve({ state, county });
      }
    }, 500); // Simulated delay
  });
}; 