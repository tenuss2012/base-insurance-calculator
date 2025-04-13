<div class="wrap">
    <h1 class="wp-heading-inline">Insurance Calculator Settings</h1>
    
    <hr class="wp-header-end">
    
    <form id="bic-settings-form" class="bic-settings-form">
        <h2>Advisor Email Notification Settings</h2>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="bic-email-subject">Email Subject</label>
                </th>
                <td>
                    <input type="text" id="bic-email-subject" name="email_subject" class="regular-text" 
                           value="<?php echo esc_attr($email_subject); ?>">
                    <p class="description">
                        The subject line for emails sent to advisors when a new submission is received.
                    </p>
                </td>
            </tr>
            
            <tr>
                <th scope="row">
                    <label for="bic-email-template">Email Template</label>
                </th>
                <td>
                    <textarea id="bic-email-template" name="email_template" rows="10" class="large-text code"><?php echo esc_textarea($email_template); ?></textarea>
                    <p class="description">
                        The template for emails sent to advisors. You can use the following variables:
                        <code>{advisor_name}</code>, <code>{client_name}</code>, <code>{client_email}</code>, 
                        <code>{client_phone}</code>, <code>{client_location}</code>, <code>{recommended_coverage}</code>, 
                        <code>{submission_link}</code>
                    </p>
                </td>
            </tr>
        </table>
        
        <h2>Submitter Email Notification Settings</h2>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="bic-submitter-email-subject">Email Subject</label>
                </th>
                <td>
                    <input type="text" id="bic-submitter-email-subject" name="submitter_email_subject" class="regular-text" 
                           value="<?php echo esc_attr(get_option('bic_submitter_email_subject', 'Your Insurance Calculator Results')); ?>">
                    <p class="description">
                        The subject line for emails sent to users when they submit the calculator form.
                    </p>
                </td>
            </tr>
            
            <tr>
                <th scope="row">
                    <label for="bic-submitter-email-template">Email Template</label>
                </th>
                <td>
                    <textarea id="bic-submitter-email-template" name="submitter_email_template" rows="10" class="large-text code"><?php echo esc_textarea(get_option('bic_submitter_email_template', '')); ?></textarea>
                    <p class="description">
                        The template for emails sent to submitters. Leave blank to use the default template. You can use the following variables:
                        <code>{client_name}</code>, <code>{full_name}</code>, <code>{recommended_coverage}</code>, 
                        <code>{advisor_name}</code>, <code>{site_name}</code>
                    </p>
                </td>
            </tr>
        </table>
        
        <h2>Display Settings</h2>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="bic-calculator-title">Calculator Title</label>
                </th>
                <td>
                    <input type="text" id="bic-calculator-title" name="calculator_title" class="regular-text" 
                           value="<?php echo esc_attr(get_option('bic_calculator_title', '')); ?>">
                </td>
            </tr>
            
            <tr>
                <th scope="row">
                    <label for="bic-primary-color">Primary Color</label>
                </th>
                <td>
                    <input type="color" id="bic-primary-color" name="primary_color" 
                           value="<?php echo esc_attr(get_option('bic_primary_color', '#1e88e5')); ?>">
                </td>
            </tr>
            
            <tr>
                <th scope="row">Button Text</th>
                <td>
                    <fieldset>
                        <label>
                            <input type="text" name="button_text" value="<?php echo esc_attr(get_option('bic_button_text', 'Calculate')); ?>">
                        </label>
                    </fieldset>
                </td>
            </tr>
            
            <tr>
                <th scope="row">Show Company Logo</th>
                <td>
                    <fieldset>
                        <label>
                            <input type="checkbox" name="show_logo" value="1" <?php checked('1', get_option('bic_show_logo', '1')); ?>>
                            Display company logo in calculator header
                        </label>
                    </fieldset>
                </td>
            </tr>
        </table>
        
        <h2>Advisor Assignment Settings</h2>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="bic-default-advisor">Default Advisor</label>
                </th>
                <td>
                    <select id="bic-default-advisor" name="default_advisor" class="regular-text">
                        <option value="0">-- Select Default Advisor --</option>
                        <?php
                        global $wpdb;
                        $advisors = $wpdb->get_results("SELECT id, name FROM {$wpdb->prefix}bic_advisors ORDER BY name ASC");
                        foreach ($advisors as $advisor) {
                            $selected = (get_option('bic_default_advisor', 0) == $advisor->id) ? 'selected' : '';
                            echo '<option value="' . esc_attr($advisor->id) . '" ' . $selected . '>' . esc_html($advisor->name) . '</option>';
                        }
                        ?>
                    </select>
                    <p class="description">
                        This advisor will be assigned to submissions when no territorial match is found.
                    </p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="bic-assignment-method">Assignment Method</label>
                </th>
                <td>
                    <?php $current_method = get_option('bic_assignment_method', 'round-robin'); ?>
                    <select id="bic-assignment-method" name="assignment_method" class="regular-text">
                        <option value="round-robin" <?php selected('round-robin', $current_method); ?>>Round-Robin (balanced)</option>
                        <option value="first-match" <?php selected('first-match', $current_method); ?>>First Match (by ID)</option>
                    </select>
                    <p class="description">
                        Method used when multiple advisors match a territory. Round-robin balances leads across advisors.
                    </p>
                    <button type="button" id="reset-assignment-index" class="button">Reset Round-Robin Counter</button>
                    <span id="reset-message" style="display: none; margin-left: 10px; color: green;"></span>
                </td>
            </tr>
        </table>
        
        <p class="submit">
            <button type="submit" class="button button-primary">Save Settings</button>
        </p>
    </form>
