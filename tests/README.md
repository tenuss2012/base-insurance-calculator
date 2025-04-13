# Base Insurance Calculator Test Scripts

This directory contains test scripts for validating functionality of the Base Insurance Calculator plugin.

## Test Round-Robin Advisor Assignment

The `test-round-robin.php` script allows you to test the round-robin advisor assignment functionality with simulated data.

### What This Test Does

1. Creates two test advisors assigned to zip code 99502
2. Simulates 5 submissions with zip code 99502
3. Verifies the round-robin assignment is working correctly by:
   - Checking that assignments are distributed evenly between the two advisors
   - Displaying a table of all test submissions and their assigned advisors

### How to Run the Test

**⚠️ IMPORTANT: Only run this test in a development environment. It will create test data in your database.**

1. Make sure WordPress is installed and the Base Insurance Calculator plugin is activated
2. Navigate to the test script in your browser:
   ```
   https://your-dev-site.com/wp-content/plugins/base-insurance-calculator/tests/test-round-robin.php
   ```
3. You must be logged in as an administrator to run the test

### Expected Results

If the round-robin assignment is working correctly:
- Each advisor should receive approximately the same number of assignments
- The difference between the number of assignments should be at most 1
- The test will display "PASS" if the distribution is as expected

### Cleaning Up Test Data

We've provided a cleanup script to help you remove test data after running the tests:

1. Navigate to the cleanup script in your browser:
   ```
   https://your-dev-site.com/wp-content/plugins/base-insurance-calculator/tests/cleanup-test-data.php
   ```
2. The script will:
   - Remove all test submissions with emails ending in @example.com
   - Remove test advisors with "Test Advisor" in their name
   - Reset the round-robin counter to 0

Alternatively, you can manually clean up the data:

1. Go to your WordPress admin panel
2. Navigate to Base Insurance > Submissions
3. Delete the test submissions (they will have emails ending with @example.com)
4. Navigate to Base Insurance > Advisors
5. Delete the test advisors (Test Advisor 1 and Test Advisor 2)

### Troubleshooting

If the test fails:
1. Check that you've correctly implemented the updated `bic_find_nearest_advisor()` function
2. Verify that both test advisors are being correctly created with the same territory
3. Examine the database tables to ensure data is being stored in the expected format 