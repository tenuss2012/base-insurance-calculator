<?php
/**
 * Clean up test data created by test-round-robin.php
 * 
 * This script removes:
 * 1. Test submissions with emails ending in @example.com
 * 2. Test advisors (Test Advisor 1 and Test Advisor 2)
 * 
 * IMPORTANT: Only run this in a development environment.
 */

// Load WordPress with admin privileges
require_once dirname(__DIR__) . '/../../../wp-load.php';

// Verify admin privileges to prevent unauthorized use
if (!current_user_can('manage_options')) {
    die('You need admin privileges to run this script.');
}

global $wpdb;

// Start the cleanup
echo '<h1>Cleaning Up Test Data</h1>';

// 1. Remove test submissions with emails ending in @example.com
$deleted_submissions = $wpdb->query(
    "DELETE FROM {$wpdb->prefix}bic_submissions WHERE email LIKE '%@example.com'"
);
echo "<p>Removed {$deleted_submissions} test submissions.</p>";

// 2. Remove test advisors
$test_advisors = $wpdb->get_results(
    "SELECT id, name FROM {$wpdb->prefix}bic_advisors 
     WHERE name LIKE 'Test Advisor%' OR email LIKE '%@example.com'"
);

if ($test_advisors) {
    echo "<p>Removing test advisors:</p>";
    echo "<ul>";
    
    foreach ($test_advisors as $advisor) {
        $wpdb->delete(
            $wpdb->prefix . 'bic_advisors',
            array('id' => $advisor->id)
        );
        echo "<li>Removed: {$advisor->name} (ID: {$advisor->id})</li>";
    }
    
    echo "</ul>";
} else {
    echo "<p>No test advisors found.</p>";
}

// 3. Reset the round-robin counter
update_option('bic_last_assigned_index', 0);
echo "<p>Reset round-robin counter to 0.</p>";

echo '<h2>Cleanup Complete</h2>';
echo '<p><a href="test-round-robin.php">Run the round-robin test again</a></p>'; 