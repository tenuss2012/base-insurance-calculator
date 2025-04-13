/**
 * Base Insurance Health Calculator - UI Rendering and Manipulation
 */

// DOM elements
const wizardContent = document.getElementById('wizardContent');
const wizardHeader = document.getElementById('wizardHeader');
const wizardFooter = document.getElementById('wizardFooter');
const resultsPage = document.getElementById('resultsPage');
const calculatorWizard = document.getElementById('calculatorWizard');

// Step definitions
const steps = [
    { id: 1, title: 'Welcome', component: renderWelcomeStep },
    { id: 2, title: 'Contact', component: renderContactStep },
    { id: 3, title: 'Location', component: renderLocationStep },
    { id: 4, title: 'Personal', component: renderPersonalStep },
    { id: 5, title: 'Financial', component: renderFinancialStep },
    { id: 6, title: 'Current Policy', component: renderCurrentPolicyStep },
    { id: 7, title: 'Needs', component: renderNeedsStep }
];

// Render step indicator
function renderStepIndicator(currentStep) {
    const totalSteps = steps.length;
    
    let stepsHtml = '<div class="step-indicator">';
    
    steps.forEach(step => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        let statusClass = '';
        
        if (isActive) statusClass = 'active';
        else if (isCompleted) statusClass = 'completed';
        
        stepsHtml += `
            <div class="step-item ${statusClass}">
                <div class="step-number">${step.id}</div>
                <div class="step-title">${step.title}</div>
            </div>
        `;
    });
    
    stepsHtml += '</div>';
    
    return stepsHtml;
}

// Render navigation buttons
function renderNavButtons(currentStep) {
    const totalSteps = steps.length;
    let buttonsHtml = '';
    
    if (currentStep > 1) {
        buttonsHtml += `<button class="btn btn-secondary" id="prevButton">Back</button>`;
    } else {
        buttonsHtml += `<div></div>`; // Empty div for spacing
    }
    
    if (currentStep < totalSteps) {
        if (currentStep > 1) {
            buttonsHtml += `<button class="btn btn-primary" id="nextButton">Continue</button>`;
        }
    } else {
        buttonsHtml += `<button class="btn btn-primary" id="calculateButton">Get Results</button>`;
    }
    
    return buttonsHtml;
}

// Render current step
function renderCurrentStep() {
    const currentStep = calculatorState.step;
    
    // Render step indicator if not on welcome step
    if (currentStep > 1) {
        wizardHeader.innerHTML = renderStepIndicator(currentStep);
    } else {
        wizardHeader.innerHTML = '';
    }
    
    // Render the step content
    const stepComponent = steps.find(step => step.id === currentStep)?.component;
    if (stepComponent) {
        wizardContent.innerHTML = stepComponent();
    }
    
    // Render navigation buttons
    wizardFooter.innerHTML = renderNavButtons(currentStep);
    
    // Add event listeners to buttons
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const calculateButton = document.getElementById('calculateButton');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            calculatorActions.prevStep();
            renderCurrentStep();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (validateCurrentStep()) {
                calculatorActions.nextStep();
                renderCurrentStep();
            }
        });
    }
    
    if (calculateButton) {
        calculateButton.addEventListener('click', () => {
            if (validateCurrentStep()) {
                calculatorActions.calculateResults();
                renderResultsPage();
            }
        });
    }
    
    // Add step-specific event listeners
    addStepEventListeners(currentStep);
}

// Step 1: Welcome Step
function renderWelcomeStep() {
    return `
        <div class="welcome-step">
            <h1>Life Insurance Calculator</h1>
            <p>Find out how much life insurance coverage you may need to protect your loved ones.</p>
            <div class="welcome-features">
                <div class="feature-item">
                    <h3>Quick & Easy</h3>
                    <p>Complete in just a few minutes</p>
                </div>
                <div class="feature-item">
                    <h3>Personalized</h3>
                    <p>Tailored to your specific situation</p>
                </div>
                <div class="feature-item">
                    <h3>No Obligation</h3>
                    <p>Free calculator with no commitment</p>
                </div>
            </div>
            <button class="btn btn-primary" id="startButton">Get Started</button>
        </div>
    `;
}

// Step 2: Contact Step
function renderContactStep() {
    return `
        <div class="contact-step">
            <h2>Your Contact Information</h2>
            <p>Please provide your contact details so we can share your results.</p>
            
            <div class="form-group">
                <label for="firstName">First Name *</label>
                <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    placeholder="Your first name"
                    value="${calculatorState.personal.firstName}"
                    required
                >
                <div class="error-message" id="firstNameError"></div>
            </div>
            
            <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Your last name"
                    value="${calculatorState.personal.lastName}"
                    required
                >
                <div class="error-message" id="lastNameError"></div>
            </div>
            
            <div class="form-group">
                <label for="email">Email Address *</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="your.email@example.com"
                    value="${calculatorState.personal.email}"
                    required
                >
                <div class="error-message" id="emailError"></div>
            </div>
            
            <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="(123) 456-7890"
                    value="${calculatorState.personal.phone}"
                    required
                >
                <div class="error-message" id="phoneError"></div>
            </div>
        </div>
    `;
}

// Step 3: Location Step
function renderLocationStep() {
    return `
        <div class="location-step">
            <h2>Where are you located?</h2>
            <p>Your location helps us provide accurate estimates for your area.</p>
            
            <div class="form-group">
                <label for="zipCode">ZIP Code</label>
                <input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode" 
                    maxlength="5" 
                    placeholder="Enter 5-digit ZIP code"
                    value="${calculatorState.location.zipCode}"
                >
                <div class="error-message" id="zipCodeError"></div>
            </div>
        </div>
    `;
}

