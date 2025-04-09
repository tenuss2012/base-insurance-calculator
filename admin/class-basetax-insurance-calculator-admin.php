<?php

/**
 * The admin-specific functionality of the plugin.
 */
class BaseTax_Insurance_Calculator_Admin {

    /**
     * Initialize the class
     */
    public function __construct() {
        // Constructor
    }

    /**
     * Register the stylesheets for the admin area.
     */
    public function enqueue_styles() {
        wp_enqueue_style('basetax-insurance-calculator-admin', BASETAX_INSURANCE_CALCULATOR_PLUGIN_URL . 'admin/css/basetax-insurance-calculator-admin.css', array(), BASETAX_INSURANCE_CALCULATOR_VERSION, 'all');
    }

    /**
     * Register the JavaScript for the admin area.
     */
    public function enqueue_scripts() {
        wp_enqueue_script('basetax-insurance-calculator-admin', BASETAX_INSURANCE_CALCULATOR_PLUGIN_URL . 'admin/js/basetax-insurance-calculator-admin.js', array('jquery'), BASETAX_INSURANCE_CALCULATOR_VERSION, false);
    }

    /**
     * Add options page to the admin menu
     */
    public function add_options_page() {
        add_options_page(
            'Base Tax Insurance Calculator Settings',
            'Insurance Calculator',
            'manage_options',
            'basetax-insurance-calculator',
            array($this, 'display_options_page')
        );
    }

    /**
     * Display the options page content
     */
    public function display_options_page() {
        include_once 'partials/basetax-insurance-calculator-admin-display.php';
    }

    /**
     * Register settings for the plugin
     */
    public function register_settings() {
        register_setting(
            'basetax_insurance_calculator_options',
            'basetax_insurance_calculator_options',
            array($this, 'validate_options')
        );

        add_settings_section(
            'basetax_insurance_calculator_general',
            'General Settings',
            array($this, 'render_general_section'),
            'basetax-insurance-calculator'
        );

        add_settings_field(
            'api_key',
            'API Key (optional)',
            array($this, 'render_api_key_field'),
            'basetax-insurance-calculator',
            'basetax_insurance_calculator_general'
        );

        add_settings_field(
            'enable_subsidy_calculation',
            'Enable Subsidy Calculation',
            array($this, 'render_subsidy_field'),
            'basetax-insurance-calculator',
            'basetax_insurance_calculator_general'
        );

        add_settings_field(
            'disclaimer_text',
            'Disclaimer Text',
            array($this, 'render_disclaimer_field'),
            'basetax-insurance-calculator',
            'basetax_insurance_calculator_general'
        );
    }

    /**
     * Render general section description
     */
    public function render_general_section() {
        echo '<p>Configure the insurance calculator settings.</p>';
    }

    /**
     * Render API key field
     */
    public function render_api_key_field() {
        $options = get_option('basetax_insurance_calculator_options');
        echo '<input type="text" id="api_key" name="basetax_insurance_calculator_options[api_key]" value="' . esc_attr($options['api_key']) . '" class="regular-text" />';
        echo '<p class="description">Enter an API key if you want to connect to an external data source for more accurate calculations.</p>';
    }

    /**
     * Render subsidy calculation field
     */
    public function render_subsidy_field() {
        $options = get_option('basetax_insurance_calculator_options');
        echo '<input type="checkbox" id="enable_subsidy_calculation" name="basetax_insurance_calculator_options[enable_subsidy_calculation]" ' . checked($options['enable_subsidy_calculation'], true, false) . ' value="1" />';
        echo '<label for="enable_subsidy_calculation">Enable calculation of potential ACA subsidies based on income</label>';
    }

    /**
     * Render disclaimer field
     */
    public function render_disclaimer_field() {
        $options = get_option('basetax_insurance_calculator_options');
        echo '<textarea id="disclaimer_text" name="basetax_insurance_calculator_options[disclaimer_text]" rows="5" cols="50">' . esc_textarea($options['disclaimer_text']) . '</textarea>';
        echo '<p class="description">Legal disclaimer text to display with calculator results.</p>';
    }

    /**
     * Validate options
     */
    public function validate_options($input) {
        $valid = array();

        $valid['api_key'] = sanitize_text_field($input['api_key']);
        $valid['enable_subsidy_calculation'] = isset($input['enable_subsidy_calculation']) ? true : false;
        $valid['disclaimer_text'] = wp_kses_post($input['disclaimer_text']);

        return $valid;
    }
}