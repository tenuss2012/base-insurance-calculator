<div class="wrap">
    <h1 class="wp-heading-inline">Insurance Calculator Advisors</h1>
    
    <a href="<?php echo esc_url(admin_url('admin.php?page=bic-advisors&action=new')); ?>" class="page-title-action">
        Add New Advisor
    </a>
    
    <hr class="wp-header-end">
    
    <?php if (isset($_GET['updated'])) : ?>
    <div class="notice notice-success is-dismissible">
        <p>Advisor updated successfully.</p>
    </div>
    <?php endif; ?>
    
    <?php if (empty($advisors)) : ?>
        <div class="notice notice-info">
            <p>
                No advisors found. 
                <a href="<?php echo esc_url(admin_url('admin.php?page=bic-advisors&action=new')); ?>">Add your first advisor</a>
                to start assigning territories.
            </p>
        </div>
    <?php else : ?>
        <!-- Advisors Table -->
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Assigned Territories</th>
                    <th>Submissions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($advisors as $advisor) : 
                    // Count assigned submissions
                    $submission_count = $wpdb->get_var($wpdb->prepare(
                        "SELECT COUNT(*) FROM {$wpdb->prefix}bic_submissions WHERE advisor_id = %d",
                        $advisor->id
                    ));
                    
                    // Get territories
                    $territories = json_decode($advisor->territories, true);
                    $territory_count = !empty($territories) ? count($territories) : 0;
                ?>
                    <tr>
                        <td>
                            <strong>
                                <a href="<?php echo esc_url(admin_url('admin.php?page=bic-advisors&id=' . $advisor->id)); ?>">
                                    <?php echo esc_html($advisor->name); ?>
                                </a>
                            </strong>
                        </td>
                        <td>
                            <a href="mailto:<?php echo esc_attr($advisor->email); ?>">
                                <?php echo esc_html($advisor->email); ?>
                            </a>
                        </td>
                        <td>
                            <?php 
                            if (!empty($territories)) {
                                $state_list = array_keys($territories);
                                echo esc_html(implode(', ', $state_list)) . ' (' . esc_html($territory_count) . ' total)';
                            } else {
                                echo 'No territories assigned';
                            }
                            ?>
                        </td>
                        <td>
                            <?php if ($submission_count > 0) : ?>
                                <a href="<?php echo esc_url(admin_url('admin.php?page=bic-submissions&advisor=' . $advisor->id)); ?>">
                                    <?php echo esc_html($submission_count); ?> submissions
                                </a>
                            <?php else : ?>
                                0 submissions
                            <?php endif; ?>
                        </td>
                        <td>
                            <a href="<?php echo esc_url(admin_url('admin.php?page=bic-advisors&id=' . $advisor->id)); ?>" class="button button-small">
                                Edit
                            </a>
                            
                            <a href="#" class="button button-small button-link-delete bic-delete-advisor" data-id="<?php echo esc_attr($advisor->id); ?>">
                                Delete
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<script type="text/javascript">
    jQuery(document).ready(function($) {
        $('.bic-delete-advisor').on('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to delete this advisor? Submissions assigned to this advisor will be unassigned.')) {
                const advisorId = $(this).data('id');
                
                $.ajax({
                    url: bicAdmin.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'bic_delete_advisor',
                        nonce: bicAdmin.nonce,
                        id: advisorId
                    },
                    success: function(response) {
                        if (response.success) {
                            location.reload();
                        } else {
                            alert('Failed to delete advisor: ' + response.data);
                        }
                    },
                    error: function() {
                        alert('An error occurred while deleting the advisor');
                    }
                });
            }
        });
    });
</script> 