// Step 4: Personal Step
function renderPersonalStep() {
    return `
        <div class="personal-step">
            <h2>Tell us about yourself</h2>
            <p>This information helps us calculate your insurance needs.</p>
            
            <div class="form-group">
                <label for="age">Your Age</label>
                <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    min="18" 
                    max="85" 
                    placeholder="Enter your age"
                    value="${calculatorState.personal.age}"
                >
                <div class="error-message" id="ageError"></div>
            </div>
            
            <div class="form-group">
                <label>Gender</label>
                <div class="radio-group">
                    <label class="radio-label">
                        <input 
                            type="radio" 
                            name="gender" 
                            value="male" 
                            ${calculatorState.personal.gender === 'male' ? 'checked' : ''}
                        > Male
                    </label>
                    <label class="radio-label">
                        <input 
                            type="radio" 
                            name="gender" 
                            value="female" 
                            ${calculatorState.personal.gender === 'female' ? 'checked' : ''}
                        > Female
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="checkbox-label">
                    <input 
                        type="checkbox" 
                        id="smoker" 
                        name="smoker"
                        ${calculatorState.personal.smoker ? 'checked' : ''}
                    > 
                    <span style="display: inline-block; vertical-align: middle;">I use tobacco products</span>
                </label>
            </div>
            
            <div class="form-group">
                <label for="healthStatus">Overall Health</label>
                <select id="healthStatus" name="healthStatus">
                    <option value="excellent" ${calculatorState.personal.healthStatus === 'excellent' ? 'selected' : ''}>Excellent</option>
                    <option value="good" ${calculatorState.personal.healthStatus === 'good' ? 'selected' : ''}>Good</option>
                    <option value="average" ${calculatorState.personal.healthStatus === 'average' ? 'selected' : ''}>Average</option>
                    <option value="fair" ${calculatorState.personal.healthStatus === 'fair' ? 'selected' : ''}>Fair</option>
                    <option value="poor" ${calculatorState.personal.healthStatus === 'poor' ? 'selected' : ''}>Poor</option>
                </select>
            </div>
        </div>
    `;
}

// Step 5: Financial Step
function renderFinancialStep() {
    return `
        <div class="financial-step">
            <h2>Financial Information</h2>
            <p>This information helps us calculate your insurance needs.</p>
            
            <div class="form-group">
                <label for="annualIncome">Annual Income</label>
                <input 
                    type="text" 
                    id="annualIncome" 
                    name="annualIncome" 
                    placeholder="$"
                    value="${calculatorState.financial.annualIncome}"
                >
                <div class="error-message" id="annualIncomeError"></div>
            </div>
            
            <div class="form-group">
                <label for="totalDebt">Total Debt (excluding mortgage)</label>
                <input 
                    type="text" 
                    id="totalDebt" 
                    name="totalDebt" 
                    placeholder="$"
                    value="${calculatorState.financial.totalDebt}"
                >
                <div class="error-message" id="totalDebtError"></div>
            </div>
            
            <div class="form-group">
                <label for="mortgageBalance">Mortgage Balance</label>
                <input 
                    type="text" 
                    id="mortgageBalance" 
                    name="mortgageBalance" 
                    placeholder="$"
                    value="${calculatorState.financial.mortgageBalance}"
                >
                <div class="error-message" id="mortgageBalanceError"></div>
            </div>
            
            <div class="form-group">
                <label for="educationFund">Education Fund Needed</label>
                <input 
                    type="text" 
                    id="educationFund" 
                    name="educationFund" 
                    placeholder="$"
                    value="${calculatorState.financial.educationFund}"
                >
                <div class="error-message" id="educationFundError"></div>
            </div>
        </div>
    `;
}

// Step 6: Current Policy Step
function renderCurrentPolicyStep() {
    return `
        <div class="current-policy-step">
            <h2>Current Insurance Coverage</h2>
            <p>Tell us about any existing life insurance policies you have.</p>
            
            <div class="form-group">
                <label class="checkbox-label">
                    <input 
                        type="checkbox" 
                        id="hasPolicy" 
                        name="hasPolicy"
                        ${calculatorState.currentPolicy.hasPolicy ? 'checked' : ''}
                    > 
                    <span style="display: inline-block; vertical-align: middle;">I already have a life insurance policy</span>
                </label>
            </div>
            
            <div id="policyDetailsSection" class="${calculatorState.currentPolicy.hasPolicy ? '' : 'hidden'}">
                <div class="form-group">
                    <label for="coverageAmount">Current Coverage Amount</label>
                    <input 
                        type="text" 
                        id="coverageAmount" 
                        name="coverageAmount" 
                        placeholder="$"
                        value="${calculatorState.currentPolicy.coverageAmount}"
                    >
                    <div class="error-message" id="coverageAmountError"></div>
                </div>
            </div>
        </div>
    `;
}

