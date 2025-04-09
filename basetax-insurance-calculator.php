<?php
/**
 * Plugin Name: Base Tax Insurance Calculator
 * Plugin URI: https://basetax.com
 * Description: A health insurance calculator plugin for Americans to estimate insurance costs based on various factors.
 * Version: 1.0.0
 * Author: Base Tax
 * Author URI: https://basetax.com
 * License: Base Tax 2025
 * Text Domain: basetax-insurance-calculator
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

define('BASETAX_INSURANCE_CALCULATOR_VERSION', '1.0.0');
define('BASETAX_INSURANCE_CALCULATOR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BASETAX_INSURANCE_CALCULATOR_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 */
function activate_basetax_insurance_calculator() {
    // Create any necessary database tables or options
    add_option('basetax_insurance_calculator_options', array(
        'api_key' => '',
        'enable_subsidy_calculation' => true,
        'disclaimer_text' => 'Disclaimer: The estimates provided by this calculator are for informational purposes only and do not represent actual quotes. Please consult with an insurance professional or visit the Health Insurance Marketplace for accurate quotes.'
    ));
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_basetax_insurance_calculator() {
    // Clean up if necessary
}

register_activation_hook(__FILE__, 'activate_basetax_insurance_calculator');
register_deactivation_hook(__FILE__, 'deactivate_basetax_insurance_calculator');

/**
 * The core plugin class.
 */
class BaseTax_Insurance_Calculator {

    /**
     * Initialize the plugin.
     */
    public function __construct() {
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    /**
     * Load the required dependencies for this plugin.
     */
    private function load_dependencies() {
        // Include admin class
        require_once BASETAX_INSURANCE_CALCULATOR_PLUGIN_DIR . 'admin/class-basetax-insurance-calculator-admin.php';
        
        // Include public class
        require_once BASETAX_INSURANCE_CALCULATOR_PLUGIN_DIR . 'public/class-basetax-insurance-calculator-public.php';
        
        // Include calculator class
        require_once BASETAX_INSURANCE_CALCULATOR_PLUGIN_DIR . 'includes/class-basetax-insurance-calculator-engine.php';
    }

    /**
     * Register all of the hooks related to the admin area functionality.
     */
    private function define_admin_hooks() {
        $plugin_admin = new BaseTax_Insurance_Calculator_Admin();
        
        add_action('admin_enqueue_scripts', array($plugin_admin, 'enqueue_styles'));
        add_action('admin_enqueue_scripts', array($plugin_admin, 'enqueue_scripts'));
        add_action('admin_menu', array($plugin_admin, 'add_options_page'));
        add_action('admin_init', array($plugin_admin, 'register_settings'));
    }

    /**
     * Register all of the hooks related to the public-facing functionality.
     */
    private function define_public_hooks() {
        $plugin_public = new BaseTax_Insurance_Calculator_Public();
        
        add_action('wp_enqueue_scripts', array($plugin_public, 'enqueue_styles'));
        add_action('wp_enqueue_scripts', array($plugin_public, 'enqueue_scripts'));
        
        // Register the shortcode [basetax_insurance_calculator]
        add_shortcode('basetax_insurance_calculator', array($plugin_public, 'display_calculator'));
    }
}

// Initialize the plugin
function run_basetax_insurance_calculator() {
    $plugin = new BaseTax_Insurance_Calculator();
}
run_basetax_insurance_calculator();
