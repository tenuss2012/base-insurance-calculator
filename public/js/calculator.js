/**
 * Base Insurance Health Calculator - State Management and Calculations
 */

// State management
const calculatorState = {
    step: 1,
    location: {
        zipCode: '',
        state: '',
        county: '',
    },
    personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        gender: 'male',
        smoker: false,
        healthStatus: 'average',
    },
    financial: {
        annualIncome: '',
        totalAssets: '',
        totalDebt: '',
        mortgageBalance: '',
        educationFund: '',
        retirementSavings: '',
    },
    currentPolicy: {
        hasPolicy: false,
        coverageAmount: '',
    },
    family: {
        maritalStatus: 'single',
        spouseIncome: '',
        dependents: [],
        childrenEducation: false,
        educationCost: '',
    },
    needs: {
        incomeYears: 10,
        finalExpenses: 15000,
        additionalNeeds: '',
    },
    results: {
        recommendedCoverage: 0,
        additionalCoverageNeeded: 0,
        currentCoverage: 0,
        breakdown: {
            incomeReplacement: 0,
            mortgagePayoff: 0,
            debtPayoff: 0,
            education: 0,
            finalExpenses: 0,
            additional: 0,
        },
        loading: false,
        error: null,
    },
};

// State update methods
const calculatorActions = {
    setStep(step) {
        calculatorState.step = step;
        return calculatorState;
    },

    nextStep() {
        calculatorState.step += 1;
        return calculatorState;
    },

    prevStep() {
        calculatorState.step -= 1;
        return calculatorState;
    },

    setLocation(locationData) {
        calculatorState.location = { ...calculatorState.location, ...locationData };
        return calculatorState;
    },

    setPersonal(personalData) {
        calculatorState.personal = { ...calculatorState.personal, ...personalData };
        return calculatorState;
    },

    setFinancial(financialData) {
        calculatorState.financial = { ...calculatorState.financial, ...financialData };
        return calculatorState;
    },

    setCurrentPolicy(policyData) {
        calculatorState.currentPolicy = { ...calculatorState.currentPolicy, ...policyData };
        return calculatorState;
    },

    setFamily(familyData) {
        calculatorState.family = { ...calculatorState.family, ...familyData };
        return calculatorState;
    },

    addDependent(dependent) {
        calculatorState.family.dependents.push(dependent);
        return calculatorState;
    },

    removeDependent(index) {
        calculatorState.family.dependents.splice(index, 1);
        return calculatorState;
    },

    setNeeds(needsData) {
        calculatorState.needs = { ...calculatorState.needs, ...needsData };
        return calculatorState;
    },

    resetCalculator() {
        // Reset all properties except step
        calculatorState.location = {
            zipCode: '',
            state: '',
            county: '',
        };
        calculatorState.personal = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            age: '',
            gender: 'male',
            smoker: false,
            healthStatus: 'average',
        };
        calculatorState.financial = {
            annualIncome: '',
            totalAssets: '',
            totalDebt: '',
            mortgageBalance: '',
            educationFund: '',
            retirementSavings: '',
        };
        calculatorState.currentPolicy = {
            hasPolicy: false,
            coverageAmount: '',
        };
        calculatorState.family = {
            maritalStatus: 'single',
            spouseIncome: '',
            dependents: [],
            childrenEducation: false,
            educationCost: '',
        };
        calculatorState.needs = {
            incomeYears: 10,
            finalExpenses: 15000,
            additionalNeeds: '',
        };
        calculatorState.results = {
            recommendedCoverage: 0,
            additionalCoverageNeeded: 0,
            currentCoverage: 0,
            breakdown: {
                incomeReplacement: 0,
                mortgagePayoff: 0,
                debtPayoff: 0,
                education: 0,
                finalExpenses: 0,
                additional: 0,
            },
            loading: false,
            error: null,
        };
        calculatorState.step = 1;
        return calculatorState;
    },

    // Calculate insurance needs
    calculateResults() {
        calculatorState.results.loading = true;
        calculatorState.results.error = null;

        try {
            // Parse income and other financial data, removing commas
            const annualIncome = parseFloat(calculatorState.financial.annualIncome.replace(/,/g, '')) || 0;
            const mortgageBalance = parseFloat(calculatorState.financial.mortgageBalance.replace(/,/g, '')) || 0;
            const totalDebt = parseFloat(calculatorState.financial.totalDebt.replace(/,/g, '')) || 0;
            const educationFund = parseFloat(calculatorState.financial.educationFund.replace(/,/g, '')) || 0;
            const finalExpenses = parseFloat(calculatorState.needs.finalExpenses) || 15000; // Default funeral costs
            const additionalNeeds = parseFloat(calculatorState.needs.additionalNeeds.replace(/,/g, '')) || 0;
            const incomeYears = parseInt(calculatorState.needs.incomeYears) || 10;
            
            // Calculate each component of insurance needs
            const incomeReplacement = annualIncome * incomeYears;
            const mortgagePayoff = mortgageBalance;
            const debtPayoff = totalDebt;
            const education = educationFund;
            
            // Calculate total recommended coverage
            const totalCoverage = incomeReplacement + mortgagePayoff + debtPayoff + education + finalExpenses + additionalNeeds;
            
            // Round to nearest $10,000 for cleaner presentation
            const roundedCoverage = Math.ceil(totalCoverage / 10000) * 10000;
            
            // Get current policy coverage if any
            let currentCoverage = 0;
            if (calculatorState.currentPolicy.hasPolicy && calculatorState.currentPolicy.coverageAmount) {
                currentCoverage = parseFloat(calculatorState.currentPolicy.coverageAmount.replace(/,/g, '')) || 0;
            }
            
            // Calculate additional coverage needed (total needed minus current coverage)
            const additionalCoverageNeeded = Math.max(0, roundedCoverage - currentCoverage);
            
            // Update results in state
            calculatorState.results = {
                ...calculatorState.results,
                recommendedCoverage: roundedCoverage,
                currentCoverage: currentCoverage,
                additionalCoverageNeeded: additionalCoverageNeeded,
                breakdown: {
                    incomeReplacement,
                    mortgagePayoff,
                    debtPayoff,
                    education,
                    finalExpenses,
                    additional: additionalNeeds,
                },
                loading: false
            };
            
            return calculatorState;
        } catch (error) {
            console.error('Error calculating life insurance needs:', error);
            calculatorState.results.error = 'Unable to calculate life insurance needs. Please check your inputs and try again.';
            calculatorState.results.loading = false;
            return calculatorState;
        }
    }
};

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Helper function to format numbers with commas
function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// Helper function for form validation
function validateField(value, fieldType) {
    if (!value) return false;
    
    switch (fieldType) {
        case 'zipCode':
            // Just check basic format (5 digits)
            return /^\d{5}$/.test(value);
        case 'currency':
            return /^(\d{1,3}(,\d{3})*|\d+)(\.\d{0,2})?$/.test(value);
        case 'number':
            return /^\d+$/.test(value);
        case 'age':
            const age = parseInt(value);
            return age >= 18 && age <= 85;
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'phone':
            return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
        case 'name':
            return value.length >= 2; // At least 2 characters
        default:
            return true;
    }
} 