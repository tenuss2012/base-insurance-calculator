# BaseTax Insurance Calculator

A React application for calculating health insurance options, subsidy eligibility, and finding the right plan based on user needs.

## Features

- Step-by-step wizard interface for collecting user information
- ZIP code validation and location lookup
- Household and family member management
- Income and healthcare usage assessment
- Subsidy calculation
- Plan recommendation algorithm
- Interactive cost comparison
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/basetax-insurance-calculator.git
cd basetax-insurance-calculator
```

2. Install dependencies:
```
npm install
```
or if you use yarn:
```
yarn install
```

3. Start the development server:
```
npm start
```
or with yarn:
```
yarn start
```

The application will open in your default browser at http://localhost:3000.

## Project Structure

The project follows a standard React application structure:

```
basetax-insurance-calculator/
├── public/                 # Static files
├── src/                    # Source code
│   ├── api/                # API integration
│   ├── components/         # React components
│   │   ├── common/         # Reusable components
│   │   ├── layout/         # Layout components
│   │   ├── results/        # Results page components
│   │   └── steps/          # Wizard step components
│   ├── context/            # React context providers
│   ├── styles/             # Global styles and theme
│   └── utils/              # Utility functions
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Healthcare.gov API Integration

The application includes a placeholder for Healthcare.gov API integration. To implement the real API integration:

1. Obtain proper API credentials from Healthcare.gov
2. Update the API base URL in `src/api/insuranceApi.js`
3. Implement proper authentication and error handling
4. Replace the mock data functions with real API calls

## Deployment

To build the application for production:

```
npm run build
```
or with yarn:
```
yarn build
```

This will create an optimized build in the `build` folder that can be deployed to any static hosting service.

## Next Steps for Implementation

- Complete the API integration with healthcare.gov
- Add comprehensive testing
- Implement analytics tracking
- Refine the subsidy and plan recommendation algorithms

## License

[Add your license information here]

## Acknowledgments

- [Add any acknowledgments here] 