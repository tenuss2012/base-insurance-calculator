# Base Insurance Health Calculator

A vanilla JavaScript, HTML, and CSS implementation of an insurance needs calculator that helps users determine appropriate life insurance coverage based on their personal, financial, and family situation.

## Overview

The Base Insurance Health Calculator is a multi-step wizard that collects information from users and calculates a recommended insurance coverage amount. It breaks down complex insurance planning into simple steps and provides personalized recommendations.

## Features

- Multi-step wizard interface
- Form validation
- Real-time calculations
- Responsive design
- Detailed coverage breakdown
- No external dependencies (pure JavaScript)

## Project Structure

```
base-insurance-calculator/
├── public/
│   ├── index.html       # Main HTML document
│   ├── styles.css       # CSS styles
│   └── js/
│       ├── calculator.js # State management and calculations
│       ├── ui.js         # UI rendering and DOM manipulation
│       └── app.js        # Application initialization
└── README.md            # This file
```

## How to Run

1. Clone the repository
2. Open the `public/index.html` file in a web browser
3. No build process or server is required

## How It Works

1. **State Management**: The calculator uses a simple state object to track user inputs and calculation results
2. **UI Rendering**: The UI is dynamically rendered based on the current state
3. **Calculation Logic**: The insurance needs are calculated based on:
   - Income replacement needs
   - Mortgage payoff amount
   - Debt payoff amount
   - Education fund needs
   - Final expenses
   - Additional custom needs

## Calculator Steps

1. **Welcome**: Introduction to the calculator
2. **Location**: ZIP code, state, and county information
3. **Personal**: Age, gender, tobacco use, health status
4. **Financial**: Income, debt, mortgage, education funds
5. **Needs**: Income replacement years, final expenses, additional needs

## Development

This project was converted from a React-based implementation to vanilla JavaScript to eliminate dependencies and simplify deployment. The application uses:

- Plain JavaScript for state management and UI updates
- HTML5 form elements
- CSS for styling
- No external libraries or frameworks

## License

This project is licensed under the MIT License - see the LICENSE.txt file for details. 