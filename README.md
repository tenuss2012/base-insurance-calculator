# Base Tax Insurance Calculator

A WordPress plugin that provides a health insurance cost calculator for Americans. This calculator allows users to estimate their monthly health insurance premiums based on factors such as age, location, household size, income, coverage level preference, and tobacco use.

## Features

* Calculates estimated health insurance premiums for different metal tiers (Bronze, Silver, Gold, Platinum)
* Estimates potential ACA subsidies based on income and household size
* Responsive design that works on mobile and desktop devices
* Admin settings panel for customization
* Implements Base Tax brand colors and styling
* Easy to install and configure

## Installation

1. Upload the `basetax-insurance-calculator` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure the plugin settings in the WordPress admin under Settings > Insurance Calculator
4. Add the calculator to any page or post using the shortcode: `[basetax_insurance_calculator]`

## Shortcode Options

You can customize the calculator display using these shortcode attributes:

```
[basetax_insurance_calculator title="Your Custom Title" subtitle="Your custom subtitle text here"]
```

## Admin Settings

The plugin includes an admin settings page where you can configure:

* API Key (optional): For integration with external data sources
* Subsidy Calculation: Enable/disable ACA subsidy estimation
* Disclaimer Text: Customize the legal disclaimer shown with calculator results

## Technical Information

* Built for WordPress 5.0+
* Uses AJAX for asynchronous calculations without page reload
* Responsive design built with modern CSS
* No external dependencies required

## API Integration (Optional)

The calculator includes a framework for API integration, allowing for more accurate premium and subsidy estimations. If you have access to a health insurance rate API, you can enter your API key in the plugin settings.

## License

This plugin is licensed exclusively to Base Tax for 2025. All rights reserved.

Copyright (c) 2025 Base Tax
