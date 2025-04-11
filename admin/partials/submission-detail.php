<div class="wrap">
    <h1 class="wp-heading-inline">
        Submission Details: <?php echo esc_html($submission->first_name . ' ' . $submission->last_name); ?>
    </h1>
    
    <a href="<?php echo esc_url(admin_url('admin.php?page=bic-submissions')); ?>" class="page-title-action">
        Back to Submissions
    </a>
    
    <hr class="wp-header-end">
    
    <div class="bic-detail-card">
        <div class="bic-detail-header">
            <h2><?php echo esc_html($submission->first_name . ' ' . $submission->last_name); ?></h2>
            <span class="bic-status bic-status-<?php echo esc_attr($submission->status); ?>">
                <?php echo esc_html($submission->status); ?>
            </span>
        </div>
        
        <div class="bic-section-title">Contact Information</div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">Email:</span>
            <span class="bic-meta-value">
                <a href="mailto:<?php echo esc_attr($submission->email); ?>">
                    <?php echo esc_html($submission->email); ?>
                </a>
            </span>
        </div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">Phone:</span>
            <span class="bic-meta-value">
                <a href="tel:<?php echo esc_attr($submission->phone); ?>">
                    <?php echo esc_html($submission->phone); ?>
                </a>
            </span>
        </div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">Age:</span>
            <span class="bic-meta-value"><?php echo esc_html($submission->age); ?></span>
        </div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">Gender:</span>
            <span class="bic-meta-value"><?php echo esc_html(ucfirst($submission->gender)); ?></span>
        </div>
        
        <div class="bic-section-title">Location</div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">ZIP Code:</span>
            <span class="bic-meta-value"><?php echo esc_html($submission->zipcode); ?></span>
        </div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">State:</span>
            <span class="bic-meta-value"><?php echo esc_html($submission->state); ?></span>
        </div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">County:</span>
            <span class="bic-meta-value"><?php echo esc_html($submission->county); ?></span>
        </div>
        
        <div class="bic-section-title">Submission Details</div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">Date Submitted:</span>
            <span class="bic-meta-value">
                <?php echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($submission->timestamp))); ?>
            </span>
        </div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">Status:</span>
            <span class="bic-meta-value">
                <select class="bic-status-select" data-id="<?php echo esc_attr($submission->id); ?>">
                    <option value="new" <?php selected($submission->status, 'new'); ?>>New</option>
                    <option value="contacted" <?php selected($submission->status, 'contacted'); ?>>Contacted</option>
                    <option value="converted" <?php selected($submission->status, 'converted'); ?>>Converted</option>
                    <option value="closed" <?php selected($submission->status, 'closed'); ?>>Closed</option>
                </select>
            </span>
        </div>
        
        <div class="bic-meta-row">
            <span class="bic-meta-label">Assigned Advisor:</span>
            <span class="bic-meta-value">
                <?php
                // Get all advisors for dropdown
                $advisors = $wpdb->get_results("SELECT id, name FROM {$wpdb->prefix}bic_advisors ORDER BY name ASC");
                ?>
                <select class="bic-advisor-select" data-id="<?php echo esc_attr($submission->id); ?>">
                    <option value="0">Not Assigned</option>
                    <?php foreach ($advisors as $advisor) : ?>
                        <option value="<?php echo esc_attr($advisor->id); ?>" <?php selected($submission->advisor_id, $advisor->id); ?>>
                            <?php echo esc_html($advisor->name); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <div>
                    <?php if (!empty($submission->advisor_email)) : ?>
                        <a href="mailto:<?php echo esc_attr($submission->advisor_email); ?>">
                            Email advisor
                        </a>
                    <?php endif; ?>
                </div>
            </span>
        </div>
        
        <div class="bic-section-title">Calculation Results</div>
        
        <?php
        $results = json_decode($submission->calculation_results, true);
        if (!empty($results)) :
        ?>
            <div class="bic-calculations-list">
                <?php if (isset($results['breakdown'])) : ?>
                    <?php foreach ($results['breakdown'] as $label => $value) : ?>
                        <div class="bic-calc-item">
                            <div class="bic-calc-label"><?php echo esc_html(ucwords(str_replace('_', ' ', $label))); ?>:</div>
                            <div class="bic-calc-value">$<?php echo esc_html(number_format($value)); ?></div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
                
                <div class="bic-calc-item bic-total-row">
                    <div class="bic-calc-label">Recommended Coverage:</div>
                    <div class="bic-calc-value">$<?php echo esc_html(number_format($results['recommendedCoverage'] ?? 0)); ?></div>
                </div>
                
                <?php if (isset($results['currentCoverage']) && $results['currentCoverage'] > 0) : ?>
                    <div class="bic-calc-item">
                        <div class="bic-calc-label">Current Coverage:</div>
                        <div class="bic-calc-value">$<?php echo esc_html(number_format($results['currentCoverage'])); ?></div>
                    </div>
                    
                    <div class="bic-calc-item">
                        <div class="bic-calc-label">Additional Coverage Needed:</div>
                        <div class="bic-calc-value">$<?php echo esc_html(number_format($results['additionalCoverageNeeded'] ?? 0)); ?></div>
                    </div>
                <?php endif; ?>
            </div>
        <?php else : ?>
            <p>No calculation results available.</p>
        <?php endif; ?>
    </div>
    
    <div class="bic-actions-row" style="margin-top: 20px;">
        <a href="#" class="button button-link-delete bic-delete-submission" data-id="<?php echo esc_attr($submission->id); ?>">
            Delete Submission
        </a>
    </div>
</div> 