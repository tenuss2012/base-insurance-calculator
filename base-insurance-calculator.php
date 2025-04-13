<?php
/**
 * Plugin Name: Base Insurance Calculator
 * Plugin URI: https://baseinsurance.com/base-insurance-calculator
 * Description: An insurance calculator plugin that captures lead information and notifies the closest advisor.
 * Version: 1.0.8
 * Author: Terrence Nuss
 * Author URI: https://baseinsurance.com
 * Text Domain: base-insurance-calculator
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('BIC_VERSION', '1.0.8');
define('BIC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BIC_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Create custom database tables on plugin activation
 */
function bic_create_custom_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    $table1 = $wpdb->prefix . 'bic_submissions';
    $table2 = $wpdb->prefix . 'bic_advisors';

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $sql = "
    CREATE TABLE $table1 (
      id BIGINT(20) NOT NULL AUTO_INCREMENT,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      age INT(3) NOT NULL,
      gender VARCHAR(10) NOT NULL,
      zipcode VARCHAR(10) NOT NULL,
      state VARCHAR(2) NOT NULL,
      county VARCHAR(50) NOT NULL,
      calculation_results LONGTEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      advisor_id BIGINT(20) DEFAULT NULL,
      status VARCHAR(20) DEFAULT 'new',
      PRIMARY KEY (id)
    ) $charset_collate;

    CREATE TABLE $table2 (
      id BIGINT(20) NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      territories LONGTEXT NOT NULL,
      calendly_url VARCHAR(255) DEFAULT NULL,
      PRIMARY KEY (id)
    ) $charset_collate;
    ";

    dbDelta($sql);
}
register_activation_hook(__FILE__, 'bic_create_custom_tables');

/**
 * The code that runs during plugin deactivation.
 */
function bic_deactivate() {
    // Nothing to do here yet
}
register_deactivation_hook(__FILE__, 'bic_deactivate');

/**
 * Include admin functionality
 */
if (is_admin()) {
    require_once BIC_PLUGIN_DIR . 'admin/class-admin.php';
    $bic_admin = new BIC_Admin();
}

/**
 * Create a custom AJAX endpoint to serve CSS correctly
 */
function bic_serve_css() {
    // Set the correct MIME type header
    header('Content-Type: text/css');
    header('Cache-Control: max-age=86400');
    
    // Get the CSS file path
    $css_file = BIC_PLUGIN_DIR . 'public/styles.css';
    
    // Check if file exists
    if (file_exists($css_file)) {
        // Add debugging comment at the top of the CSS
        echo "/* CSS file loaded successfully from: {$css_file} */\n\n";
        
        // Output the CSS file
        readfile($css_file);
    } else {
        // Output error in CSS comment format if file not found
        echo "/* ERROR: CSS file not found at: {$css_file} */\n";
        echo "/* Plugin directory: " . BIC_PLUGIN_DIR . " */\n";
    }
    exit;
}
// Add both logged in and non-logged in user endpoints
add_action('wp_ajax_bic_get_css', 'bic_serve_css');
add_action('wp_ajax_nopriv_bic_get_css', 'bic_serve_css');

/**
 * Register the shortcode for displaying the calculator
 */
