<?php
/**
 * Admin settings page display
 */
?>
<div class="wrap">
    <div class="basetax-admin-header">
        <h1><span class="basetax-logo" style="color: #fad03b;">■</span> <?php echo esc_html(get_admin_page_title()); ?></h1>
    </div>
    
    <form method="post" action="options.php" class="basetax-settings-form">
        <?php
        settings_fields('basetax_insurance_calculator_options');
        do_settings_sections('basetax-insurance-calculator');
        submit_button('Save Settings', 'primary basetax-save-button');
        ?>
    </form>
</div>