<?php
/**
 * The admin-specific functionality of the plugin.
 */
class BIC_Admin {

    /**
     * Initialize the class and set its properties.
     */
    public function __construct() {
        // Add admin menu
        add_action('admin_menu', array($this, 'add_plugin_admin_menu'));
        
        // Add admin scripts and styles
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        // Add AJAX handlers for admin actions
        add_action('wp_ajax_bic_get_submissions', array($this, 'ajax_get_submissions'));
        add_action('wp_ajax_bic_update_submission', array($this, 'ajax_update_submission'));
        add_action('wp_ajax_bic_delete_submission', array($this, 'ajax_delete_submission'));
        add_action('wp_ajax_bic_save_advisor', array($this, 'ajax_save_advisor'));
        add_action('wp_ajax_bic_delete_advisor', array($this, 'ajax_delete_advisor'));
    }

    /**
     * Register the admin menu for the plugin.
     */
    public function add_plugin_admin_menu() {
        // Add main menu
        add_menu_page(
            'Base Insurance Calculator', 
            'Insurance Calc', 
            'manage_options', 
            'bic-dashboard', 
            array($this, 'display_dashboard_page'),
            'dashicons-calculator',
            25
        );
        
        // Add submenu pages
        add_submenu_page(
            'bic-dashboard',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'bic-dashboard',
            array($this, 'display_dashboard_page')
        );
        
        add_submenu_page(
            'bic-dashboard',
            'Submissions',
            'Submissions',
            'manage_options',
            'bic-submissions',
            array($this, 'display_submissions_page')
        );
        
        add_submenu_page(
            'bic-dashboard',
            'Advisors',
            'Advisors',
            'manage_options',
            'bic-advisors',
            array($this, 'display_advisors_page')
        );
        
        add_submenu_page(
            'bic-dashboard',
            'Settings',
            'Settings',
            'manage_options',
            'bic-settings',
            array($this, 'display_settings_page')
        );
    }