function bic_calculator_shortcode($atts) {
    // Get the AJAX URL for our CSS
    $css_url = admin_url('admin-ajax.php') . '?action=bic_get_css&ver=' . BIC_VERSION;
    
    // Start output buffer
    ob_start();
    
    // Add CSS directly to the output rather than using wp_head
    echo '<style type="text/css" id="bic-calculator-styles">';
    $css_file = BIC_PLUGIN_DIR . 'public/styles.css';
    if (file_exists($css_file)) {
        $css_content = file_get_contents($css_file);
        
        // Add specificity to CSS selectors by prefixing with .bic-calculator-container
        // Add !important to key styles
        $css_content = str_replace(
            array(
                // Original selectors
                '.calculator-wizard',
                '.wizard-card',
                '.wizard-header',
                '.wizard-content',
                '.wizard-footer',
                '.form-group',
                '.btn',
                '.btn-primary',
                'input, select, textarea',
                // Colors
                '--primary: #057fb0;',
                '--white: #ffffff;',
                '--light-gray: #f4f6f8;',
                '--text: #333333;'
            ),
            array(
                // Enhanced selectors
                '.bic-calculator-container .calculator-wizard',
                '.bic-calculator-container .wizard-card',
                '.bic-calculator-container .wizard-header',
                '.bic-calculator-container .wizard-content',
                '.bic-calculator-container .wizard-footer',
                '.bic-calculator-container .form-group',
                '.bic-calculator-container .btn',
                '.bic-calculator-container .btn-primary',
                '.bic-calculator-container input, .bic-calculator-container select, .bic-calculator-container textarea',
                // Enhanced colors with !important
                '--primary: #057fb0 !important;',
                '--white: #ffffff !important;',
                '--light-gray: #f4f6f8 !important;',
                '--text: #333333 !important;'
            ),
            $css_content
        );
        
        echo $css_content;
    }
    echo '</style>';
    
    // Add critical inline styles as a fallback
    echo '<style type="text/css">
    .bic-calculator-container {
        max-width: 1000px;
        width: 100%;
        margin: 1rem auto;
        font-family: "Poppins", sans-serif !important;
    }
    .bic-calculator-container .wizard-card,
    .bic-calculator-container .results-card {
        background-color: #ffffff !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        overflow: hidden !important;
        padding: 1rem !important;
    }
    .bic-calculator-container .wizard-header,
    .bic-calculator-container .wizard-content {
        padding: 1rem !important;
    }
    .bic-calculator-container .wizard-footer {
        display: flex !important;
        justify-content: space-between !important;
        padding: 1rem !important;
        border-top: 1px solid #f4f6f8 !important;
    }
    .bic-calculator-container .form-group {
        margin-bottom: 0.75rem !important;
    }
    .bic-calculator-container .contact-step .form-group {
        width: 48% !important;
        display: inline-block !important;
        vertical-align: top !important;
        margin-right: 1.5% !important;
    }
    .bic-calculator-container label {
        display: block !important;
        margin-bottom: 0.25rem !important;
        font-weight: 500 !important;
    }
    /* Checkbox label alignment fixes */
    .bic-calculator-container .checkbox-label {
        display: flex !important;
        align-items: center !important;
    }
    .bic-calculator-container .checkbox-label input[type="checkbox"] {
        width: auto !important;
        margin-right: 8px !important;
    }
    .bic-calculator-container input,
    .bic-calculator-container select,
    .bic-calculator-container textarea {
        width: 100% !important;
        padding: 0.5rem 0.75rem !important;
        font-family: "Poppins", sans-serif !important;
        font-size: 1rem !important;
        border: 1px solid #e0e0e0 !important;
        border-radius: 4px !important;
    }
    .bic-calculator-container .btn {
        display: inline-block !important;
        padding: 0.5rem 1.25rem !important;
        font-family: "Poppins", sans-serif !important;
        font-size: 1rem !important;
        font-weight: 500 !important;
        text-align: center !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    .bic-calculator-container .btn-primary {
        background-color: #057fb0 !important;
        color: #ffffff !important;
    }
    .bic-calculator-container .btn-secondary {
        background-color: #ffffff !important;
        color: #057fb0 !important;
        border: 1px solid #057fb0 !important;
    }
    .bic-calculator-container .results-header {
        text-align: center !important;
        margin-bottom: 1.5rem !important;
    }
    .bic-calculator-container .results-title {
        font-size: 1.5rem !important;
        color: #057fb0 !important;
        margin-bottom: 0.5rem !important;
    }
    .bic-calculator-container .coverage-amount {
        font-size: 2.25rem !important;
        font-weight: 700 !important;
        color: #057fb0 !important;
        margin: 1rem 0 !important;
    }
    .bic-calculator-container .breakdown-title {
        font-size: 1.25rem !important;
        margin-bottom: 0.75rem !important;
        border-bottom: 1px solid #f4f6f8 !important;
        padding-bottom: 0.5rem !important;
    }
    .bic-calculator-container .breakdown-item {
        display: flex !important;
        justify-content: space-between !important;
        margin-bottom: 0.5rem !important;
        padding-bottom: 0.5rem !important;
        border-bottom: 1px dashed #f4f6f8 !important;
    }
    .bic-calculator-container .action-buttons {
        margin-top: 1.5rem !important;
        text-align: center !important;
    }
    /* Two-column layout for wider fields */
    .bic-calculator-container .financial-step .form-group,
    .bic-calculator-container .needs-step .form-group,
    .bic-calculator-container .personal-step .form-group,
    .bic-calculator-container .location-step .form-group {
        width: 48% !important;
        display: inline-block !important;
        vertical-align: top !important;
        margin-right: 1.5% !important;
    }
    /* Step indicator styles */
    .bic-calculator-container .step-indicator {
        margin-bottom: 1rem !important;
    }
    /* Responsive styles */
    @media (max-width: 768px) {
        .bic-calculator-container .contact-step .form-group,
        .bic-calculator-container .financial-step .form-group,
        .bic-calculator-container .needs-step .form-group,
        .bic-calculator-container .personal-step .form-group,
        .bic-calculator-container .location-step .form-group {
            width: 100% !important;
            display: block !important;
            margin-right: 0 !important;
        }
    }
    </style>';
    
    // Enqueue scripts
    wp_enqueue_script('bic-calculator-js', BIC_PLUGIN_URL . 'public/js/calculator.js', array('jquery'), BIC_VERSION, true);
    wp_enqueue_script('bic-ui-js', BIC_PLUGIN_URL . 'public/js/ui.js', array('jquery', 'bic-calculator-js'), BIC_VERSION, true);
    wp_enqueue_script('bic-app-js', BIC_PLUGIN_URL . 'public/js/app.js', array('jquery', 'bic-ui-js'), BIC_VERSION, true);
    
    // Localize script to add WordPress AJAX URL
    wp_localize_script('bic-calculator-js', 'bicAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('bic_submission_nonce')
    ));
    
    // Include the calculator display
    include BIC_PLUGIN_DIR . 'public/partials/calculator-display.php';
    
    // Return the buffer contents
    return ob_get_clean();
}
add_shortcode('insurance_calculator', 'bic_calculator_shortcode');