</div>

<script type="text/javascript">
    jQuery(document).ready(function($) {
        $('#bic-settings-form').on('submit', function(e) {
            e.preventDefault();
            
            const formData = $(this).serialize();
            
            $.ajax({
                url: bicAdmin.ajaxurl,
                type: 'POST',
                data: {
                    action: 'bic_save_settings',
                    nonce: bicAdmin.nonce,
                    email_subject: $('#bic-email-subject').val(),
                    email_template: $('#bic-email-template').val(),
                    submitter_email_subject: $('#bic-submitter-email-subject').val(),
                    submitter_email_template: $('#bic-submitter-email-template').val(),
                    calculator_title: $('#bic-calculator-title').val(),
                    primary_color: $('#bic-primary-color').val(),
                    button_text: $('input[name="button_text"]').val(),
                    show_logo: $('input[name="show_logo"]').is(':checked') ? '1' : '0',
                    default_advisor: $('#bic-default-advisor').val(),
                    assignment_method: $('#bic-assignment-method').val()
                },
                success: function(response) {
                    if (response.success) {
                        const $notice = $(`
                            <div class="notice notice-success is-dismissible">
                                <p>Settings saved successfully.</p>
                                <button type="button" class="notice-dismiss">
                                    <span class="screen-reader-text">Dismiss this notice.</span>
                                </button>
                            </div>
                        `);
                        
                        $('.wp-header-end').after($notice);
                        
                        $notice.find('.notice-dismiss').on('click', function() {
                            $notice.fadeOut(300, function() {
                                $(this).remove();
                            });
                        });
                        
                        setTimeout(function() {
                            $notice.fadeOut(300, function() {
                                $(this).remove();
                            });
                        }, 3000);
                    } else {
                        alert('Failed to save settings: ' + response.data);
                    }
                },
                error: function() {
                    alert('An error occurred while saving the settings');
                }
            });
        });
        
        // Handle reset assignment index button
        $('#reset-assignment-index').on('click', function() {
            $.ajax({
                url: bicAdmin.ajaxurl,
                type: 'POST',
                data: {
                    action: 'bic_reset_assignment_index',
                    nonce: bicAdmin.nonce
                },
                success: function(response) {
                    if (response.success) {
                        const $message = $('#reset-message');
                        $message.text('Counter reset successfully!').show();
                        setTimeout(function() {
                            $message.fadeOut();
                        }, 3000);
                    } else {
                        alert('Failed to reset counter: ' + response.data);
                    }
                },
                error: function() {
                    alert('An error occurred while resetting the counter');
                }
            });
        });
    });
</script> 