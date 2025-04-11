/**
 * Browser-compatible wrapper for zipcodes.js
 * Converts the Node.js module to a browser-friendly format
 */

// Create the global _ZIPCODES variable
window._ZIPCODES = {
  // The data from zipcodes.js will be structured as:
  // "STATE": ["ZIP1", "ZIP2", "ZIP3", ...],
  // Example: "CA": ["90001", "90002", ...]
};

// Load the actual zipcodes.js data
fetch('zipcodes.js')
  .then(response => response.text())
  .then(text => {
    // Extract the data by parsing the content
    try {
      // Remove the module.exports part and any Node.js specific code
      let jsContent = text.replace(/module\.exports\s*=\s*/, 'window._ZIPCODES = ');
      
      // Create a script element with the modified content
      const script = document.createElement('script');
      script.textContent = jsContent;
      document.head.appendChild(script);
      
      console.log('Zipcodes data loaded successfully');
      
      // Dispatch an event to notify that zipcodes are loaded
      window.dispatchEvent(new CustomEvent('zipcodesLoaded'));
    } catch (error) {
      console.error('Error parsing zipcodes data:', error);
    }
  })
  .catch(error => {
    console.error('Error loading zipcodes.js:', error);
  }); 