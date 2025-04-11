<div class="wrap">
    <h1 class="wp-heading-inline">Insurance Calculator Submissions</h1>
    
    <hr class="wp-header-end">
    
    <!-- Filters -->
    <div class="bic-filters-form">
        <form method="get" action="">
            <input type="hidden" name="page" value="bic-submissions">
            
            <div class="form-row">
                <div class="form-field">
                    <label for="status">Status:</label>
                    <select id="status" name="status">
                        <option value="">All Statuses</option>
                        <option value="new" <?php selected($status_filter, 'new'); ?>>New</option>
                        <option value="contacted" <?php selected($status_filter, 'contacted'); ?>>Contacted</option>
                        <option value="converted" <?php selected($status_filter, 'converted'); ?>>Converted</option>
                        <option value="closed" <?php selected($status_filter, 'closed'); ?>>Closed</option>
                    </select>
                </div>
                
                <div class="form-field">
                    <label for="search">Search:</label>
                    <input type="text" id="search" name="search" value="<?php echo esc_attr($search_term); ?>" placeholder="Name, email, ZIP code...">
                </div>
                
                <div class="form-field">
                    <button type="submit" class="button">Filter</button>
                    <?php if (!empty($status_filter) || !empty($search_term)) : ?>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=bic-submissions')); ?>" class="button">Clear</a>
                    <?php endif; ?>
                </div>
            </div>
        </form>
    </div>
    
    <?php if (empty($submissions)) : ?>
        <div class="notice notice-info">
            <p>No submissions found.</p>
        </div>
    <?php else : ?>
        <!-- Submissions Table -->
        <table class="bic-submissions-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Advisor</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($submissions as $submission) : ?>
                    <tr class="bic-submission-row-<?php echo esc_attr($submission->id); ?>">
                        <td>
                            <a href="<?php echo esc_url(admin_url('admin.php?page=bic-submissions&id=' . $submission->id)); ?>">
                                <?php echo esc_html($submission->first_name . ' ' . $submission->last_name); ?>
                            </a>
                        </td>
                        <td>
                            <div><?php echo esc_html($submission->email); ?></div>
                            <div><?php echo esc_html($submission->phone); ?></div>
                        </td>
                        <td>
                            <div><?php echo esc_html($submission->zipcode); ?></div>
                            <div><?php echo esc_html($submission->state); ?></div>
                        </td>
                        <td>
                            <?php echo esc_html(date_i18n(get_option('date_format'), strtotime($submission->timestamp))); ?>
                        </td>
                        <td class="bic-status-cell-<?php echo esc_attr($submission->id); ?>">
                            <select class="bic-status-select" data-id="<?php echo esc_attr($submission->id); ?>">
                                <option value="new" <?php selected($submission->status, 'new'); ?>>New</option>
                                <option value="contacted" <?php selected($submission->status, 'contacted'); ?>>Contacted</option>
                                <option value="converted" <?php selected($submission->status, 'converted'); ?>>Converted</option>
                                <option value="closed" <?php selected($submission->status, 'closed'); ?>>Closed</option>
                            </select>
                            <span class="bic-status bic-status-<?php echo esc_attr($submission->status); ?>">
                                <?php echo esc_html($submission->status); ?>
                            </span>
                        </td>
                        <td>
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
                            <div class="bic-advisor-name-<?php echo esc_attr($submission->id); ?>">
                                <?php echo !empty($submission->advisor_name) ? esc_html($submission->advisor_name) : 'Not Assigned'; ?>
                            </div>
                        </td>
                        <td class="bic-actions">
                            <a href="<?php echo esc_url(admin_url('admin.php?page=bic-submissions&id=' . $submission->id)); ?>" class="button button-small">View</a>
                            <a href="#" class="button button-small bic-delete-submission" data-id="<?php echo esc_attr($submission->id); ?>">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div> 