// Step 7: Needs Step
function renderNeedsStep() {
    return `
        <div class="needs-step">
            <h2>Additional Needs</h2>
            <p>Customize your insurance calculation with additional considerations.</p>
            
            <div class="form-group">
                <label for="incomeYears">Years of Income to Replace</label>
                <select id="incomeYears" name="incomeYears">
                    <option value="5" ${calculatorState.needs.incomeYears === 5 ? 'selected' : ''}>5 years</option>
                    <option value="10" ${calculatorState.needs.incomeYears === 10 ? 'selected' : ''}>10 years</option>
                    <option value="15" ${calculatorState.needs.incomeYears === 15 ? 'selected' : ''}>15 years</option>
                    <option value="20" ${calculatorState.needs.incomeYears === 20 ? 'selected' : ''}>20 years</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="finalExpenses">Final Expenses</label>
                <input 
                    type="text" 
                    id="finalExpenses" 
                    name="finalExpenses" 
                    placeholder="$"
                    value="${formatNumber(calculatorState.needs.finalExpenses)}"
                >
                <div class="error-message" id="finalExpensesError"></div>
            </div>
            
            <div class="form-group">
                <label for="additionalNeeds">Additional Needs</label>
                <input 
                    type="text" 
                    id="additionalNeeds" 
                    name="additionalNeeds" 
                    placeholder="$"
                    value="${calculatorState.needs.additionalNeeds}"
                >
                <div class="error-message" id="additionalNeedsError"></div>
            </div>
        </div>
    `;
}

