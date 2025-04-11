<div class="wrap">
    <h1 class="wp-heading-inline">Insurance Calculator Dashboard</h1>
    
    <hr class="wp-header-end">
    
    <?php if (isset($_GET['updated'])) : ?>
    <div class="notice notice-success is-dismissible">
        <p>Settings updated successfully.</p>
    </div>
    <?php endif; ?>
    
    <div class="bic-dashboard-wrapper">
        <!-- Summary Cards -->
        <div class="bic-dashboard-card">
            <h3>Total Submissions</h3>
            <div class="bic-dashboard-number"><?php echo esc_html($total_submissions); ?></div>
            <div class="bic-dashboard-label">All time submissions</div>
        </div>
        
        <div class="bic-dashboard-card">
            <h3>New Submissions</h3>
            <div class="bic-dashboard-number"><?php echo esc_html($new_submissions); ?></div>
            <div class="bic-dashboard-label">Awaiting advisor contact</div>
        </div>
        
        <div class="bic-dashboard-card">
            <h3>Registered Advisors</h3>
            <div class="bic-dashboard-number"><?php echo esc_html($total_advisors); ?></div>
            <div class="bic-dashboard-label">Available for assignment</div>
        </div>
        
        <!-- Recent Submissions -->
        <div class="bic-dashboard-card" style="width: calc(100% - 20px);">
            <h3>Recent Submissions</h3>
            
            <?php if (!empty($recent_submissions)) : ?>
                <ul class="bic-recent-list">
                    <?php foreach ($recent_submissions as $submission) : ?>
                        <li class="bic-recent-item">
                            <div>
                                <span class="bic-name">
                                    <a href="<?php echo esc_url(admin_url('admin.php?page=bic-submissions&id=' . $submission->id)); ?>">
                                        <?php echo esc_html($submission->first_name . ' ' . $submission->last_name); ?>
                                    </a>
                                </span>
                                <span class="bic-status bic-status-<?php echo esc_attr($submission->status); ?>">
                                    <?php echo esc_html($submission->status); ?>
                                </span>
                            </div>
                            <div class="bic-recent-meta">
                                <?php echo esc_html($submission->email); ?> | 
                                <?php echo esc_html($submission->zipcode); ?>, 
                                <?php echo esc_html($submission->state); ?> | 
                                <span class="bic-date">
                                    <?php echo esc_html(human_time_diff(strtotime($submission->timestamp), current_time('timestamp'))); ?> ago
                                </span>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
                
                <p>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=bic-submissions')); ?>" class="button">
                        View All Submissions
                    </a>
                </p>
            <?php else : ?>
                <p>No submissions yet.</p>
            <?php endif; ?>
        </div>
    </div>
    
    <div class="bic-dashboard-buttons" style="margin-top: 20px;">
        <a href="<?php echo esc_url(admin_url('admin.php?page=bic-advisors&action=new')); ?>" class="button button-primary">
            Add New Advisor
        </a>
        
        <a href="<?php echo esc_url(admin_url('admin.php?page=bic-settings')); ?>" class="button">
            Configure Settings
        </a>
    </div>
</div> 