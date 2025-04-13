<?php
/**
 * Test script for round-robin advisor assignment functionality
 * 
 * This script:
 * 1. Creates two test advisors assigned to zip code 99502
 * 2. Simulates 5 submissions with zip code 99502
 * 3. Verifies the round-robin assignment is working correctly
 * 
 * IMPORTANT: This is only for testing in a development environment.
 * DO NOT run this script on a production site as it adds test data to your database.
 */

// Load WordPress with admin privileges
require_once dirname(__DIR__) . '/../../../wp-load.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';

// Verify admin privileges to prevent unauthorized use
if (!current_user_can('manage_options')) {
    die('You need admin privileges to run this test.');
}

// Function to create a test advisor
function create_test_advisor($name, $email, $territory_data) {
    global $wpdb;
    
    // Check if advisor already exists
    $existing = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}bic_advisors WHERE email = %s",
            $email
        )
    );
    
    if ($existing) {
        echo "Advisor {$name} already exists with ID {$existing}.<br>";
        return $existing;
    }
    
    // Insert advisor
    $wpdb->insert(
        $wpdb->prefix . 'bic_advisors',
        array(
            'name' => $name,
            'email' => $email,
            'territories' => json_encode($territory_data)
        )
    );
    
    $advisor_id = $wpdb->insert_id;
    echo "Created test advisor: {$name} (ID: {$advisor_id}).<br>";
    
    return $advisor_id;
}

// Function to create a test submission
function create_test_submission($first_name, $last_name, $state, $zip_code) {
    global $wpdb;
    
    // Mock calculation results
    $calculation_results = array(
        'recommendedCoverage' => rand(100000, 1000000),
        'breakdown' => array(
            'income_replacement' => rand(50000, 500000),
            'mortgage' => rand(10000, 300000),
            'debt' => rand(5000, 50000),
            'education' => rand(0, 100000),
            'final_expenses' => rand(10000, 30000)
        )
    );
    
    // Create submission without assigning advisor
    $wpdb->insert(
        $wpdb->prefix . 'bic_submissions',
        array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => strtolower($first_name) . '.' . strtolower($last_name) . '@example.com',
            'phone' => '555-' . rand(100, 999) . '-' . rand(1000, 9999),
            'age' => rand(25, 65),
            'gender' => (rand(0, 1) == 1) ? 'Male' : 'Female',
            'zipcode' => $zip_code,
            'state' => $state,
            'county' => 'Test County',
            'calculation_results' => json_encode($calculation_results),
            'timestamp' => current_time('mysql'),
            'status' => 'new'
        )
    );
    
    $submission_id = $wpdb->insert_id;
    echo "Created test submission for {$first_name} {$last_name} (ID: {$submission_id}).<br>";
    
    return $submission_id;
}

// Function to find the nearest advisor and update submission
function assign_advisor_to_submission($submission_id, $state, $zip_code) {
    global $wpdb;
    
    // Load the advisor finding function from the plugin
    if (!function_exists('bic_find_nearest_advisor')) {
        require_once dirname(__DIR__) . '/base-insurance-calculator.php';
    }
    
    // Find nearest advisor using the plugin's function
    $advisor = bic_find_nearest_advisor($state, $zip_code);
    
    if ($advisor) {
        // Update submission with advisor id
        $wpdb->update(
            $wpdb->prefix . 'bic_submissions',
            array('advisor_id' => $advisor->id),
            array('id' => $submission_id)
        );
        
        echo "Assigned advisor {$advisor->name} (ID: {$advisor->id}) to submission {$submission_id}.<br>";
        return $advisor->id;
    } else {
        echo "No advisor found for submission {$submission_id}.<br>";
        return null;
    }
}

// Start the test
echo '<h1>Testing Round-Robin Advisor Assignment</h1>';
echo '<h2>Step 1: Reset the round-robin counter</h2>';

// Reset the round-robin counter
update_option('bic_last_assigned_index', 0);
echo "Reset round-robin counter to 0.<br>";

// Set the assignment method to round-robin
update_option('bic_assignment_method', 'round-robin');
echo "Set assignment method to 'round-robin'.<br>";

echo '<h2>Step 2: Create test advisors</h2>';

// Create two test advisors with zip code 99502
$advisor1_id = create_test_advisor(
    'Test Advisor 1',
    'testadvisor1@example.com',
    array('AK' => array('99502'))
);

$advisor2_id = create_test_advisor(
    'Test Advisor 2',
    'testadvisor2@example.com',
    array('AK' => array('99502'))
);

echo '<h2>Step 3: Create test submissions and assign advisors</h2>';

// Simulate 5 submissions with round-robin assignment
$assigned_advisors = array();

$test_names = array(
    array('John', 'Doe'),
    array('Jane', 'Smith'),
    array('Michael', 'Johnson'),
    array('Sarah', 'Williams'),
    array('David', 'Brown')
);

foreach ($test_names as $name) {
    $first_name = $name[0];
    $last_name = $name[1];
    
    $submission_id = create_test_submission($first_name, $last_name, 'AK', '99502');
    $advisor_id = assign_advisor_to_submission($submission_id, 'AK', '99502');
    
    if ($advisor_id) {
        $assigned_advisors[] = $advisor_id;
    }
}

echo '<h2>Step 4: Verify round-robin assignment</h2>';

// Count assignments
$advisor1_count = array_count_values($assigned_advisors)[$advisor1_id] ?? 0;
$advisor2_count = array_count_values($assigned_advisors)[$advisor2_id] ?? 0;

echo "Advisor 1 (ID: {$advisor1_id}) assigned to {$advisor1_count} submissions.<br>";
echo "Advisor 2 (ID: {$advisor2_id}) assigned to {$advisor2_count} submissions.<br>";

// Check if round-robin is working
$expected_max_difference = 1; // Due to round-robin, the difference should be at most 1
$actual_difference = abs($advisor1_count - $advisor2_count);

if ($actual_difference <= $expected_max_difference) {
    echo '<div style="color: green; font-weight: bold;">PASS: Round-robin assignment is working correctly!</div>';
} else {
    echo '<div style="color: red; font-weight: bold;">FAIL: Round-robin assignment is not working correctly. Difference in assignments is greater than expected.</div>';
}

echo '<h2>Current assignment index</h2>';
echo "Current round-robin index: " . get_option('bic_last_assigned_index', 'not set');

echo '<h2>Test Submissions in Database</h2>';
$submissions = $wpdb->get_results("
    SELECT s.id, s.first_name, s.last_name, s.zipcode, s.state, a.name as advisor_name, a.id as advisor_id
    FROM {$wpdb->prefix}bic_submissions s
    LEFT JOIN {$wpdb->prefix}bic_advisors a ON s.advisor_id = a.id
    WHERE s.zipcode = '99502'
    ORDER BY s.id DESC
    LIMIT 10
");

if ($submissions) {
    echo '<table border="1" cellpadding="5" cellspacing="0">';
    echo '<tr><th>ID</th><th>Name</th><th>Location</th><th>Assigned Advisor</th></tr>';
    
    foreach ($submissions as $submission) {
        echo '<tr>';
        echo "<td>{$submission->id}</td>";
        echo "<td>{$submission->first_name} {$submission->last_name}</td>";
        echo "<td>{$submission->state} {$submission->zipcode}</td>";
        echo "<td>{$submission->advisor_name} (ID: {$submission->advisor_id})</td>";
        echo '</tr>';
    }
    
    echo '</table>';
} else {
    echo 'No submissions found.';
} 