/**
 * Handle AJAX submission from calculator
 */
function bic_handle_submission() {
    // Check nonce for security
    check_ajax_referer('bic_submission_nonce', 'nonce');
    
    $data = json_decode(stripslashes($_POST['submission_data']), true);
    
    // Validate data
    if (empty($data['personal']['firstName']) || 
        empty($data['personal']['lastName']) || 
        empty($data['personal']['email']) ||
        empty($data['personal']['phone']) || 
        empty($data['location']['zipCode'])) {
        wp_send_json_error('Required fields are missing');
        wp_die();
    }
    
    global $wpdb;
    
    // Insert submission into database
    $result = $wpdb->insert(
        $wpdb->prefix . 'bic_submissions',
        array(
            'first_name' => sanitize_text_field($data['personal']['firstName']),
            'last_name' => sanitize_text_field($data['personal']['lastName']),
            'email' => sanitize_email($data['personal']['email']),
            'phone' => sanitize_text_field($data['personal']['phone']),
            'age' => intval($data['personal']['age']),
            'gender' => sanitize_text_field($data['personal']['gender']),
            'zipcode' => sanitize_text_field($data['location']['zipCode']),
            'state' => sanitize_text_field($data['location']['state']),
            'county' => sanitize_text_field($data['location']['county']),
            'calculation_results' => json_encode($data['results']),
            'timestamp' => current_time('mysql'),
            'status' => 'new'
        )
    );
    
    if ($result) {
        $submission_id = $wpdb->insert_id;
        
        // Find nearest advisor
        $advisor = bic_find_nearest_advisor($data['location']['zipCode']);
        
        if ($advisor) {
            // Update submission with advisor id
            $wpdb->update(
                $wpdb->prefix . 'bic_submissions',
                array('advisor_id' => $advisor->id),
                array('id' => $submission_id)
            );
            
            // Get advisor info
            $advisor_info = $wpdb->get_row($wpdb->prepare(
                "SELECT name, email FROM {$wpdb->prefix}bic_advisors WHERE id = %d",
                $advisor->id
            ));
            
            if ($advisor_info) {
                // Send email notification to advisor
                bic_notify_advisor($advisor->id, $submission_id, $data);
                
                // Send email notification to submitter
                bic_notify_submitter($data, $advisor_info, $submission_id);
            }
        }
        
        wp_send_json_success(array(
            'submission_id' => $submission_id
        ));
    } else {
        wp_send_json_error('Failed to save submission');
    }
    
    wp_die();
}
add_action('wp_ajax_bic_submission', 'bic_handle_submission');
add_action('wp_ajax_nopriv_bic_submission', 'bic_handle_submission');

/**
 * Find nearest advisor based on zip code
 * Now supports round-robin assignment
 */
