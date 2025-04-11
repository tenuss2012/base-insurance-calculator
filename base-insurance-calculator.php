<?php
/**
 * Plugin Name: Base Insurance Calculator
 * Plugin URI: https://example.com/base-insurance-calculator
 * Description: An insurance calculator plugin that captures lead information and notifies the closest advisor.
 * Version: 1.0.3
 * Author: Your Name
 * Author URI: https://example.com
 * Text Domain: base-insurance-calculator
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('BIC_VERSION', '1.0.3');
define('BIC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BIC_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Fix for CSS MIME type issue
 */
function bic_correct_mime_type($mime_types) {
    // Ensure CSS files use the correct MIME type
    $mime_types['css'] = 'text/css';
    return $mime_types;
}
add_filter('mime_types', 'bic_correct_mime_type');

/**
 * Force correct content type for CSS files
 */
function bic_force_css_content_type() {
    // If this is our plugin's CSS file
    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/base-insurance-calculator/public/css/') !== false) {
        if (substr($_SERVER['REQUEST_URI'], -4) === '.css') {
            header('Content-Type: text/css');
        }
    }
}
add_action('init', 'bic_force_css_content_type', 1);

/**
 * Add type="text/css" attribute to our plugin's stylesheet
 */
function bic_fix_style_tag($tag, $handle, $src, $media) {
    if ($handle === 'bic-calculator-style') {
        $tag = '<link rel="stylesheet" id="' . esc_attr($handle) . '-css" href="' . esc_url($src) . '" type="text/css" media="' . esc_attr($media) . '" />';
    }
    return $tag;
}
add_filter('style_loader_tag', 'bic_fix_style_tag', 10, 4);

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
 * Direct CSS file loader (for handling CSS file requests directly)
 */
function bic_direct_css_loader() {
    // Check if this is a request for our plugin's CSS
    if (isset($_GET['bic_css']) && $_GET['bic_css'] === '1') {
        // Verify nonce if provided
        if (isset($_GET['nonce'])) {
            $nonce_verified = wp_verify_nonce($_GET['nonce'], 'bic_css_nonce');
            if (!$nonce_verified) {
                status_header(403);
                exit('Access denied');
            }
        }
        
        $css_file_path = BIC_PLUGIN_DIR . 'public/css/styles.css';
        if (file_exists($css_file_path)) {
            header('Content-Type: text/css');
            header('Cache-Control: max-age=86400');
            readfile($css_file_path);
            exit;
        }
    }
}
add_action('init', 'bic_direct_css_loader', 0);

/**
 * Register the shortcode for displaying the calculator
 */
function bic_calculator_shortcode($atts) {
    // Get site URL for direct CSS loading with nonce
    $css_nonce = wp_create_nonce('bic_css_nonce');
    $direct_css_url = add_query_arg(array('bic_css' => '1', 'nonce' => $css_nonce), site_url());
    
    // Enqueue necessary scripts and styles
    wp_enqueue_style('bic-calculator-style', BIC_PLUGIN_URL . 'public/css/styles.css', array(), BIC_VERSION);
    
    // Add inline CSS fallback in case the external CSS fails to load
    $css_file_path = BIC_PLUGIN_DIR . 'public/css/styles.css';
    if (file_exists($css_file_path)) {
        $inline_css = file_get_contents($css_file_path);
        wp_add_inline_style('bic-calculator-style', $inline_css);
    }
    
    // Add a CSS fallback script in case the main CSS fails to load
    wp_add_inline_script('jquery', '
        jQuery(document).ready(function($) {
            // Check if main CSS is loaded
            var styleLoaded = false;
            $("link").each(function() {
                if ($(this).attr("href") && $(this).attr("href").indexOf("styles.css") > -1) {
                    styleLoaded = true;
                }
            });
            
            // If not loaded, add direct CSS link
            if (!styleLoaded) {
                $("head").append("<link rel=\'stylesheet\' type=\'text/css\' href=\'' . esc_url($direct_css_url) . '\' />");
            }
        });
    ');
    
    wp_enqueue_script('bic-calculator-js', BIC_PLUGIN_URL . 'public/js/calculator.js', array('jquery'), BIC_VERSION, true);
    wp_enqueue_script('bic-ui-js', BIC_PLUGIN_URL . 'public/js/ui.js', array('jquery', 'bic-calculator-js'), BIC_VERSION, true);
    wp_enqueue_script('bic-app-js', BIC_PLUGIN_URL . 'public/js/app.js', array('jquery', 'bic-ui-js'), BIC_VERSION, true);
    
    // Localize script to add WordPress AJAX URL
    wp_localize_script('bic-calculator-js', 'bicAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('bic_submission_nonce')
    ));
    
    // Return calculator HTML
    ob_start();
    include BIC_PLUGIN_DIR . 'public/partials/calculator-display.php';
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
        $advisor_id = bic_find_nearest_advisor($data['location']['state'], $data['location']['zipCode']);
        
        if ($advisor_id) {
            // Update submission with advisor id
            $wpdb->update(
                $wpdb->prefix . 'bic_submissions',
                array('advisor_id' => $advisor_id),
                array('id' => $submission_id)
            );
            
            // Get advisor info
            $advisor = $wpdb->get_row($wpdb->prepare(
                "SELECT name, email FROM {$wpdb->prefix}bic_advisors WHERE id = %d",
                $advisor_id
            ));
            
            if ($advisor) {
                // Send email notification to advisor
                bic_notify_advisor($advisor_id, $submission_id, $data);
                
                // Send email notification to submitter
                bic_notify_submitter($data, $advisor, $submission_id);
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
 * Find the nearest advisor based on state/zip
 */
function bic_find_nearest_advisor($state, $zip) {
    global $wpdb;
    
    // Simple implementation - find advisors who have this state in their territories
    $advisors = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT id, territories FROM {$wpdb->prefix}bic_advisors WHERE territories LIKE %s ORDER BY id ASC",
            '%' . $state . '%'
        )
    );
    
    foreach ($advisors as $advisor) {
        $territories = json_decode($advisor->territories, true);
        
        // If this advisor covers the state
        if (isset($territories[$state])) {
            // Check if they cover all zips or this specific zip
            if ($territories[$state] === '*' || 
                (is_array($territories[$state]) && in_array($zip, $territories[$state]))) {
                return $advisor->id;
            }
        }
    }
    
    // Return first advisor as fallback or null if none found
    $first_advisor = $wpdb->get_var("SELECT id FROM {$wpdb->prefix}bic_advisors ORDER BY id ASC LIMIT 1");
    return $first_advisor;
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
    
    wp_send_json_success();
}
add_action('wp_ajax_bic_save_settings', 'bic_save_settings'); 