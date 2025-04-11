<div class="wrap">
    <h1 class="wp-heading-inline">
        <?php echo isset($advisor) ? 'Edit Advisor: ' . esc_html($advisor->name) : 'Add New Advisor'; ?>
    </h1>
    
    <a href="<?php echo esc_url(admin_url('admin.php?page=bic-advisors')); ?>" class="page-title-action">
        Back to Advisors
    </a>
    
    <hr class="wp-header-end">
    
    <form id="bic-advisor-form" class="bic-advisor-form" data-id="<?php echo isset($advisor) ? esc_attr($advisor->id) : ''; ?>">
        <div class="form-row">
            <label for="advisor-name">Name *</label>
            <input type="text" id="advisor-name" name="name" value="<?php echo isset($advisor) ? esc_attr($advisor->name) : ''; ?>" required>
        </div>
        
        <div class="form-row">
            <label for="advisor-email">Email *</label>
            <input type="email" id="advisor-email" name="email" value="<?php echo isset($advisor) ? esc_attr($advisor->email) : ''; ?>" required>
        </div>
        
        <div class="bic-territories-section">
            <h3>Assigned Territories</h3>
            <p>Assign states or specific ZIP codes that this advisor will receive leads from.</p>
            
            <div id="bic-territories-container">
                <div class="bic-add-territory-form">
                    <div class="form-row" style="display: flex; gap: 10px; align-items: flex-end;">
                        <div style="flex: 1;">
                            <label for="bic-territory-state">State</label>
                            <select id="bic-territory-state">
                                <option value="">Select a state</option>
                                <?php foreach ($states as $code => $name) : ?>
                                    <option value="<?php echo esc_attr($code); ?>"><?php echo esc_html($name); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div style="flex: 1;">
                            <label for="bic-territory-all-zips">
                                <input type="checkbox" id="bic-territory-all-zips" name="all_zips">
                                All ZIP codes in this state
                            </label>
                        </div>
                        
                        <div>
                            <button type="button" id="bic-add-territory" class="button">Add Territory</button>
                        </div>
                    </div>
                </div>
                
                <div id="bic-territories-list" class="bic-territories-list">
                    <?php
                    if (isset($advisor)) {
                        $territories = json_decode($advisor->territories, true);
                        if (is_array($territories)) {
                            foreach ($territories as $state => $zips) {
                                $state_name = $states[$state] ?? $state;
                                ?>
                                <div class="bic-territory-item" data-state="<?php echo esc_attr($state); ?>">
                                    <div class="bic-territory-header">
                                        <strong><?php echo esc_html($state_name); ?> (<?php echo esc_html($state); ?>)</strong>
                                        <div class="bic-territory-actions">
                                            <?php if ($zips === '*') : ?>
                                                <span class="bic-all-zips-badge">All ZIP Codes</span>
                                            <?php else : ?>
                                                <button type="button" class="button bic-add-zipcode">Add ZIP Code</button>
                                            <?php endif; ?>
                                            <button type="button" class="button button-link-delete bic-remove-territory">Remove</button>
                                        </div>
                                    </div>
                                    
                                    <div class="bic-territory-zipcode-list" <?php echo $zips === '*' ? 'style="display:none;"' : ''; ?>>
                                        <div class="bic-zipcode-input-row" <?php echo $zips === '*' ? 'style="display:none;"' : ''; ?>>
                                            <input type="text" class="bic-zipcode-input" placeholder="Enter ZIP code">
                                            <button type="button" class="button bic-add-zipcode-input">Add</button>
                                        </div>
                                        
                                        <div class="bic-zipcode-tags">
                                            <?php
                                            if (is_array($zips)) {
                                                foreach ($zips as $zip) {
                                                    echo '<span class="bic-zipcode-tag" data-zipcode="' . esc_attr($zip) . '">' . 
                                                         esc_html($zip) . 
                                                         '<a href="#" class="bic-remove-zipcode">&times;</a></span>';
                                                }
                                            }
                                            ?>
                                        </div>
                                    </div>
                                    
                                    <input type="hidden" class="bic-territory-data" name="territories[<?php echo esc_attr($state); ?>]" 
                                           value="<?php echo $zips === '*' ? '*' : esc_attr(json_encode($zips)); ?>">
                                </div>
                                <?php
                            }
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
        
        <div class="form-row" style="margin-top: 20px;">
            <button type="submit" class="button button-primary"><?php echo isset($advisor) ? 'Update Advisor' : 'Add Advisor'; ?></button>
        </div>
    </form>
</div> 