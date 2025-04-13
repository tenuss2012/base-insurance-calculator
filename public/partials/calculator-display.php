<div class="bic-calculator-container">
    <?php /* Title/logo hidden as requested */ ?>
    
    <div class="calculator-wizard" id="calculatorWizard">
        <div class="wizard-card">
            <div class="wizard-header" id="wizardHeader">
                <!-- Step indicator will be inserted here -->
            </div>
            
            <div class="wizard-content" id="wizardContent">
                <!-- Steps will be inserted here -->
            </div>
            
            <div class="wizard-footer" id="wizardFooter">
                <!-- Navigation buttons will be inserted here -->
            </div>
        </div>
    </div>
    
    <div class="results-page" id="resultsPage" style="display: none;">
        <!-- Results will be inserted here -->
    </div>
</div>

<script type="text/javascript">
    // Update the calculator to work with WordPress
    document.addEventListener('DOMContentLoaded', function() {
        // Override the submission functionality to use WordPress AJAX
        if (typeof calculatorActions !== 'undefined') {
            // Store original calculate results function
            const originalCalculateResults = calculatorActions.calculateResults;
            
            // Override with AJAX submission
            calculatorActions.calculateResults = function() {
                // First call the original function to perform calculations
                originalCalculateResults();
                
                // Then save the submission to WordPress
                const submissionData = JSON.stringify(calculatorState);
                
                // Make AJAX request
                const xhr = new XMLHttpRequest();
                xhr.open('POST', bicAjax.ajaxurl, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        
                        if (response.success) {
                            // Add submission ID to results
                            calculatorState.results.submissionId = response.data.submission_id;
                        } else {
                            // Handle error
                            console.error('Submission error:', response.data);
                        }
                    } else {
                        console.error('AJAX error. Status:', xhr.status);
                    }
                };
                
                xhr.onerror = function() {
                    console.error('AJAX request failed');
                };
                
                // Send the data
                const data = 'action=bic_submission&nonce=' + bicAjax.nonce + '&submission_data=' + encodeURIComponent(submissionData);
                xhr.send(data);
            };
        }
        
        // Initialize the calculator
        if (typeof renderCurrentStep === 'function') {
            renderCurrentStep();
            document.body.classList.add('calculator-loaded');
        } else {
            console.error('Calculator initialization failed: required functions not found');
        }
    });
</script> 