function bic_find_nearest_advisor($zip_code) {
    global $wpdb;
    
    $advisors_table = $wpdb->prefix . 'bic_advisors';
    
    // Get all advisors with their territories
    $advisors = $wpdb->get_results(
        "SELECT * FROM $advisors_table ORDER BY id ASC"
    );
    
    $matching_advisors = array();
    
    // Find advisors that cover this zip code
    foreach ($advisors as $advisor) {
        // Decode the territories JSON
        $territories = json_decode($advisor->territories, true);
        
        // If territories is not valid JSON or empty, skip
        if (!is_array($territories) || empty($territories)) {
            continue;
        }
        
        // Check all states in this advisor's territories
        foreach ($territories as $state => $territory) {
            // If territory is set to all zip codes (*) or contains this zip code
            if ($territory === '*' || (is_array($territory) && in_array($zip_code, $territory))) {
                $matching_advisors[] = $advisor;
                break; // Found a match, no need to check other states for this advisor
            }
        }
    }
    
    // If we found matching advisors
    if (!empty($matching_advisors)) {
        // Get the assignment method from settings (default to round-robin)
        $assignment_method = get_option('bic_assignment_method', 'round-robin');
        
        if ($assignment_method === 'first-match') {
            // Return the first matching advisor (original behavior)
            return $matching_advisors[0];
        } else {
            // Round-robin assignment
            $assignment_index = get_option('bic_last_assigned_index', 0);
            
            $advisor_count = count($matching_advisors);
            // Calculate next index
            $next_index = ($assignment_index + 1) % $advisor_count;
            
            // Save the updated index for future assignments
            update_option('bic_last_assigned_index', $next_index);
            
            // For debugging
            error_log("Round-robin assignment: Using advisor at index $next_index of $advisor_count matching advisors. Assignment index was $assignment_index");
            
            return $matching_advisors[$next_index];
        }
    }
    
    // No matching advisors found, check for default advisor
    $default_advisor_id = get_option('bic_default_advisor', 0);
    
    if ($default_advisor_id > 0) {
        $default_advisor = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM $advisors_table WHERE id = %d",
                $default_advisor_id
            )
        );
        
        if ($default_advisor) {
            return $default_advisor;
        }
    }
    
    // If no matching advisors and no default, fall back to first advisor
    if (!empty($advisors)) {
        return $advisors[0];
    }
    
    return null;
}

/**
 * Notify advisor about new submission
 */
function bic_notify_advisor($advisor_id, $submission_id, $data) {
    global $wpdb;
    
    $advisor = $wpdb->get_row($wpdb->prepare(
        "SELECT name, email FROM {$wpdb->prefix}bic_advisors WHERE id = %d",
        $advisor_id
    ));
    
    if (!$advisor) {
        return false;
    }
    
    $subject = get_option('bic_email_subject', 'New Insurance Calculator Submission');
    
    // Get email template
    $email_template = get_option('bic_email_template', '');
    
    if (empty($email_template)) {
        // Default template
        $message = "Hello {$advisor->name},\n\n";
        $message .= "A new insurance calculator submission has been received:\n\n";
        $message .= "Name: {$data['personal']['firstName']} {$data['personal']['lastName']}\n";
        $message .= "Email: {$data['personal']['email']}\n";
        $message .= "Phone: {$data['personal']['phone']}\n";
        $message .= "Age: {$data['personal']['age']}\n";
        $message .= "Location: {$data['location']['county']}, {$data['location']['state']} {$data['location']['zipCode']}\n\n";
        $message .= "Recommended Coverage: $" . number_format($data['results']['recommendedCoverage']) . "\n\n";
        $message .= "View this submission in the admin panel: " . admin_url('admin.php?page=bic-submissions&id=' . $submission_id);
    } else {
        // Use custom template
        $message = $email_template;
        
        // Replace variables
        $replacements = array(
            '{advisor_name}' => $advisor->name,
            '{client_name}' => $data['personal']['firstName'] . ' ' . $data['personal']['lastName'],
            '{client_email}' => $data['personal']['email'],
            '{client_phone}' => $data['personal']['phone'],
            '{client_location}' => $data['location']['county'] . ', ' . $data['location']['state'] . ' ' . $data['location']['zipCode'],
            '{recommended_coverage}' => '$' . number_format($data['results']['recommendedCoverage']),
            '{submission_link}' => admin_url('admin.php?page=bic-submissions&id=' . $submission_id)
        );
        
        $message = str_replace(array_keys($replacements), array_values($replacements), $message);
    }
    
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    
    return wp_mail($advisor->email, $subject, $message, $headers);
}

