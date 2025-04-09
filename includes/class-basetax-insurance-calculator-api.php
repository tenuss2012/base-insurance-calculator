<?php

/**
 * API Integration for the Base Tax Insurance Calculator.
 * 
 * This class handles interactions with external APIs to get more accurate
 * insurance premium and subsidy data.
 */
class BaseTax_Insurance_Calculator_API {

    /**
     * API key for Healthcare.gov Marketplace API
     */
    private $api_key;

    /**
     * Base URL for the Healthcare.gov Marketplace API
     */
    private $api_base_url = 'https://marketplace.api.healthcare.gov/api/v1/';

    /**
     * Initialize the API class
     */
    public function __construct() {
        $options = get_option('basetax_insurance_calculator_options');
        $this->api_key = isset($options['api_key']) ? $options['api_key'] : '';
    }

    /**
     * Check if the API integration is enabled and configured
     */
    public function is_api_enabled() {
        return !empty($this->api_key);
    }

    /**
     * Get insurance plans based on input parameters
     * 
     * @param array $params Array of search parameters
     * @return array|WP_Error Plans data or WP_Error on failure
     */
    public function get_insurance_plans($params) {
        if (!$this->is_api_enabled()) {
            return new WP_Error('api_disabled', 'API integration is not enabled or configured.');
        }

        // Prepare request parameters
        $request_params = array(
            'zip' => $params['zip_code'],
            'fips' => $this->get_fips_code($params['zip_code']),
            'year' => date('Y'),
            'state' => $this->get_state_by_zip($params['zip_code']),
            'age' => implode(',', $params['ages']),
            'household_size' => $params['household_size'],
            'household_income' => $params['income'],
            'tobacco' => $params['tobacco_use'] ? 'true' : 'false',
        );

        // Make API request
        $response = wp_remote_get(add_query_arg($request_params, $this->api_base_url . 'plans'), array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
            ),
            'timeout' => 15,
        ));

        // Check for errors
        if (is_wp_error($response)) {
            return $response;
        }

        // Parse response
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new WP_Error('api_response', 'Invalid API response format.');
        }

        return $this->process_plans_data($data, $params['coverage_level']);
    }

    /**
     * Process the plans data returned from the API
     * 
     * @param array $data API response data
     * @param string $coverage_level Selected coverage level
     * @return array Processed plans data
     */
    private function process_plans_data($data, $coverage_level) {
        // This is a simplified example of processing API data
        // In a real implementation, this would extract and format all the relevant plan details
        
        $results = array(
            'bronze' => array(
                'monthly_premium' => 0,
                'subsidized_premium' => 0,
                'coverage_summary' => '',
            ),
            'silver' => array(
                'monthly_premium' => 0,
                'subsidized_premium' => 0,
                'coverage_summary' => '',
            ),
            'gold' => array(
                'monthly_premium' => 0,
                'subsidized_premium' => 0,
                'coverage_summary' => '',
            ),
            'platinum' => array(
                'monthly_premium' => 0,
                'subsidized_premium' => 0,
                'coverage_summary' => '',
            ),
            'subsidy_amount' => 0,
            'subsidy_eligible' => false,
        );
        
        // Group plans by metal level
        $plans_by_metal = array(
            'bronze' => array(),
            'silver' => array(),
            'gold' => array(),
            'platinum' => array(),
        );
        
        if (isset($data['plans']) && is_array($data['plans'])) {
            foreach ($data['plans'] as $plan) {
                $metal_level = strtolower($plan['metal_level']);
                if (isset($plans_by_metal[$metal_level])) {
                    $plans_by_metal[$metal_level][] = $plan;
                }
            }
        }
        
        // Calculate average premiums for each metal level
        foreach ($plans_by_metal as $metal => $plans) {
            if (!empty($plans)) {
                $total_premium = 0;
                $total_subsidized = 0;
                
                foreach ($plans as $plan) {
                    $total_premium += floatval($plan['premium']);
                    $total_subsidized += floatval($plan['premium']) - floatval($plan['subsidy_amount']);
                }
                
                $results[$metal]['monthly_premium'] = round($total_premium / count($plans), 2);
                $results[$metal]['subsidized_premium'] = round($total_subsidized / count($plans), 2);
                
                // Set coverage summaries based on metal level
                switch ($metal) {
                    case 'bronze':
                        $results[$metal]['coverage_summary'] = 'Bronze plans cover approximately 60% of healthcare costs on average, with lower monthly premiums but higher out-of-pocket costs.';
                        break;
                    case 'silver':
                        $results[$metal]['coverage_summary'] = 'Silver plans cover approximately 70% of healthcare costs on average, with moderate monthly premiums and out-of-pocket costs.';
                        break;
                    case 'gold':
                        $results[$metal]['coverage_summary'] = 'Gold plans cover approximately 80% of healthcare costs on average, with higher monthly premiums but lower out-of-pocket costs.';
                        break;
                    case 'platinum':
                        $results[$metal]['coverage_summary'] = 'Platinum plans cover approximately 90% of healthcare costs on average, with the highest monthly premiums but lowest out-of-pocket costs.';
                        break;
                }
            }
        }
        
        // Extract subsidy information
        if (isset($data['subsidy_amount'])) {
            $results['subsidy_amount'] = floatval($data['subsidy_amount']);
            $results['subsidy_eligible'] = $results['subsidy_amount'] > 0;
        }
        
        return $results;
    }

    /**
     * Get FIPS code for a ZIP code
     * This would typically use a database or API to look up the FIPS code
     * 
     * @param string $zip_code ZIP code
     * @return string FIPS code (county code)
     */
    private function get_fips_code($zip_code) {
        // In a real implementation, this would query a database or API to get the FIPS code
        // For now, we'll return a placeholder
        return '00000';
    }

    /**
     * Get state code for a ZIP code
     * 
     * @param string $zip_code ZIP code
     * @return string State code (e.g., 'NY', 'CA')
     */
    private function get_state_by_zip($zip_code) {
        // In a real implementation, this would query a database to get the state
        // For now, we'll return a placeholder based on first digit
        $first_digit = substr($zip_code, 0, 1);
        
        $zip_to_state = array(
            '0' => 'CT',
            '1' => 'NY',
            '2' => 'DC',
            '3' => 'FL',
            '4' => 'IN',
            '5' => 'MN',
            '6' => 'TX',
            '7' => 'KS',
            '8' => 'CO',
            '9' => 'CA',
        );
        
        return isset($zip_to_state[$first_digit]) ? $zip_to_state[$first_digit] : 'NY';
    }
}