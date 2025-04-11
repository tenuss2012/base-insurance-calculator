/**
 * Base Insurance Health Calculator - Main Application
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if all required functions are available
    if (typeof renderCurrentStep === 'function') {
        // Initialize the calculator
        renderCurrentStep();
        
        // Add CSS class for some extra styling
        document.body.classList.add('calculator-loaded');
    } else {
        console.error('Calculator initialization failed: required functions not found');
    }
}); 