/**
 * Notify submitter about their calculation
 */
function bic_notify_submitter($data, $advisor, $submission_id) {
    if (empty($data['personal']['email'])) {
        return false;
    }
    
    $subject = get_option('bic_submitter_email_subject', 'Your Insurance Calculator Results');
    
    // Get submitter email template
    $email_template = get_option('bic_submitter_email_template', '');
    
    if (empty($email_template)) {
        // Default template
        $message = "Hello {$data['personal']['firstName']},\n\n";
        $message .= "Thank you for using our Insurance Needs Calculator. Here are your results:\n\n";
        $message .= "Recommended Coverage: $" . number_format($data['results']['recommendedCoverage']) . "\n\n";
        
        if (isset($data['results']['breakdown'])) {
            $message .= "Breakdown:\n";
            foreach ($data['results']['breakdown'] as $label => $value) {
                $message .= ucwords(str_replace('_', ' ', $label)) . ": $" . number_format($value) . "\n";
            }
            $message .= "\n";
        }
        
        if ($advisor) {
            $message .= "Your submission has been assigned to {$advisor->name}, who will contact you soon to help you understand your results and explore your options.\n\n";
        }
        
        $message .= "Thank you for choosing us for your insurance needs.\n\n";
        $message .= "Best regards,\n";
        $message .= get_bloginfo('name');
    } else {
        // Use custom template
        $message = $email_template;
        
        // Replace variables
        $replacements = array(
            '{client_name}' => $data['personal']['firstName'],
            '{full_name}' => $data['personal']['firstName'] . ' ' . $data['personal']['lastName'],
            '{recommended_coverage}' => '$' . number_format($data['results']['recommendedCoverage']),
            '{advisor_name}' => $advisor ? $advisor->name : '',
            '{site_name}' => get_bloginfo('name')
        );
        
        $message = str_replace(array_keys($replacements), array_values($replacements), $message);
    }
    
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    
    return wp_mail($data['personal']['email'], $subject, $message, $headers);
}

/**
 * Handle AJAX settings save
 */
function bic_save_settings() {
    check_ajax_referer('bic_admin_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error('You do not have permission to do this');
    }
    
    // Save email settings
    if (isset($_POST['email_subject'])) {
        update_option('bic_email_subject', sanitize_text_field($_POST['email_subject']));
    }
    
    if (isset($_POST['email_template'])) {
        update_option('bic_email_template', wp_kses_post($_POST['email_template']));
    }
    
    // Save submitter email settings
    if (isset($_POST['submitter_email_subject'])) {
        update_option('bic_submitter_email_subject', sanitize_text_field($_POST['submitter_email_subject']));
    }
    
    if (isset($_POST['submitter_email_template'])) {
        update_option('bic_submitter_email_template', wp_kses_post($_POST['submitter_email_template']));
    }
    
    // Save display settings
    if (isset($_POST['calculator_title'])) {
        update_option('bic_calculator_title', sanitize_text_field($_POST['calculator_title']));
    }
    
    if (isset($_POST['primary_color'])) {
        update_option('bic_primary_color', sanitize_hex_color($_POST['primary_color']));
    }
    
    if (isset($_POST['button_text'])) {
        update_option('bic_button_text', sanitize_text_field($_POST['button_text']));
    }
    
    if (isset($_POST['show_logo'])) {
        update_option('bic_show_logo', sanitize_text_field($_POST['show_logo']));
    }
    
    // Save advisor assignment settings
    if (isset($_POST['default_advisor'])) {
        update_option('bic_default_advisor', intval($_POST['default_advisor']));
    }
    
    if (isset($_POST['assignment_method'])) {
        update_option('bic_assignment_method', sanitize_text_field($_POST['assignment_method']));
    }
    
    wp_send_json_success();
}
add_action('wp_ajax_bic_save_settings', 'bic_save_settings');

/**
 * Reset the assignment index counter for round-robin
 */
function bic_reset_assignment_index() {
    check_ajax_referer('bic_admin_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error('You do not have permission to do this');
    }
    
    // Reset the counter to 0
    update_option('bic_last_assigned_index', 0);
    
    wp_send_json_success();
}
add_action('wp_ajax_bic_reset_assignment_index', 'bic_reset_assignment_index'); 