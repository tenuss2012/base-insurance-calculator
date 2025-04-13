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
            
            <div class="form-group">
                <label for="state">State</label>
                <select 
                    id="state" 
                    name="state"
                >
                    <option value="" ${calculatorState.location.state === '' ? 'selected' : ''}>Select your state</option>
                    <option value="AL" ${calculatorState.location.state === 'AL' ? 'selected' : ''}>Alabama</option>
                    <option value="AK" ${calculatorState.location.state === 'AK' ? 'selected' : ''}>Alaska</option>
                    <option value="AZ" ${calculatorState.location.state === 'AZ' ? 'selected' : ''}>Arizona</option>
                    <option value="AR" ${calculatorState.location.state === 'AR' ? 'selected' : ''}>Arkansas</option>
                    <option value="CA" ${calculatorState.location.state === 'CA' ? 'selected' : ''}>California</option>
                    <option value="CO" ${calculatorState.location.state === 'CO' ? 'selected' : ''}>Colorado</option>
                    <option value="CT" ${calculatorState.location.state === 'CT' ? 'selected' : ''}>Connecticut</option>
                    <option value="DE" ${calculatorState.location.state === 'DE' ? 'selected' : ''}>Delaware</option>
                    <option value="FL" ${calculatorState.location.state === 'FL' ? 'selected' : ''}>Florida</option>
                    <option value="GA" ${calculatorState.location.state === 'GA' ? 'selected' : ''}>Georgia</option>
                    <option value="HI" ${calculatorState.location.state === 'HI' ? 'selected' : ''}>Hawaii</option>
                    <option value="ID" ${calculatorState.location.state === 'ID' ? 'selected' : ''}>Idaho</option>
                    <option value="IL" ${calculatorState.location.state === 'IL' ? 'selected' : ''}>Illinois</option>
                    <option value="IN" ${calculatorState.location.state === 'IN' ? 'selected' : ''}>Indiana</option>
                    <option value="IA" ${calculatorState.location.state === 'IA' ? 'selected' : ''}>Iowa</option>
                    <option value="KS" ${calculatorState.location.state === 'KS' ? 'selected' : ''}>Kansas</option>
                    <option value="KY" ${calculatorState.location.state === 'KY' ? 'selected' : ''}>Kentucky</option>
                    <option value="LA" ${calculatorState.location.state === 'LA' ? 'selected' : ''}>Louisiana</option>
                    <option value="ME" ${calculatorState.location.state === 'ME' ? 'selected' : ''}>Maine</option>
                    <option value="MD" ${calculatorState.location.state === 'MD' ? 'selected' : ''}>Maryland</option>
                    <option value="MA" ${calculatorState.location.state === 'MA' ? 'selected' : ''}>Massachusetts</option>
                    <option value="MI" ${calculatorState.location.state === 'MI' ? 'selected' : ''}>Michigan</option>
                    <option value="MN" ${calculatorState.location.state === 'MN' ? 'selected' : ''}>Minnesota</option>
                    <option value="MS" ${calculatorState.location.state === 'MS' ? 'selected' : ''}>Mississippi</option>
                    <option value="MO" ${calculatorState.location.state === 'MO' ? 'selected' : ''}>Missouri</option>
                    <option value="MT" ${calculatorState.location.state === 'MT' ? 'selected' : ''}>Montana</option>
                    <option value="NE" ${calculatorState.location.state === 'NE' ? 'selected' : ''}>Nebraska</option>
                    <option value="NV" ${calculatorState.location.state === 'NV' ? 'selected' : ''}>Nevada</option>
                    <option value="NH" ${calculatorState.location.state === 'NH' ? 'selected' : ''}>New Hampshire</option>
                    <option value="NJ" ${calculatorState.location.state === 'NJ' ? 'selected' : ''}>New Jersey</option>
                    <option value="NM" ${calculatorState.location.state === 'NM' ? 'selected' : ''}>New Mexico</option>
                    <option value="NY" ${calculatorState.location.state === 'NY' ? 'selected' : ''}>New York</option>
                    <option value="NC" ${calculatorState.location.state === 'NC' ? 'selected' : ''}>North Carolina</option>
                    <option value="ND" ${calculatorState.location.state === 'ND' ? 'selected' : ''}>North Dakota</option>
                    <option value="OH" ${calculatorState.location.state === 'OH' ? 'selected' : ''}>Ohio</option>
                    <option value="OK" ${calculatorState.location.state === 'OK' ? 'selected' : ''}>Oklahoma</option>
                    <option value="OR" ${calculatorState.location.state === 'OR' ? 'selected' : ''}>Oregon</option>
                    <option value="PA" ${calculatorState.location.state === 'PA' ? 'selected' : ''}>Pennsylvania</option>
                    <option value="RI" ${calculatorState.location.state === 'RI' ? 'selected' : ''}>Rhode Island</option>
                    <option value="SC" ${calculatorState.location.state === 'SC' ? 'selected' : ''}>South Carolina</option>
                    <option value="SD" ${calculatorState.location.state === 'SD' ? 'selected' : ''}>South Dakota</option>
                    <option value="TN" ${calculatorState.location.state === 'TN' ? 'selected' : ''}>Tennessee</option>
                    <option value="TX" ${calculatorState.location.state === 'TX' ? 'selected' : ''}>Texas</option>
                    <option value="UT" ${calculatorState.location.state === 'UT' ? 'selected' : ''}>Utah</option>
                    <option value="VT" ${calculatorState.location.state === 'VT' ? 'selected' : ''}>Vermont</option>
                    <option value="VA" ${calculatorState.location.state === 'VA' ? 'selected' : ''}>Virginia</option>
                    <option value="WA" ${calculatorState.location.state === 'WA' ? 'selected' : ''}>Washington</option>
                    <option value="WV" ${calculatorState.location.state === 'WV' ? 'selected' : ''}>West Virginia</option>
                    <option value="WI" ${calculatorState.location.state === 'WI' ? 'selected' : ''}>Wisconsin</option>
                    <option value="WY" ${calculatorState.location.state === 'WY' ? 'selected' : ''}>Wyoming</option>
                    <option value="DC" ${calculatorState.location.state === 'DC' ? 'selected' : ''}>District of Columbia</option>
                </select>
                <div class="error-message" id="stateError"></div>
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
                    I use tobacco products
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
                    I already have a life insurance policy
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
            const stateSelect = document.getElementById('state');
            
            if (zipCodeInput) {
                zipCodeInput.addEventListener('input', (e) => {
                    const zipCode = e.target.value;
                    calculatorActions.setLocation({ zipCode });
                    
                    const zipCodeError = document.getElementById('zipCodeError');
                    
                    if (zipCode.length === 5 && validateField(zipCode, 'zipCode')) {
                        zipCodeError.textContent = '';
                    } else if (zipCode.length === 5) {
                        zipCodeError.textContent = 'Please enter a valid ZIP code';
                    } else {
                        zipCodeError.textContent = '';
                    }
                });
            }
            
            if (stateSelect) {
                stateSelect.addEventListener('change', (e) => {
                    calculatorActions.setLocation({ state: e.target.value });
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
                const state = calculatorState.location.state;
                const zipCodeInput = document.getElementById('zipCode');
                const stateSelect = document.getElementById('state');
                const zipCodeError = document.getElementById('zipCodeError');
                const stateError = document.getElementById('stateError');
                
                // Clear previous error classes
                zipCodeInput.classList.remove('has-error');
                if (stateSelect) stateSelect.classList.remove('has-error');
                
                if (!validateField(zipCode, 'zipCode')) {
                    zipCodeError.textContent = 'Please enter a valid ZIP code';
                    zipCodeInput.classList.add('has-error');
                    isValid = false;
                } else {
                    zipCodeError.textContent = '';
                }
                
                if (!state) {
                    stateError.textContent = 'Please select your state';
                    if (stateSelect) stateSelect.classList.add('has-error');
                    isValid = false;
                } else {
                    stateError.textContent = '';
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