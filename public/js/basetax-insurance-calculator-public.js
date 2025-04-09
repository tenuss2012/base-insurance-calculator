/**
 * Public-facing JavaScript for the insurance calculator
 */
(function($) {
    'use strict';

    $(document).ready(function() {
        // Variables
        let personCount = 1;
        
        // Add person button functionality
        $('.basetax-add-person').on('click', function() {
            personCount++;
            const newPersonRow = `
                <div class="basetax-person-row">
                    <div class="person-age">
                        <label for="person-age-${personCount}">Person ${personCount} Age</label>
                        <input type="number" id="person-age-${personCount}" name="ages[]" min="0" max="120" required>
                    </div>
                    <div class="remove-person" data-person="${personCount}">×</div>
                </div>
            `;
            
            $(this).before(newPersonRow);
            updateHouseholdSize();
        });
        
        // Remove person functionality (delegated event)
        $('.basetax-calculator-form').on('click', '.remove-person', function() {
            $(this).closest('.basetax-person-row').remove();
            updateHouseholdSize();
        });
        
        // Update household size automatically
        function updateHouseholdSize() {
            const personCount = $('.basetax-person-row').length;
            $('#household-size').val(personCount);
        }
        
        // Handle form submission
        $('.basetax-calculator-form').on('submit', function(e) {
            e.preventDefault();
            
            // Show loading spinner
            $('.basetax-error-message').hide();
            $('.basetax-loading').show();
            $('.basetax-results-container').hide();
            
            // Collect form data
            const formData = $(this).serializeArray();
            formData.push({
                name: 'action',
                value: 'basetax_calculate_insurance'
            });
            formData.push({
                name: 'nonce',
                value: basetaxCalculator.nonce
            });
            
            // Send AJAX request
            $.ajax({
                url: basetaxCalculator.ajaxurl,
                type: 'POST',
                data: formData,
                success: function(response) {
                    $('.basetax-loading').hide();
                    
                    if (response.success) {
                        displayResults(response.data);
                    } else {
                        $('.basetax-error-message').text(response.data.message).show();
                    }
                },
                error: function() {
                    $('.basetax-loading').hide();
                    $('.basetax-error-message').text('An error occurred. Please try again.').show();
                }
            });
        });
        
        // Handle metal tier tab switching
        $('.basetax-tier-tabs').on('click', '.basetax-tier-tab', function() {
            const tier = $(this).data('tier');
            
            // Update active tab
            $('.basetax-tier-tab').removeClass('active');
            $(this).addClass('active');
            
            // Show corresponding content
            $('.basetax-tier-content').removeClass('active');
            $(`.basetax-tier-content[data-tier="${tier}"]`).addClass('active');
        });
        
        // Display calculation results
        function displayResults(results) {
            // Populate result sections for each tier
            ['bronze', 'silver', 'gold', 'platinum'].forEach(function(tier) {
                const tierData = results[tier];
                const $tierSection = $(`.basetax-tier-content[data-tier="${tier}"]`);
                
                // Update price
                $tierSection.find('.basetax-original-price').text('$' + tierData.monthly_premium.toFixed(2));
                $tierSection.find('.basetax-subsidized-price').text('$' + tierData.subsidized_premium.toFixed(2));
                
                // Update coverage summary
                $tierSection.find('.basetax-coverage-details p').text(tierData.coverage_summary);
            });
            
            // Subsidy information
            if (results.subsidy_eligible) {
                $('.basetax-subsidy-amount').text('$' + results.subsidy_amount.toFixed(2));
                $('.basetax-subsidy-info').show();
            } else {
                $('.basetax-subsidy-info').hide();
            }
            
            // Set disclaimer
            $('.basetax-disclaimer').text(results.disclaimer);
            
            // Show results container and activate the preferred tier tab
            $('.basetax-results-container').show();
            
            // Get selected coverage level and activate that tab
            const selectedTier = $('#coverage-level').val();
            $(`.basetax-tier-tab[data-tier="${selectedTier}"]`).trigger('click');
            
            // Scroll to results
            $('html, body').animate({
                scrollTop: $('.basetax-results-container').offset().top - 50
            }, 500);
        }
    });

})(jQuery);