// Render results page
function renderResultsPage() {
    calculatorWizard.style.display = 'none';
    resultsPage.style.display = 'block';
    
    const results = calculatorState.results;
    const personal = calculatorState.personal;
    
    resultsPage.innerHTML = `
        <div class="results-card">
            <div class="results-header">
                <h2 class="results-title">Your Life Insurance Recommendation</h2>
                <p>Hello ${personal.firstName}, based on the information you provided, we recommend:</p>
                <div class="coverage-amount" style="color: var(--primary);">${formatCurrency(results.recommendedCoverage)}</div>
                <p style="margin: 20px 0; font-weight: 500;">An advisor will contact you soon to help you understand your results and explore your options.</p>
            </div>
            
            <h3 class="breakdown-title">Coverage Breakdown</h3>
            
            <div class="breakdown-item">
                <div class="breakdown-label">Income Replacement</div>
                <div class="breakdown-value">${formatCurrency(results.breakdown.incomeReplacement)}</div>
            </div>
            
            <div class="breakdown-item">
                <div class="breakdown-label">Mortgage Payoff</div>
                <div class="breakdown-value">${formatCurrency(results.breakdown.mortgagePayoff)}</div>
            </div>
            
            <div class="breakdown-item">
                <div class="breakdown-label">Debt Payoff</div>
                <div class="breakdown-value">${formatCurrency(results.breakdown.debtPayoff)}</div>
            </div>
            
            <div class="breakdown-item">
                <div class="breakdown-label">Education Fund</div>
                <div class="breakdown-value">${formatCurrency(results.breakdown.education)}</div>
            </div>
            
            <div class="breakdown-item">
                <div class="breakdown-label">Final Expenses</div>
                <div class="breakdown-value">${formatCurrency(results.breakdown.finalExpenses)}</div>
            </div>
            
            <div class="breakdown-item">
                <div class="breakdown-label">Additional Needs</div>
                <div class="breakdown-value">${formatCurrency(results.breakdown.additional)}</div>
            </div>
            
            ${results.currentCoverage > 0 ? `
            <div class="current-coverage-section">
                <h3 class="breakdown-title">Your Current Coverage</h3>
                
                <div class="breakdown-item">
                    <div class="breakdown-label">Current Policy Amount</div>
                    <div class="breakdown-value">${formatCurrency(results.currentCoverage)}</div>
                </div>
                
                <div class="breakdown-item highlight">
                    <div class="breakdown-label">Additional Coverage Needed</div>
                    <div class="breakdown-value">${formatCurrency(results.additionalCoverageNeeded)}</div>
                </div>
            </div>
            ` : ''}
            
            <div class="action-buttons">
                <button class="btn btn-secondary" id="startOverButton">Start Over</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('startOverButton').addEventListener('click', () => {
        calculatorActions.resetCalculator();
        resultsPage.style.display = 'none';
        calculatorWizard.style.display = 'block';
        renderCurrentStep();
    });
}

// Add step-specific event listeners
function addStepEventListeners(step) {
    switch (step) {
        case 1:
            const startButton = document.getElementById('startButton');
            if (startButton) {
                startButton.addEventListener('click', () => {
                    calculatorActions.nextStep();
                    renderCurrentStep();
                });
            }
            break;
        
        case 2: // Contact step
            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            
            if (firstNameInput) {
                firstNameInput.addEventListener('input', () => {
                    calculatorActions.setPersonal({ firstName: firstNameInput.value });
                    
                    // Live validation
                    const firstNameError = document.getElementById('firstNameError');
                    if (validateField(firstNameInput.value, 'name')) {
                        firstNameError.textContent = '';
                        firstNameInput.classList.remove('has-error');
                    } else if (firstNameInput.value.length > 0) {
                        firstNameError.textContent = 'Please enter a valid first name';
                        firstNameInput.classList.add('has-error');
                    }
                });
            }
            
            if (lastNameInput) {
                lastNameInput.addEventListener('input', () => {
                    calculatorActions.setPersonal({ lastName: lastNameInput.value });
                    
                    // Live validation
                    const lastNameError = document.getElementById('lastNameError');
                    if (validateField(lastNameInput.value, 'name')) {
                        lastNameError.textContent = '';
                        lastNameInput.classList.remove('has-error');
                    } else if (lastNameInput.value.length > 0) {
                        lastNameError.textContent = 'Please enter a valid last name';
                        lastNameInput.classList.add('has-error');
                    }
                });
            }
            
            if (emailInput) {
                emailInput.addEventListener('input', () => {
                    calculatorActions.setPersonal({ email: emailInput.value });
                    
                    // Live validation
                    const emailError = document.getElementById('emailError');
                    if (validateField(emailInput.value, 'email')) {
                        emailError.textContent = '';
                        emailInput.classList.remove('has-error');
                    } else if (emailInput.value.length > 0) {
                        emailError.textContent = 'Please enter a valid email address';
                        emailInput.classList.add('has-error');
                    }
                });
            }
            
            if (phoneInput) {
                phoneInput.addEventListener('input', () => {
                    // Format phone number as (123) 456-7890
                    const value = phoneInput.value.replace(/\D/g, '').substring(0, 10);
                    const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                    phoneInput.value = value ? formattedValue : '';
                    calculatorActions.setPersonal({ phone: phoneInput.value });
                });
            }
            break;
        
        case 3: // Location step
            const zipCodeInput = document.getElementById('zipCode');
            
            if (zipCodeInput) {
                zipCodeInput.addEventListener('input', (e) => {
                    const zipCode = e.target.value;
                    calculatorActions.setLocation({ zipCode });
                    
                    const zipCodeError = document.getElementById('zipCodeError');
                    
                    // Clear error message initially
                    zipCodeError.textContent = '';
                    
                    // Only look up if we have a 5-digit zipcode
                    if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
                        // Try to use the zipcodes.js lookup to find the state
                        if (window.zipcodes && typeof window.zipcodes.lookup === 'function') {
                            window.zipcodes.onLoaded(function() {
                                const locationInfo = window.zipcodes.lookup(zipCode);
                                if (locationInfo && locationInfo.state) {
                                    // Set the state in the calculator state
                                    calculatorActions.setLocation({ state: locationInfo.state });
                                    zipCodeError.textContent = ''; // Clear any error
                                } else {
                                    // If zipcodes.js couldn't find it, use our fallback
                                    const state = fallbackZipCodeLookup(zipCode);
                                    if (state) {
                                        calculatorActions.setLocation({ state: state });
                                        zipCodeError.textContent = ''; // Clear any error
                                    } else {
                                        // Invalid zip code - no matches found
                                        zipCodeError.textContent = 'Please enter a valid ZIP code';
                                        calculatorActions.setLocation({ state: '' });
                                    }
                                }
                            });
                        } else {
                            // Zipcodes.js not available, use fallback
                            const state = fallbackZipCodeLookup(zipCode);
                            if (state) {
                                calculatorActions.setLocation({ state: state });
                                zipCodeError.textContent = ''; // Clear any error
                            } else {
                                zipCodeError.textContent = 'Please enter a valid ZIP code';
                                calculatorActions.setLocation({ state: '' });
                            }
                        }
                    } else if (zipCode.length === 5) {
                        // Not a valid 5-digit number
                        zipCodeError.textContent = 'Please enter a valid ZIP code';
                        calculatorActions.setLocation({ state: '' });
                    } else {
                        // Reset state when zip code is cleared or incomplete
                        calculatorActions.setLocation({ state: '' });
                    }
                });
            }
            break;
        
        case 4: // Personal step
            const ageInput = document.getElementById('age');
            const genderInputs = document.querySelectorAll('input[name="gender"]');
            const smokerInput = document.getElementById('smoker');
            const healthStatusSelect = document.getElementById('healthStatus');
            
            if (ageInput) {
                ageInput.addEventListener('input', () => {
                    calculatorActions.setPersonal({ age: ageInput.value });
                });
            }
            
            if (genderInputs) {
                genderInputs.forEach(input => {
                    input.addEventListener('change', () => {
                        calculatorActions.setPersonal({ gender: input.value });
                    });
                });
            }
            
            if (smokerInput) {
                smokerInput.addEventListener('change', () => {
                    calculatorActions.setPersonal({ smoker: smokerInput.checked });
                });
            }
            
            if (healthStatusSelect) {
                healthStatusSelect.addEventListener('change', () => {
                    calculatorActions.setPersonal({ healthStatus: healthStatusSelect.value });
                });
            }
            break;
        
        case 5: // Financial step
            const annualIncomeInput = document.getElementById('annualIncome');
            const totalDebtInput = document.getElementById('totalDebt');
            const mortgageBalanceInput = document.getElementById('mortgageBalance');
            const educationFundInput = document.getElementById('educationFund');
            
            if (annualIncomeInput) {
                annualIncomeInput.addEventListener('input', () => {
                    annualIncomeInput.value = formatCurrencyInput(annualIncomeInput.value);
                    calculatorActions.setFinancial({ annualIncome: annualIncomeInput.value });
                });
            }
            
            if (totalDebtInput) {
                totalDebtInput.addEventListener('input', () => {
                    totalDebtInput.value = formatCurrencyInput(totalDebtInput.value);
                    calculatorActions.setFinancial({ totalDebt: totalDebtInput.value });
                });
            }
            
            if (mortgageBalanceInput) {
                mortgageBalanceInput.addEventListener('input', () => {
                    mortgageBalanceInput.value = formatCurrencyInput(mortgageBalanceInput.value);
                    calculatorActions.setFinancial({ mortgageBalance: mortgageBalanceInput.value });
                });
            }
            
            if (educationFundInput) {
                educationFundInput.addEventListener('input', () => {
                    educationFundInput.value = formatCurrencyInput(educationFundInput.value);
                    calculatorActions.setFinancial({ educationFund: educationFundInput.value });
                });
            }
            break;
        
        case 6: // Current Policy step
            const hasPolicyCheckbox = document.getElementById('hasPolicy');
            const coverageAmountInput = document.getElementById('coverageAmount');
            const policyDetailsSection = document.getElementById('policyDetailsSection');
            
            if (hasPolicyCheckbox) {
                hasPolicyCheckbox.addEventListener('change', () => {
                    calculatorActions.setCurrentPolicy({ hasPolicy: hasPolicyCheckbox.checked });
                    
                    // Show/hide the coverage amount field
                    if (policyDetailsSection) {
                        policyDetailsSection.className = hasPolicyCheckbox.checked ? '' : 'hidden';
                    }
                });
            }
            
            if (coverageAmountInput) {
                coverageAmountInput.addEventListener('input', () => {
                    coverageAmountInput.value = formatCurrencyInput(coverageAmountInput.value);
                    calculatorActions.setCurrentPolicy({ coverageAmount: coverageAmountInput.value });
                });
            }
            break;
        
        case 7: // Needs step
            const incomeYearsSelect = document.getElementById('incomeYears');
            const finalExpensesInput = document.getElementById('finalExpenses');
            const additionalNeedsInput = document.getElementById('additionalNeeds');
            
            if (incomeYearsSelect) {
                incomeYearsSelect.addEventListener('change', () => {
                    calculatorActions.setNeeds({ incomeYears: parseInt(incomeYearsSelect.value) });
                });
            }
            
            if (finalExpensesInput) {
                finalExpensesInput.addEventListener('input', () => {
                    finalExpensesInput.value = formatCurrencyInput(finalExpensesInput.value);
                    calculatorActions.setNeeds({ finalExpenses: finalExpensesInput.value.replace(/,/g, '') });
                });
            }
            
            if (additionalNeedsInput) {
                additionalNeedsInput.addEventListener('input', () => {
                    additionalNeedsInput.value = formatCurrencyInput(additionalNeedsInput.value);
                    calculatorActions.setNeeds({ additionalNeeds: additionalNeedsInput.value });
                });
            }
            break;
    }
}

// Format currency input
function formatCurrencyInput(value) {
    // Remove non-numeric characters except for the last decimal point
    value = value.replace(/[^\d.]/g, '');
    value = value.replace(/\.(?=.*\.)/g, '');
    
    // Don't allow more than 2 decimal places
    const parts = value.split('.');
    if (parts.length > 1) {
        parts[1] = parts[1].slice(0, 2);
        value = parts.join('.');
    }
    
    // Format with commas for thousands
    if (value) {
        const number = parseFloat(value);
        if (!isNaN(number)) {
            // Split into integer and decimal parts
            const [integerPart, decimalPart] = value.split('.');
            
            // Format the integer part with commas
            const formattedInteger = parseInt(integerPart).toLocaleString();
            
            // Reconstruct with decimal part if it exists
            return decimalPart !== undefined 
                ? `${formattedInteger}.${decimalPart}` 
                : formattedInteger;
        }
    }
    
    return value;
}

// Validate current step
function validateCurrentStep() {
    const currentStep = calculatorState.step;
    
    switch (currentStep) {
        case 1: // Welcome step
            return true;
        
        case 2: // Contact step
            let isValid = true;
            const firstName = calculatorState.personal.firstName;
            const lastName = calculatorState.personal.lastName;
            const email = calculatorState.personal.email;
            const phone = calculatorState.personal.phone;
            
            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            
            const firstNameError = document.getElementById('firstNameError');
            const lastNameError = document.getElementById('lastNameError');
            const emailError = document.getElementById('emailError');
            const phoneError = document.getElementById('phoneError');
            
            // Clear all previous error classes
            firstNameInput.classList.remove('has-error');
            lastNameInput.classList.remove('has-error');
            emailInput.classList.remove('has-error');
            phoneInput.classList.remove('has-error');
            
            if (!validateField(firstName, 'name')) {
                firstNameError.textContent = 'Please enter your first name';
                firstNameInput.classList.add('has-error');
                isValid = false;
            } else {
                firstNameError.textContent = '';
            }
            
            if (!validateField(lastName, 'name')) {
                lastNameError.textContent = 'Please enter your last name';
                lastNameInput.classList.add('has-error');
                isValid = false;
            } else {
                lastNameError.textContent = '';
            }
            
            if (!validateField(email, 'email')) {
                emailError.textContent = 'Please enter a valid email address';
                emailInput.classList.add('has-error');
                isValid = false;
            } else {
                emailError.textContent = '';
            }
            
            if (!validateField(phone, 'phone')) {
                phoneError.textContent = 'Please enter a valid phone number';
                phoneInput.classList.add('has-error');
                isValid = false;
            } else {
                phoneError.textContent = '';
            }
            
            return isValid;
        
        case 3: // Location step
            {
                let isValid = true;
                const zipCode = calculatorState.location.zipCode;
                const zipCodeInput = document.getElementById('zipCode');
                const zipCodeError = document.getElementById('zipCodeError');
                
                // Clear previous error classes
                zipCodeInput.classList.remove('has-error');
                
                // Only validate zip code since state is auto-populated
                if (!validateField(zipCode, 'zipCode')) {
                    zipCodeError.textContent = 'Please enter a valid ZIP code';
                    zipCodeInput.classList.add('has-error');
                    isValid = false;
                } else {
                    zipCodeError.textContent = '';
                }
                
                return isValid;
            }
        
        case 4: // Personal step
            {
                const age = calculatorState.personal.age;
                const ageInput = document.getElementById('age');
                const ageError = document.getElementById('ageError');
                
                // Clear previous error class
                ageInput.classList.remove('has-error');
                
                if (!validateField(age, 'age')) {
                    ageError.textContent = 'Please enter a valid age between 18 and 85';
                    ageInput.classList.add('has-error');
                    return false;
                }
                
                return true;
            }
        
        case 5: // Financial step
            {
                const annualIncome = calculatorState.financial.annualIncome;
                const annualIncomeInput = document.getElementById('annualIncome');
                const annualIncomeError = document.getElementById('annualIncomeError');
                
                // Clear previous error class
                annualIncomeInput.classList.remove('has-error');
                
                if (!annualIncome) {
                    annualIncomeError.textContent = 'Please enter your annual income';
                    annualIncomeInput.classList.add('has-error');
                    return false;
                }
                
                return true;
            }
        
        case 6: // Current Policy step
            {
                const hasPolicy = calculatorState.currentPolicy.hasPolicy;
                const coverageAmount = calculatorState.currentPolicy.coverageAmount;
                const coverageAmountInput = document.getElementById('coverageAmount');
                const coverageAmountError = document.getElementById('coverageAmountError');
                
                // Clear previous error class if applicable
                if (coverageAmountInput) {
                    coverageAmountInput.classList.remove('has-error');
                }
                
                if (hasPolicy && !coverageAmount) {
                    coverageAmountError.textContent = 'Please enter your current coverage amount';
                    if (coverageAmountInput) {
                        coverageAmountInput.classList.add('has-error');
                    }
                    return false;
                }
                
                return true;
            }
        
        case 7: // Needs step
            return true;
        
        default:
            return true;
    }
}

// Fallback lookup function for when zipcodes.js is unavailable
function fallbackZipCodeLookup(zipCode) {
    // First three digits of zip code map to states
    const zipPrefixMap = {
        // Northeast & Mid-Atlantic
        '0': 'CT', // Connecticut (primarily)
        '010': 'MA', '011': 'MA', '012': 'MA', '013': 'MA', '014': 'MA', '015': 'MA', '016': 'MA', '017': 'MA', '018': 'MA', '019': 'MA', // Massachusetts
        '020': 'MA', '021': 'MA', '022': 'MA', '023': 'MA', '024': 'MA', '025': 'MA', '026': 'MA', '027': 'RI', // MA & Rhode Island
        '028': 'RI', '029': 'RI', // Rhode Island
        '030': 'NH', '031': 'NH', '032': 'NH', '033': 'NH', '034': 'NH', '035': 'NH', '036': 'NH', '037': 'NH', '038': 'NH', // New Hampshire
        '039': 'ME', '040': 'ME', '041': 'ME', '042': 'ME', '043': 'ME', '044': 'ME', '045': 'ME', '046': 'ME', '047': 'ME', '048': 'ME', '049': 'ME', // Maine
        '050': 'VT', '051': 'VT', '052': 'VT', '053': 'VT', '054': 'VT', '056': 'VT', '057': 'VT', '058': 'VT', '059': 'VT', // Vermont
        '060': 'CT', '061': 'CT', '062': 'CT', '063': 'CT', '064': 'CT', '065': 'CT', '066': 'CT', '067': 'CT', '068': 'CT', '069': 'CT', // Connecticut
        '070': 'NJ', '071': 'NJ', '072': 'NJ', '073': 'NJ', '074': 'NJ', '075': 'NJ', '076': 'NJ', '077': 'NJ', '078': 'NJ', '079': 'NJ', // New Jersey
        '080': 'NJ', '081': 'NJ', '082': 'NJ', '083': 'NJ', '084': 'NJ', '085': 'NJ', '086': 'NJ', '087': 'NJ', '088': 'NJ', '089': 'NJ', // New Jersey
        '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY', '104': 'NY', '105': 'NY', // New York
        '106': 'NY', '107': 'NY', '108': 'NY', '109': 'NY', '110': 'NY', '111': 'NY', '112': 'NY', '113': 'NY', '114': 'NY', '115': 'NY', '116': 'NY', '117': 'NY', '118': 'NY', '119': 'NY', // New York
        '120': 'NY', '121': 'NY', '122': 'NY', '123': 'NY', '124': 'NY', '125': 'NY', '126': 'NY', '127': 'NY', '128': 'NY', '129': 'NY', // New York
        '130': 'NY', '131': 'NY', '132': 'NY', '133': 'NY', '134': 'NY', '135': 'NY', '136': 'NY', '137': 'NY', '138': 'NY', '139': 'NY', // New York
        '140': 'NY', '141': 'NY', '142': 'NY', '143': 'NY', '144': 'NY', '145': 'NY', '146': 'NY', '147': 'NY', '148': 'NY', '149': 'NY', // New York
        '150': 'PA', '151': 'PA', '152': 'PA', '153': 'PA', '154': 'PA', '155': 'PA', '156': 'PA', '157': 'PA', '158': 'PA', '159': 'PA', // Pennsylvania Western
        '160': 'PA', '161': 'PA', '162': 'PA', '163': 'PA', '164': 'PA', '165': 'PA', '166': 'PA', '167': 'PA', '168': 'PA', '169': 'PA', // Pennsylvania Central
        '170': 'PA', '171': 'PA', '172': 'PA', '173': 'PA', '174': 'PA', '175': 'PA', '176': 'PA', '177': 'PA', '178': 'PA', '179': 'PA', // Pennsylvania Eastern
        '180': 'PA', '181': 'PA', '182': 'PA', '183': 'PA', '184': 'PA', '185': 'PA', '186': 'PA', '187': 'PA', '188': 'PA', '189': 'PA', // Pennsylvania Eastern
        '190': 'PA', '191': 'PA', '192': 'PA', '193': 'PA', '194': 'PA', '195': 'PA', '196': 'PA', // Pennsylvania Eastern & Philadelphia
        '197': 'DE', '198': 'DE', '199': 'DE', // Delaware
        
        // Southeast & Puerto Rico
        '200': 'DC', '201': 'DC', '202': 'DC', '203': 'DC', '204': 'DC', '205': 'DC', // Washington, DC
        '206': 'MD', '207': 'MD', '208': 'MD', '209': 'MD', // Maryland
        '210': 'MD', '211': 'MD', '212': 'MD', '214': 'MD', '215': 'MD', '216': 'MD', '217': 'MD', '218': 'MD', '219': 'MD', // Maryland
        '220': 'VA', '221': 'VA', '222': 'VA', '223': 'VA', '224': 'VA', '225': 'VA', '226': 'VA', '227': 'VA', // Virginia
        '228': 'WV', '229': 'WV', // West Virginia (partial)
        '230': 'VA', '231': 'VA', '232': 'VA', '233': 'VA', '234': 'VA', '235': 'VA', '236': 'VA', '237': 'VA', '238': 'VA', '239': 'VA', // Virginia
        '240': 'VA', '241': 'VA', '242': 'VA', '243': 'VA', '244': 'VA', '245': 'VA', '246': 'VA', // Virginia
        '247': 'WV', '248': 'WV', '249': 'WV', // West Virginia (partial)
        '250': 'WV', '251': 'WV', '252': 'WV', '253': 'WV', '254': 'WV', '255': 'WV', '256': 'WV', '257': 'WV', '258': 'WV', '259': 'WV', // West Virginia
        '260': 'WV', '261': 'WV', '262': 'WV', '263': 'WV', '264': 'WV', '265': 'WV', '266': 'WV', '267': 'WV', '268': 'WV', // West Virginia
        '270': 'NC', '271': 'NC', '272': 'NC', '273': 'NC', '274': 'NC', '275': 'NC', '276': 'NC', '277': 'NC', '278': 'NC', '279': 'NC', // North Carolina
        '280': 'NC', '281': 'NC', '282': 'NC', '283': 'NC', '284': 'NC', '285': 'NC', '286': 'NC', '287': 'NC', '288': 'NC', '289': 'NC', // North Carolina
        '290': 'SC', '291': 'SC', '292': 'SC', '293': 'SC', '294': 'SC', '295': 'SC', '296': 'SC', '297': 'SC', '298': 'SC', '299': 'SC', // South Carolina
        '300': 'GA', '301': 'GA', '302': 'GA', '303': 'GA', '304': 'GA', '305': 'GA', '306': 'GA', '307': 'GA', '308': 'GA', '309': 'GA', // Georgia (partial)
        '310': 'GA', '311': 'GA', '312': 'GA', '313': 'GA', '314': 'GA', '315': 'GA', '316': 'GA', '317': 'GA', '318': 'GA', '319': 'GA', // Georgia
        '320': 'FL', '321': 'FL', '322': 'FL', '323': 'FL', '324': 'FL', '325': 'FL', '326': 'FL', '327': 'FL', '328': 'FL', '329': 'FL', // Florida (partial)
        '330': 'FL', '331': 'FL', '332': 'FL', '333': 'FL', '334': 'FL', '335': 'FL', '336': 'FL', '337': 'FL', '338': 'FL', '339': 'FL', // Florida (partial)
        '340': 'AA', '341': 'FL', '342': 'FL', '344': 'FL', '346': 'FL', '347': 'FL', '349': 'FL', // Military (AA) and Florida (partial)
        '349': 'FL', '350': 'AL', '351': 'AL', '352': 'AL', '354': 'AL', '355': 'AL', '356': 'AL', '357': 'AL', '358': 'AL', '359': 'AL', // Alabama
        '360': 'AL', '361': 'AL', '362': 'AL', '363': 'AL', '364': 'AL', '365': 'AL', '366': 'AL', '367': 'AL', '368': 'AL', '369': 'AL', // Alabama
        '370': 'TN', '371': 'TN', '372': 'TN', '373': 'TN', '374': 'TN', '375': 'TN', '376': 'TN', '377': 'TN', '378': 'TN', '379': 'TN', // Tennessee
        '380': 'TN', '381': 'TN', '382': 'TN', '383': 'TN', '384': 'TN', '385': 'TN', // Tennessee
        '386': 'MS', '387': 'MS', '388': 'MS', '389': 'MS', // Mississippi (partial)
        '390': 'MS', '391': 'MS', '392': 'MS', '393': 'MS', '394': 'MS', '395': 'MS', '396': 'MS', '397': 'MS', // Mississippi
        '398': 'GA', '399': 'GA', // Georgia (partial)
        
        // Great Lakes Region
        '400': 'KY', '401': 'KY', '402': 'KY', '403': 'KY', '404': 'KY', '405': 'KY', '406': 'KY', '407': 'KY', '408': 'KY', '409': 'KY', // Kentucky
        '410': 'KY', '411': 'KY', '412': 'KY', '413': 'KY', '414': 'KY', '415': 'KY', '416': 'KY', '417': 'KY', '418': 'KY', // Kentucky
        '420': 'KY', '421': 'KY', '422': 'KY', '423': 'KY', '424': 'KY', '425': 'KY', '426': 'KY', '427': 'KY', // Kentucky
        '430': 'OH', '431': 'OH', '432': 'OH', '433': 'OH', '434': 'OH', '435': 'OH', '436': 'OH', '437': 'OH', '438': 'OH', '439': 'OH', // Ohio (partial)
        '440': 'OH', '441': 'OH', '442': 'OH', '443': 'OH', '444': 'OH', '445': 'OH', '446': 'OH', '447': 'OH', '448': 'OH', '449': 'OH', // Ohio (partial)
        '450': 'OH', '451': 'OH', '452': 'OH', '453': 'OH', '454': 'OH', '455': 'OH', '456': 'OH', '457': 'OH', '458': 'OH', // Ohio (partial)
        '460': 'IN', '461': 'IN', '462': 'IN', '463': 'IN', '464': 'IN', '465': 'IN', '466': 'IN', '467': 'IN', '468': 'IN', '469': 'IN', // Indiana
        '470': 'IN', '471': 'IN', '472': 'IN', '473': 'IN', '474': 'IN', '475': 'IN', '476': 'IN', '477': 'IN', '478': 'IN', '479': 'IN', // Indiana
        '480': 'MI', '481': 'MI', '482': 'MI', '483': 'MI', '484': 'MI', '485': 'MI', '486': 'MI', '487': 'MI', '488': 'MI', '489': 'MI', // Michigan (partial)
        '490': 'MI', '491': 'MI', '492': 'MI', '493': 'MI', '494': 'MI', '495': 'MI', '496': 'MI', '497': 'MI', '498': 'MI', '499': 'MI', // Michigan (partial)

        // Western states
        '800': 'CO', '801': 'CO', '802': 'CO', '803': 'CO', '804': 'CO', '805': 'CO', '806': 'CO', '807': 'CO', '808': 'CO', '809': 'CO', // Colorado
        '810': 'CO', '811': 'CO', '812': 'CO', '813': 'CO', '814': 'CO', '815': 'CO', '816': 'CO', // Colorado
        '820': 'WY', '821': 'WY', '822': 'WY', '823': 'WY', '824': 'WY', '825': 'WY', '826': 'WY', '827': 'WY', '828': 'WY', '829': 'WY', // Wyoming
        '830': 'WY', '831': 'WY', // Wyoming
        '832': 'ID', '833': 'ID', '834': 'ID', '835': 'ID', '836': 'ID', '837': 'ID', '838': 'ID', // Idaho
        '840': 'UT', '841': 'UT', '842': 'UT', '843': 'UT', '844': 'UT', '845': 'UT', '846': 'UT', '847': 'UT', // Utah
        '850': 'AZ', '851': 'AZ', '852': 'AZ', '853': 'AZ', '854': 'AZ', '855': 'AZ', '856': 'AZ', '857': 'AZ', // Arizona
        '859': 'NM', '860': 'NM', '861': 'NM', '862': 'NM', '863': 'NM', '864': 'NM', '865': 'NM', // New Mexico
        '870': 'NV', '871': 'NV', '872': 'NV', '873': 'NV', '874': 'NV', '875': 'NV', // Nevada
        '878': 'WY', // Wyoming
        '879': 'WY', // Wyoming
        '880': 'NV', '881': 'NV', // Nevada
        '882': 'CA', '883': 'CA', // California
        '884': 'CA', '885': 'CA', // California
        '889': 'NV', // Nevada
        '890': 'NV', '891': 'NV', '892': 'NV', '893': 'NV', '894': 'NV', '895': 'NV', '896': 'NV', '897': 'NV', '898': 'NV', // Nevada
        '900': 'CA', '901': 'CA', '902': 'CA', '903': 'CA', '904': 'CA', '905': 'CA', '906': 'CA', '907': 'CA', '908': 'CA', '909': 'CA', // California
        '910': 'CA', '911': 'CA', '912': 'CA', '913': 'CA', '914': 'CA', '915': 'CA', '916': 'CA', '917': 'CA', '918': 'CA', '919': 'CA', // California
        '920': 'CA', '921': 'CA', '922': 'CA', '923': 'CA', '924': 'CA', '925': 'CA', '926': 'CA', '927': 'CA', '928': 'CA', '929': 'CA', // California
        '930': 'CA', '931': 'CA', '932': 'CA', '933': 'CA', '934': 'CA', '935': 'CA', '936': 'CA', '937': 'CA', '938': 'CA', '939': 'CA', // California
        '940': 'CA', '941': 'CA', '942': 'CA', '943': 'CA', '944': 'CA', '945': 'CA', '946': 'CA', '947': 'CA', '948': 'CA', '949': 'CA', // California
        '950': 'CA', '951': 'CA', '952': 'CA', '953': 'CA', '954': 'CA', '955': 'CA', '956': 'CA', '957': 'CA', '958': 'CA', '959': 'CA', // California
        '960': 'CA', '961': 'CA', // California
        '970': 'OR', '971': 'OR', '972': 'OR', '973': 'OR', '974': 'OR', '975': 'OR', '976': 'OR', '977': 'OR', '978': 'OR', '979': 'OR', // Oregon
        '980': 'WA', '981': 'WA', '982': 'WA', '983': 'WA', '984': 'WA', '985': 'WA', '986': 'WA', '987': 'WA', '988': 'WA', '989': 'WA', // Washington
        '990': 'WA', '991': 'WA', '992': 'WA', '993': 'WA', '994': 'WA', // Washington
        '995': 'AK', '996': 'AK', '997': 'AK', '998': 'AK', '999': 'AK', // Alaska
    };
    
    // Try to match by first 3 digits
    if (zipCode.length === 5) {
        const prefix3 = zipCode.substring(0, 3);
        const prefix1 = zipCode.substring(0, 1);
        
        // First try 3-digit prefix
        if (zipPrefixMap[prefix3]) {
            return zipPrefixMap[prefix3];
        }
        
        // Then try 1-digit prefix
        if (zipPrefixMap[prefix1]) {
            return zipPrefixMap[prefix1];
        }
    }
    
    // Alaska zip codes start with 99 - specific case since "99" isn't in our map
    if (zipCode.startsWith('99')) {
        return 'AK';
    }
    
    // Return null if no match found
    return null;
} 