<?php

/**
 * The public-facing functionality of the plugin.
 */
class BaseTax_Insurance_Calculator_Public {

    /**
     * Initialize the class
     */
    public function __construct() {
        // Constructor
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     */
    public function enqueue_styles() {
        wp_enqueue_style('basetax-insurance-calculator-public', BASETAX_INSURANCE_CALCULATOR_PLUGIN_URL . 'public/css/basetax-insurance-calculator-public.css', array(), BASETAX_INSURANCE_CALCULATOR_VERSION, 'all');
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     */
    public function enqueue_scripts() {
        wp_enqueue_script('basetax-insurance-calculator-public', BASETAX_INSURANCE_CALCULATOR_PLUGIN_URL . 'public/js/basetax-insurance-calculator-public.js', array('jquery'), BASETAX_INSURANCE_CALCULATOR_VERSION, false);
        
        wp_localize_script('basetax-insurance-calculator-public', 'basetaxCalculator', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('basetax_insurance_calculator_nonce'),
        ));
        
        // Register AJAX handler
        add_action('wp_ajax_basetax_calculate_insurance', array($this, 'ajax_calculate_insurance'));
        add_action('wp_ajax_nopriv_basetax_calculate_insurance', array($this, 'ajax_calculate_insurance'));
    }

    /**
     * Display the calculator form via shortcode
     */
    public function display_calculator($atts) {
        $atts = shortcode_atts(array(
            'title' => 'Health Insurance Cost Calculator',
            'subtitle' => 'Estimate your health insurance premiums and potential subsidies',
        ), $atts, 'basetax_insurance_calculator');
        
        ob_start();
        include_once 'partials/calculator-form.php';
        return ob_get_clean();
    }

    /**
     * AJAX handler for insurance calculations
     */
    public function ajax_calculate_insurance() {
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'basetax_insurance_calculator_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed.'));
        }
        
        // Collect and sanitize form data
        $ages = array();
        if (isset($_POST['ages']) && is_array($_POST['ages'])) {
            foreach ($_POST['ages'] as $age) {
                $ages[] = intval($age);
            }
        }
        
        $params = array(
            'ages' => $ages,
            'zip_code' => sanitize_text_field($_POST['zip_code']),
            'household_size' => intval($_POST['household_size']),
            'income' => floatval($_POST['income']),
            'coverage_level' => sanitize_text_field($_POST['coverage_level']),
            'tobacco_use' => isset($_POST['tobacco_use']) && $_POST['tobacco_use'] == '1'
        );
        
        // Initialize the calculator engine
        $calculator = new BaseTax_Insurance_Calculator_Engine();
        
        // Get results
        $results = $calculator->calculate($params);
        
        // Check for errors
        if (is_wp_error($results)) {
            wp_send_json_error(array('message' => $results->get_error_message()));
        }
        
        // Return success response with calculation results
        wp_send_json_success($results);
    }
}
