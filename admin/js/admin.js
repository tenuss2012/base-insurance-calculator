/**
 * Base Insurance Calculator - Admin JavaScript
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize tabs if available
        if ($('.bic-tabs-nav').length) {
            initTabs();
        }

        // Status change handler
        $(document).on('change', '.bic-status-select', function() {
            const submissionId = $(this).data('id');
            const newStatus = $(this).val();
            
            updateSubmissionStatus(submissionId, newStatus);
        });

        // Advisor assignment handler
        $(document).on('change', '.bic-advisor-select', function() {
            const submissionId = $(this).data('id');
            const advisorId = $(this).val();
            
            updateSubmissionAdvisor(submissionId, advisorId);
        });

        // Delete submission handler
        $(document).on('click', '.bic-delete-submission', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to delete this submission? This cannot be undone.')) {
                const submissionId = $(this).data('id');
                deleteSubmission(submissionId);
            }
        });

        // Territory management
        if ($('#bic-territories-container').length) {
            initTerritoryManager();
        }

        // Save advisor form
        $('#bic-advisor-form').on('submit', function(e) {
            e.preventDefault();
            saveAdvisor();
        });

        // Save settings form
        $('#bic-settings-form').on('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    });

    /**
     * Initialize tab navigation
     */
    function initTabs() {
        const $tabsNav = $('.bic-tabs-nav');
        const $tabsContent = $('.bic-tabs-content');
        
        // Initial active tab
        const initialTab = $tabsNav.find('a.active').attr('href');
        $tabsContent.find(initialTab).addClass('active');
        
        // Tab click handling
        $tabsNav.find('a').on('click', function(e) {
            e.preventDefault();
            
            const targetTab = $(this).attr('href');
            
            // Update active state
            $tabsNav.find('a').removeClass('active');
            $(this).addClass('active');
            
            // Show target tab content
            $tabsContent.find('.tab-pane').removeClass('active');
            $tabsContent.find(targetTab).addClass('active');
        });
    }

    /**
     * Update submission status
     */
    function updateSubmissionStatus(submissionId, status) {
        $.ajax({
            url: bicAdmin.ajaxurl,
            type: 'POST',
            data: {
                action: 'bic_update_submission',
                nonce: bicAdmin.nonce,
                id: submissionId,
                status: status
            },
            success: function(response) {
                if (response.success) {
                    // Show success message
                    const $statusCell = $('.bic-status-cell-' + submissionId);
                    $statusCell.find('.bic-status')
                        .removeClass('bic-status-new bic-status-contacted bic-status-converted bic-status-closed')
                        .addClass('bic-status-' + status)
                        .text(status);
                    
                    showNotice('Status updated successfully', 'success');
                } else {
                    showNotice('Failed to update status: ' + response.data, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while updating the status', 'error');
            }
        });
    }

    /**
     * Update submission advisor
     */
    function updateSubmissionAdvisor(submissionId, advisorId) {
        $.ajax({
            url: bicAdmin.ajaxurl,
            type: 'POST',
            data: {
                action: 'bic_update_submission',
                nonce: bicAdmin.nonce,
                id: submissionId,
                advisor_id: advisorId
            },
            success: function(response) {
                if (response.success) {
                    const advisorName = $('.bic-advisor-select option:selected').text();
                    $('.bic-advisor-name-' + submissionId).text(advisorName);
                    
                    showNotice('Advisor updated successfully', 'success');
                } else {
                    showNotice('Failed to update advisor: ' + response.data, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while updating the advisor', 'error');
            }
        });
    }

    /**
     * Delete submission
     */
    function deleteSubmission(submissionId) {
        $.ajax({
            url: bicAdmin.ajaxurl,
            type: 'POST',
            data: {
                action: 'bic_delete_submission',
                nonce: bicAdmin.nonce,
                id: submissionId
            },
            success: function(response) {
                if (response.success) {
                    // Remove the row
                    $('.bic-submission-row-' + submissionId).fadeOut(300, function() {
                        $(this).remove();
                    });
                    
                    showNotice('Submission deleted successfully', 'success');
                } else {
                    showNotice('Failed to delete submission: ' + response.data, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while deleting the submission', 'error');
            }
        });
    }

    /**
     * Initialize territory manager
     */
    function initTerritoryManager() {
        const $container = $('#bic-territories-container');
        const $territoriesList = $('#bic-territories-list');
        const $stateSelect = $('#bic-territory-state');
        const $zipcodeInput = $('#bic-territory-zipcode');
        const $allZipsCheckbox = $('#bic-territory-all-zips');
        
        // Add state button
        $('#bic-add-territory').on('click', function() {
            const state = $stateSelect.val();
            const stateName = $stateSelect.find('option:selected').text();
            
            if (!state) {
                return;
            }
            
            // Check if state already exists
            if ($territoriesList.find('[data-state="' + state + '"]').length) {
                showNotice('This state is already in the list', 'error');
                return;
            }
            
            // Add state to the list
            const territoryHtml = `
                <div class="bic-territory-item" data-state="${state}">
                    <div class="bic-territory-header">
                        <strong>${stateName} (${state})</strong>
                        <div class="bic-territory-actions">
                            ${$allZipsCheckbox.is(':checked') ? 
                                '<span class="bic-all-zips-badge">All ZIP Codes</span>' : 
                                '<button type="button" class="button bic-add-zipcode">Add ZIP Code</button>'}
                            <button type="button" class="button button-link-delete bic-remove-territory">Remove</button>
                        </div>
                    </div>
                    <div class="bic-territory-zipcode-list" ${$allZipsCheckbox.is(':checked') ? 'style="display:none;"' : ''}>
                        <div class="bic-zipcode-input-row" ${$allZipsCheckbox.is(':checked') ? 'style="display:none;"' : ''}>
                            <input type="text" class="bic-zipcode-input" placeholder="Enter ZIP code">
                            <button type="button" class="button bic-add-zipcode-input">Add</button>
                        </div>
                        <div class="bic-zipcode-tags">
                            ${$allZipsCheckbox.is(':checked') ? '' : ''}
                        </div>
                    </div>
                    <input type="hidden" class="bic-territory-data" name="territories[${state}]" value="${$allZipsCheckbox.is(':checked') ? '*' : '[]'}">
                </div>
            `;
            
            $territoriesList.append(territoryHtml);
            
            // Reset inputs
            $stateSelect.val('');
            $allZipsCheckbox.prop('checked', false);
        });
        
        // Remove territory
        $(document).on('click', '.bic-remove-territory', function() {
            $(this).closest('.bic-territory-item').remove();
        });
        
        // Add zipcode to territory
        $(document).on('click', '.bic-add-zipcode-input', function() {
            const $territoryItem = $(this).closest('.bic-territory-item');
            const $input = $territoryItem.find('.bic-zipcode-input');
            const zipcode = $input.val().trim();
            
            if (!zipcode || !/^\d{5}(-\d{4})?$/.test(zipcode)) {
                alert('Please enter a valid ZIP code (5 digits or 5+4 format)');
                return;
            }
            
            // Check if zipcode already exists
            const $zipcodeList = $territoryItem.find('.bic-zipcode-tags');
            if ($zipcodeList.find('[data-zipcode="' + zipcode + '"]').length) {
                alert('This ZIP code is already in the list');
                return;
            }
            
            // Add zipcode tag
            $zipcodeList.append(`
                <span class="bic-zipcode-tag" data-zipcode="${zipcode}">
                    ${zipcode}
                    <a href="#" class="bic-remove-zipcode">&times;</a>
                </span>
            `);
            
            // Update hidden input with JSON of zipcodes
            updateTerritoryData($territoryItem);
            
            // Clear input
            $input.val('').focus();
        });
        
        // Remove zipcode
        $(document).on('click', '.bic-remove-zipcode', function(e) {
            e.preventDefault();
            
            const $tag = $(this).closest('.bic-zipcode-tag');
            const $territoryItem = $tag.closest('.bic-territory-item');
            
            $tag.remove();
            
            // Update hidden input with JSON of zipcodes
            updateTerritoryData($territoryItem);
        });
    }
    
    /**
     * Update territory data field with zipcodes JSON
     */
    function updateTerritoryData($territoryItem) {
        const $zipcodes = $territoryItem.find('.bic-zipcode-tag');
        const zipcodesList = [];
        
        $zipcodes.each(function() {
            zipcodesList.push($(this).data('zipcode'));
        });
        
        $territoryItem.find('.bic-territory-data').val(JSON.stringify(zipcodesList));
    }
    
    /**
     * Save advisor data
     */
    function saveAdvisor() {
        const $form = $('#bic-advisor-form');
        const advisorId = $form.data('id') || 0;
        const name = $('#advisor-name').val();
        const email = $('#advisor-email').val();
        
        // Collect territories
        const territories = {};
        $('.bic-territory-item').each(function() {
            const state = $(this).data('state');
            const value = $(this).find('.bic-territory-data').val();
            territories[state] = value === '*' ? '*' : JSON.parse(value);
        });
        
        $.ajax({
            url: bicAdmin.ajaxurl,
            type: 'POST',
            data: {
                action: 'bic_save_advisor',
                nonce: bicAdmin.nonce,
                id: advisorId,
                name: name,
                email: email,
                territories: JSON.stringify(territories)
            },
            success: function(response) {
                if (response.success) {
                    if (!advisorId) {
                        // Redirect to edit page if this was a new advisor
                        window.location.href = 'admin.php?page=bic-advisors&id=' + response.data.id + '&updated=1';
                    } else {
                        showNotice('Advisor saved successfully', 'success');
                    }
                } else {
                    showNotice('Failed to save advisor: ' + response.data, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while saving the advisor', 'error');
            }
        });
    }
    
    /**
     * Save settings
     */
    function saveSettings() {
        const $form = $('#bic-settings-form');
        const emailSubject = $('#bic-email-subject').val();
        const emailTemplate = $('#bic-email-template').val();
        const submitterEmailSubject = $('#bic-submitter-email-subject').val();
        const submitterEmailTemplate = $('#bic-submitter-email-template').val();
        const calculatorTitle = $('#bic-calculator-title').val();
        const primaryColor = $('#bic-primary-color').val();
        const buttonText = $('input[name="button_text"]').val();
        const showLogo = $('input[name="show_logo"]').is(':checked') ? '1' : '0';
        
        $.ajax({
            url: bicAdmin.ajaxurl,
            type: 'POST',
            data: {
                action: 'bic_save_settings',
                nonce: bicAdmin.nonce,
                email_subject: emailSubject,
                email_template: emailTemplate,
                submitter_email_subject: submitterEmailSubject,
                submitter_email_template: submitterEmailTemplate,
                calculator_title: calculatorTitle,
                primary_color: primaryColor,
                button_text: buttonText,
                show_logo: showLogo
            },
            success: function(response) {
                if (response.success) {
                    showNotice('Settings saved successfully', 'success');
                } else {
                    showNotice('Failed to save settings: ' + response.data, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while saving the settings', 'error');
            }
        });
    }
    
    /**
     * Show admin notice
     */
    function showNotice(message, type) {
        const noticeClass = type === 'error' ? 'notice-error' : 'notice-success';
        
        const $notice = $(`
            <div class="notice ${noticeClass} is-dismissible">
                <p>${message}</p>
                <button type="button" class="notice-dismiss">
                    <span class="screen-reader-text">Dismiss this notice.</span>
                </button>
            </div>
        `);
        
        // Find a good place to show the notice
        const $heading = $('.wp-heading-inline').first();
        if ($heading.length) {
            $notice.insertAfter($heading);
        } else {
            $notice.prependTo('.wrap');
        }
        
        // Add dismiss functionality
        $notice.find('.notice-dismiss').on('click', function() {
            $notice.fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        // Auto dismiss after 5 seconds for success messages
        if (type !== 'error') {
            setTimeout(function() {
                $notice.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 5000);
        }
    }

})(jQuery); 