    /**
     * Enqueue admin scripts and styles.
     */
    public function enqueue_admin_scripts($hook) {
        // Only load on plugin admin pages
        if (strpos($hook, 'bic-') === false) {
            return;
        }
        
        wp_enqueue_style('bic-admin-styles', BIC_PLUGIN_URL . 'admin/css/admin.css', array(), BIC_VERSION);
        wp_enqueue_script('bic-admin-script', BIC_PLUGIN_URL . 'admin/js/admin.js', array('jquery'), BIC_VERSION, true);
        
        // Add data for the JavaScript
        wp_localize_script('bic-admin-script', 'bicAdmin', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('bic_admin_nonce')
        ));
    }

    /**
     * Display the dashboard page.
     */
    public function display_dashboard_page() {
        global $wpdb;
        
        // Get counts for dashboard widgets
        $total_submissions = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}bic_submissions");
        $new_submissions = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}bic_submissions WHERE status = 'new'");
        $total_advisors = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}bic_advisors");
        
        // Get recent submissions
        $recent_submissions = $wpdb->get_results(
            "SELECT id, first_name, last_name, email, zipcode, state, timestamp, status 
             FROM {$wpdb->prefix}bic_submissions 
             ORDER BY timestamp DESC 
             LIMIT 5"
        );
        
        // Include dashboard template
        include_once BIC_PLUGIN_DIR . 'admin/partials/dashboard.php';
    }

    /**
     * Display the submissions page.
     */
    public function display_submissions_page() {
        global $wpdb;
        
        // Check if viewing a single submission
        if (isset($_GET['id']) && is_numeric($_GET['id'])) {
            $submission_id = intval($_GET['id']);
            $submission = $wpdb->get_row($wpdb->prepare(
                "SELECT s.*, a.name as advisor_name, a.email as advisor_email
                 FROM {$wpdb->prefix}bic_submissions s
                 LEFT JOIN {$wpdb->prefix}bic_advisors a ON s.advisor_id = a.id
                 WHERE s.id = %d",
                $submission_id
            ));
            
            if ($submission) {
                include_once BIC_PLUGIN_DIR . 'admin/partials/submission-detail.php';
                return;
            }
        }
        
        // Get filters
        $status_filter = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        $search_term = isset($_GET['search']) ? sanitize_text_field($_GET['search']) : '';
        
        // Build query
        $query = "SELECT s.*, a.name as advisor_name
                 FROM {$wpdb->prefix}bic_submissions s
                 LEFT JOIN {$wpdb->prefix}bic_advisors a ON s.advisor_id = a.id";
        
        $where_clauses = array();
        
        if (!empty($status_filter)) {
            $where_clauses[] = $wpdb->prepare("s.status = %s", $status_filter);
        }
        
        if (!empty($search_term)) {
            $where_clauses[] = $wpdb->prepare(
                "(s.first_name LIKE %s OR s.last_name LIKE %s OR s.email LIKE %s OR s.zipcode LIKE %s)",
                "%{$search_term}%", "%{$search_term}%", "%{$search_term}%", "%{$search_term}%"
            );
        }
        
        if (!empty($where_clauses)) {
            $query .= " WHERE " . implode(" AND ", $where_clauses);
        }
        
        $query .= " ORDER BY s.timestamp DESC";
        
        // Get submissions
        $submissions = $wpdb->get_results($query);
        
        // Include submissions template
        include_once BIC_PLUGIN_DIR . 'admin/partials/submissions.php';
    }

    /**
     * Display the advisors page.
     */
    public function display_advisors_page() {
        global $wpdb;
        
        // Check if viewing a single advisor
        if (isset($_GET['id']) && is_numeric($_GET['id'])) {
            $advisor_id = intval($_GET['id']);
            $advisor = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}bic_advisors WHERE id = %d",
                $advisor_id
            ));
            
            // Get all states for dropdown
            $states = array(
                'AL'=>'Alabama', 'AK'=>'Alaska', 'AZ'=>'Arizona', 'AR'=>'Arkansas', 
                'CA'=>'California', 'CO'=>'Colorado', 'CT'=>'Connecticut', 'DE'=>'Delaware',
                'DC'=>'District of Columbia', 'FL'=>'Florida', 'GA'=>'Georgia', 'HI'=>'Hawaii',
                'ID'=>'Idaho', 'IL'=>'Illinois', 'IN'=>'Indiana', 'IA'=>'Iowa', 'KS'=>'Kansas',
                'KY'=>'Kentucky', 'LA'=>'Louisiana', 'ME'=>'Maine', 'MD'=>'Maryland', 
                'MA'=>'Massachusetts', 'MI'=>'Michigan', 'MN'=>'Minnesota', 'MS'=>'Mississippi',
                'MO'=>'Missouri', 'MT'=>'Montana', 'NE'=>'Nebraska', 'NV'=>'Nevada',
                'NH'=>'New Hampshire', 'NJ'=>'New Jersey', 'NM'=>'New Mexico', 'NY'=>'New York',
                'NC'=>'North Carolina', 'ND'=>'North Dakota', 'OH'=>'Ohio', 'OK'=>'Oklahoma',
                'OR'=>'Oregon', 'PA'=>'Pennsylvania', 'RI'=>'Rhode Island', 'SC'=>'South Carolina',
                'SD'=>'South Dakota', 'TN'=>'Tennessee', 'TX'=>'Texas', 'UT'=>'Utah',
                'VT'=>'Vermont', 'VA'=>'Virginia', 'WA'=>'Washington', 'WV'=>'West Virginia',
                'WI'=>'Wisconsin', 'WY'=>'Wyoming'
            );
            
            include_once BIC_PLUGIN_DIR . 'admin/partials/advisor-edit.php';
            return;
        }
        
        // If adding new advisor
        if (isset($_GET['action']) && $_GET['action'] === 'new') {
            // Get all states for dropdown
            $states = array(
                'AL'=>'Alabama', 'AK'=>'Alaska', 'AZ'=>'Arizona', 'AR'=>'Arkansas', 
                'CA'=>'California', 'CO'=>'Colorado', 'CT'=>'Connecticut', 'DE'=>'Delaware',
                'DC'=>'District of Columbia', 'FL'=>'Florida', 'GA'=>'Georgia', 'HI'=>'Hawaii',
                'ID'=>'Idaho', 'IL'=>'Illinois', 'IN'=>'Indiana', 'IA'=>'Iowa', 'KS'=>'Kansas',
                'KY'=>'Kentucky', 'LA'=>'Louisiana', 'ME'=>'Maine', 'MD'=>'Maryland', 
                'MA'=>'Massachusetts', 'MI'=>'Michigan', 'MN'=>'Minnesota', 'MS'=>'Mississippi',
                'MO'=>'Missouri', 'MT'=>'Montana', 'NE'=>'Nebraska', 'NV'=>'Nevada',
                'NH'=>'New Hampshire', 'NJ'=>'New Jersey', 'NM'=>'New Mexico', 'NY'=>'New York',
                'NC'=>'North Carolina', 'ND'=>'North Dakota', 'OH'=>'Ohio', 'OK'=>'Oklahoma',
                'OR'=>'Oregon', 'PA'=>'Pennsylvania', 'RI'=>'Rhode Island', 'SC'=>'South Carolina',
                'SD'=>'South Dakota', 'TN'=>'Tennessee', 'TX'=>'Texas', 'UT'=>'Utah',
                'VT'=>'Vermont', 'VA'=>'Virginia', 'WA'=>'Washington', 'WV'=>'West Virginia',
                'WI'=>'Wisconsin', 'WY'=>'Wyoming'
            );
            
            include_once BIC_PLUGIN_DIR . 'admin/partials/advisor-edit.php';
            return;
        }
        
        // Get all advisors
        $advisors = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}bic_advisors ORDER BY name ASC");
        
        // Include advisors template
        include_once BIC_PLUGIN_DIR . 'admin/partials/advisors.php';
    }

    /**
     * Display the settings page.
     */
    public function display_settings_page() {
        // Get current settings
        $email_subject = get_option('bic_email_subject', 'New Insurance Calculator Submission');
        $email_template = get_option('bic_email_template', '');
        
        // Include settings template
        include_once BIC_PLUGIN_DIR . 'admin/partials/settings.php';
    }

    /**
     * AJAX handler for getting submissions
     */
    public function ajax_get_submissions() {
        check_ajax_referer('bic_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to do this');
        }
        
        global $wpdb;
        
        $submissions = $wpdb->get_results(
            "SELECT s.*, a.name as advisor_name
             FROM {$wpdb->prefix}bic_submissions s
             LEFT JOIN {$wpdb->prefix}bic_advisors a ON s.advisor_id = a.id
             ORDER BY s.timestamp DESC"
        );
        
        wp_send_json_success(array('submissions' => $submissions));
    }

    /**
     * AJAX handler for updating a submission
     */
    public function ajax_update_submission() {
        check_ajax_referer('bic_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to do this');
        }
        
        $submission_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $status = isset($_POST['status']) ? sanitize_text_field($_POST['status']) : '';
        $advisor_id = isset($_POST['advisor_id']) ? intval($_POST['advisor_id']) : 0;
        
        if (!$submission_id) {
            wp_send_json_error('Invalid submission ID');
        }
        
        global $wpdb;
        
        $data = array();
        $where = array('id' => $submission_id);
        
        if (!empty($status)) {
            $data['status'] = $status;
        }
        
        if ($advisor_id) {
            $data['advisor_id'] = $advisor_id;
        }
        
        if (empty($data)) {
            wp_send_json_error('No data to update');
        }
        
        $result = $wpdb->update($wpdb->prefix . 'bic_submissions', $data, $where);
        
        if ($result !== false) {
            wp_send_json_success();
        } else {
            wp_send_json_error('Failed to update submission');
        }
    }

    /**
     * AJAX handler for deleting a submission
     */
    public function ajax_delete_submission() {
        check_ajax_referer('bic_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to do this');
        }
        
        $submission_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if (!$submission_id) {
            wp_send_json_error('Invalid submission ID');
        }
        
        global $wpdb;
        
        $result = $wpdb->delete(
            $wpdb->prefix . 'bic_submissions',
            array('id' => $submission_id)
        );
        
        if ($result !== false) {
            wp_send_json_success();
        } else {
            wp_send_json_error('Failed to delete submission');
        }
    }

    /**
     * AJAX handler for saving an advisor
     */
    public function ajax_save_advisor() {
        check_ajax_referer('bic_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to do this');
        }
        
        $advisor_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';
        $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
        $territories = isset($_POST['territories']) ? stripslashes($_POST['territories']) : '';
        
        if (empty($name) || empty($email)) {
            wp_send_json_error('Name and email are required');
        }
        
        // Validate territories JSON
        $territories_array = json_decode($territories, true);
        if ($territories && json_last_error() !== JSON_ERROR_NONE) {
            wp_send_json_error('Invalid territories format');
        }
        
        global $wpdb;
        
        $data = array(
            'name' => $name,
            'email' => $email,
            'territories' => $territories
        );
        
        if ($advisor_id) {
            // Update existing
            $result = $wpdb->update(
                $wpdb->prefix . 'bic_advisors',
                $data,
                array('id' => $advisor_id)
            );
        } else {
            // Insert new
            $result = $wpdb->insert(
                $wpdb->prefix . 'bic_advisors',
                $data
            );
            $advisor_id = $wpdb->insert_id;
        }
        
        if ($result !== false) {
            wp_send_json_success(array('id' => $advisor_id));
        } else {
            wp_send_json_error('Failed to save advisor');
        }
    }

    /**
     * AJAX handler for deleting an advisor
     */
    public function ajax_delete_advisor() {
        check_ajax_referer('bic_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to do this');
        }
        
        $advisor_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if (!$advisor_id) {
            wp_send_json_error('Invalid advisor ID');
        }
        
        global $wpdb;
        
        // First, update any submissions with this advisor to NULL
        $wpdb->update(
            $wpdb->prefix . 'bic_submissions',
            array('advisor_id' => null),
            array('advisor_id' => $advisor_id)
        );
        
        // Then delete the advisor
        $result = $wpdb->delete(
            $wpdb->prefix . 'bic_advisors',
            array('id' => $advisor_id)
        );
        
        if ($result !== false) {
            wp_send_json_success();
        } else {
            wp_send_json_error('Failed to delete advisor');
        }
    }
} 