<?php

/**
 * The core calculator functionality.
 */
class BaseTax_Insurance_Calculator_Engine {

    /**
     * Options for the calculator
     */
    private $options;

    /**
     * Current Federal Poverty Level data (for subsidy calculations)
     */
    private $fpl_data;

    /**
     * API client instance
     */
    private $api_client;

    /**
     * Initialize the calculator engine
     */
    public function __construct() {
        $this->options = get_option('basetax_insurance_calculator_options');
        $this->fpl_data = $this->get_fpl_data();
        $this->api_client = new BaseTax_Insurance_Calculator_API();
    }

    /**
     * Calculate insurance estimates based on input parameters
     */
    public function calculate($params) {
        // Validate input parameters
        $validated = $this->validate_params($params);
        if (is_wp_error($validated)) {
            return $validated;
        }

        // Extract validated parameters
        $ages = $validated['ages'];
        $zip_code = $validated['zip_code'];
        $household_size = $validated['household_size'];
        $income = $validated['income'];
        $coverage_level = $validated['coverage_level'];
        $tobacco_use = $validated['tobacco_use'];

        // Try to get data from API if enabled
        if ($this->api_client->is_api_enabled()) {
            $api_results = $this->api_client->get_insurance_plans($validated);
            
            // If the API call was successful, use those results
            if (!is_wp_error($api_results)) {
                $api_results['disclaimer'] = $this->options['disclaimer_text'];
                return $api_results;
            }
            // Otherwise, fall back to the internal calculation
        }

        // Calculate base premiums for each coverage level
        $base_premiums = $this->calculate_base_premiums($zip_code, $ages, $tobacco_use);

        // Calculate potential subsidies if enabled
        $subsidies = array();
        if ($this->options['enable_subsidy_calculation']) {
            $subsidies = $this->calculate_subsidies($income, $household_size, $zip_code, $base_premiums);
        }

        // Prepare results
        $results = array(
            'bronze' => array(
                'monthly_premium' => $base_premiums['bronze'],
                'subsidized_premium' => isset($subsidies['amount']) ? max(0, $base_premiums['bronze'] - $subsidies['amount']) : $base_premiums['bronze'],
                'coverage_summary' => 'Bronze plans cover approximately 60% of healthcare costs on average, with lower monthly premiums but higher out-of-pocket costs.'
            ),
            'silver' => array(
                'monthly_premium' => $base_premiums['silver'],
                'subsidized_premium' => isset($subsidies['amount']) ? max(0, $base_premiums['silver'] - $subsidies['amount']) : $base_premiums['silver'],
                'coverage_summary' => 'Silver plans cover approximately 70% of healthcare costs on average, with moderate monthly premiums and out-of-pocket costs.'
            ),
            'gold' => array(
                'monthly_premium' => $base_premiums['gold'],
                'subsidized_premium' => isset($subsidies['amount']) ? max(0, $base_premiums['gold'] - $subsidies['amount']) : $base_premiums['gold'],
                'coverage_summary' => 'Gold plans cover approximately 80% of healthcare costs on average, with higher monthly premiums but lower out-of-pocket costs.'
            ),
            'platinum' => array(
                'monthly_premium' => $base_premiums['platinum'],
                'subsidized_premium' => isset($subsidies['amount']) ? max(0, $base_premiums['platinum'] - $subsidies['amount']) : $base_premiums['platinum'],
                'coverage_summary' => 'Platinum plans cover approximately 90% of healthcare costs on average, with the highest monthly premiums but lowest out-of-pocket costs.'
            ),
            'subsidy_amount' => isset($subsidies['amount']) ? $subsidies['amount'] : 0,
            'subsidy_eligible' => isset($subsidies['eligible']) ? $subsidies['eligible'] : false,
            'disclaimer' => $this->options['disclaimer_text']
        );

        return $results;
    }

    /**
     * Validate input parameters
     */
    private function validate_params($params) {
        $validated = array();
        
        // Validate ages
        if (empty($params['ages']) || !is_array($params['ages'])) {
            return new WP_Error('invalid_ages', 'At least one valid age is required.');
        }
        
        $validated_ages = array();
        foreach ($params['ages'] as $age) {
            $age = intval($age);
            if ($age < 0 || $age > 120) {
                return new WP_Error('invalid_age', 'Age must be between 0 and 120.');
            }
            $validated_ages[] = $age;
        }
        $validated['ages'] = $validated_ages;
        
        // Validate ZIP code
        if (empty($params['zip_code']) || !preg_match('/^\\d{5}(-\\d{4})?$/', $params['zip_code'])) {
            return new WP_Error('invalid_zip', 'Please enter a valid 5-digit ZIP code.');
        }
        $validated['zip_code'] = substr($params['zip_code'], 0, 5); // Only keep first 5 digits
        
        // Validate household size
        $household_size = intval($params['household_size']);
        if ($household_size < 1 || $household_size > 20) {
            return new WP_Error('invalid_household', 'Household size must be between 1 and 20.');
        }
        $validated['household_size'] = $household_size;
        
        // Validate income
        $income = floatval($params['income']);
        if ($income < 0 || $income > 10000000) { // $10M upper limit as sanity check
            return new WP_Error('invalid_income', 'Please enter a valid annual income.');
        }
        $validated['income'] = $income;
        
        // Validate coverage level
        $valid_levels = array('bronze', 'silver', 'gold', 'platinum');
        if (!in_array(strtolower($params['coverage_level']), $valid_levels)) {
            return new WP_Error('invalid_coverage', 'Please select a valid coverage level.');
        }
        $validated['coverage_level'] = strtolower($params['coverage_level']);
        
        // Validate tobacco use
        $validated['tobacco_use'] = !empty($params['tobacco_use']);
        
        return $validated;
    }

    /**
     * Calculate base premiums based on location, age, and tobacco use
     * This is a simplified implementation - in a real-world scenario, this would likely use an API or database
     */
    private function calculate_base_premiums($zip_code, $ages, $tobacco_use) {
        // Base rate factors by metal tier (simplified example)
        $base_rates = array(
            'bronze' => 350,
            'silver' => 450,
            'gold' => 550,
            'platinum' => 650
        );
        
        // Location factor (would ideally come from API/database based on ZIP)
        $location_factor = $this->get_location_factor($zip_code);
        
        // Age factors - calculate average age factor for all applicants
        $total_age_factor = 0;
        foreach ($ages as $age) {
            $total_age_factor += $this->get_age_factor($age);
        }
        $average_age_factor = $total_age_factor / count($ages);
        
        // Tobacco factor
        $tobacco_factor = $tobacco_use ? 1.5 : 1.0; // 50% surcharge for tobacco users (typical)
        
        // Calculate premiums for each metal tier
        $premiums = array();
        foreach ($base_rates as $tier => $base_rate) {
            $premiums[$tier] = round($base_rate * $location_factor * $average_age_factor * $tobacco_factor, 2);
        }
        
        return $premiums;
    }

    /**
     * Get location-based factor for premium calculation
     * In a real implementation, this would use an API or database lookup
     */
    private function get_location_factor($zip_code) {
        // Simplified implementation - in reality, this would use API or database lookup
        $first_digit = substr($zip_code, 0, 1);
        
        // Very simplified regional variation (would be much more granular in reality)
        $regional_factors = array(
            '0' => 1.2,  // Northeast
            '1' => 1.15, // Northeast
            '2' => 1.1,  // Southeast
            '3' => 1.05, // Southeast
            '4' => 1.0,  // Midwest
            '5' => 0.95, // Midwest
            '6' => 0.9,  // South Central
            '7' => 0.95, // South Central
            '8' => 1.1,  // Mountain West
            '9' => 1.25  // West Coast
        );
        
        return isset($regional_factors[$first_digit]) ? $regional_factors[$first_digit] : 1.0;
    }

    /**
     * Get age-based factor for premium calculation
     */
    private function get_age_factor($age) {
        // Simplified age curve based on ACA guidelines
        if ($age < 18) {
            return 0.635;
        } elseif ($age < 21) {
            return 0.727;
        } elseif ($age < 30) {
            return 0.9 + (($age - 21) * 0.04);
        } elseif ($age < 50) {
            return 1.3 + (($age - 30) * 0.035);
        } elseif ($age < 65) {
            return 2.0 + (($age - 50) * 0.06);
        } else {
            return 3.0; // Age 65+ (Medicare eligible)
        }
    }

    /**
     * Calculate potential subsidies based on income, household size, and location
     */
    private function calculate_subsidies($income, $household_size, $zip_code, $base_premiums) {
        // Get Federal Poverty Level (FPL) for the household size
        $fpl = $this->get_fpl_for_household($household_size);
        
        if (!$fpl) {
            return array('eligible' => false, 'amount' => 0);
        }
        
        // Calculate income as percentage of FPL
        $income_percent_of_fpl = ($income / $fpl) * 100;
        
        // Determine subsidy eligibility and amount
        // ACA subsidies are generally available for incomes between 100% and 400% of FPL
        if ($income_percent_of_fpl < 100 || $income_percent_of_fpl > 400) {
            return array('eligible' => false, 'amount' => 0);
        }
        
        // Calculate maximum percentage of income that should go to premiums
        // This is a simplified implementation of the ACA's sliding scale
        if ($income_percent_of_fpl <= 150) {
            $max_percent = 0.0415; // 4.15%
        } elseif ($income_percent_of_fpl <= 200) {
            $max_percent = 0.0669; // 6.69%
        } elseif ($income_percent_of_fpl <= 250) {
            $max_percent = 0.0859; // 8.59%
        } elseif ($income_percent_of_fpl <= 300) {
            $max_percent = 0.0986; // 9.86%
        } else { // 300-400%
            $max_percent = 0.0985; // 9.85%
        }
        
        // Calculate monthly maximum contribution
        $monthly_max_contribution = ($income * $max_percent) / 12;
        
        // The subsidy is based on the second-lowest cost Silver plan (benchmark)
        $benchmark_premium = $base_premiums['silver'];
        
        // Calculate monthly subsidy amount
        $subsidy = max(0, $benchmark_premium - $monthly_max_contribution);
        
        return array(
            'eligible' => true,
            'amount' => round($subsidy, 2),
            'percent_of_fpl' => round($income_percent_of_fpl, 1),
            'max_percent_of_income' => $max_percent * 100
        );
    }

    /**
     * Get Federal Poverty Level data
     * In a production environment, this would be updated annually
     */
    private function get_fpl_data() {
        // 2024 Federal Poverty Level data for contiguous 48 states and DC
        // Source: https://aspe.hhs.gov/poverty-guidelines
        return array(
            'base' => 14580, // For 1 person
            'additional' => 5140  // For each additional person
        );
    }

    /**
     * Get Federal Poverty Level for a specific household size
     */
    private function get_fpl_for_household($size) {
        if ($size < 1) {
            return 0;
        }
        
        return $this->fpl_data['base'] + ($this->fpl_data['additional'] * ($size - 1));
    }
}