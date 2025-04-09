<?php
/**
 * Public-facing calculator form
 */
?>
<div class="basetax-calculator-container">
    <div class="basetax-calculator-header">
        <h2><?php echo esc_html($atts['title']); ?></h2>
        <p><?php echo esc_html($atts['subtitle']); ?></p>
    </div>
    
    <div class="basetax-error-message"></div>
    
    <form class="basetax-calculator-form">
        <div class="basetax-form-row">
            <label for="person-age-1">Person 1 Age</label>
            <input type="number" id="person-age-1" name="ages[]" min="0" max="120" required>
        </div>
        
        <div class="basetax-add-person">+ Add Person</div>
        
        <div class="basetax-form-row">
            <label for="zip-code">ZIP Code</label>
            <input type="text" id="zip-code" name="zip_code" pattern="^\d{5}(-\d{4})?$" placeholder="e.g., 12345" required>
        </div>
        
        <div class="basetax-form-row">
            <label for="household-size">Household Size</label>
            <input type="number" id="household-size" name="household_size" min="1" max="20" value="1" readonly>
            <p class="description">Number of people in your household (updates automatically when adding people)</p>
        </div>
        
        <div class="basetax-form-row">
            <label for="annual-income">Estimated Annual Household Income</label>
            <input type="number" id="annual-income" name="income" min="0" step="1000" placeholder="e.g., 50000" required>
        </div>
        
        <div class="basetax-form-row">
            <label for="coverage-level">Preferred Coverage Level</label>
            <select id="coverage-level" name="coverage_level" required>
                <option value="bronze">Bronze (Lower premiums, higher out-of-pocket costs)</option>
                <option value="silver" selected>Silver (Balanced premiums and out-of-pocket costs)</option>
                <option value="gold">Gold (Higher premiums, lower out-of-pocket costs)</option>
                <option value="platinum">Platinum (Highest premiums, lowest out-of-pocket costs)</option>
            </select>
        </div>
        
        <div class="basetax-form-row basetax-checkbox-row">
            <input type="checkbox" id="tobacco-use" name="tobacco_use" value="1">
            <label for="tobacco-use">Does anyone in your household use tobacco products?</label>
        </div>
        
        <button type="submit" class="basetax-submit-button">Calculate Estimates</button>
    </form>
    
    <div class="basetax-loading">
        <div class="spinner"></div>
        <p>Calculating your estimates...</p>
    </div>
    
    <div class="basetax-results-container">
        <h3 class="basetax-results-header">Your Health Insurance Estimates</h3>
        
        <div class="basetax-subsidy-info">
            <p>You may be eligible for a premium tax credit (subsidy) of <strong class="basetax-subsidy-amount">$0.00</strong> per month.</p>
        </div>
        
        <div class="basetax-tier-tabs">
            <div class="basetax-tier-tab" data-tier="bronze">Bronze</div>
            <div class="basetax-tier-tab active" data-tier="silver">Silver</div>
            <div class="basetax-tier-tab" data-tier="gold">Gold</div>
            <div class="basetax-tier-tab" data-tier="platinum">Platinum</div>
        </div>
        
        <!-- Bronze Plan Content -->
        <div class="basetax-tier-content" data-tier="bronze">
            <div class="basetax-price-box">
                <div class="basetax-price-label">Estimated Monthly Premium</div>
                <div class="basetax-price basetax-subsidized-price">$0.00</div>
                <div class="basetax-price-period">per month</div>
                <div class="basetax-price-original">(Original price: <span class="basetax-original-price">$0.00</span>)</div>
            </div>
            
            <div class="basetax-coverage-details">
                <h4>Coverage Details</h4>
                <p>Bronze plans cover approximately 60% of healthcare costs on average, with lower monthly premiums but higher out-of-pocket costs.</p>
            </div>
        </div>
        
        <!-- Silver Plan Content -->
        <div class="basetax-tier-content active" data-tier="silver">
            <div class="basetax-price-box">
                <div class="basetax-price-label">Estimated Monthly Premium</div>
                <div class="basetax-price basetax-subsidized-price">$0.00</div>
                <div class="basetax-price-period">per month</div>
                <div class="basetax-price-original">(Original price: <span class="basetax-original-price">$0.00</span>)</div>
            </div>
            
            <div class="basetax-coverage-details">
                <h4>Coverage Details</h4>
                <p>Silver plans cover approximately 70% of healthcare costs on average, with moderate monthly premiums and out-of-pocket costs.</p>
            </div>
        </div>
        
        <!-- Gold Plan Content -->
        <div class="basetax-tier-content" data-tier="gold">
            <div class="basetax-price-box">
                <div class="basetax-price-label">Estimated Monthly Premium</div>
                <div class="basetax-price basetax-subsidized-price">$0.00</div>
                <div class="basetax-price-period">per month</div>
                <div class="basetax-price-original">(Original price: <span class="basetax-original-price">$0.00</span>)</div>
            </div>
            
            <div class="basetax-coverage-details">
                <h4>Coverage Details</h4>
                <p>Gold plans cover approximately 80% of healthcare costs on average, with higher monthly premiums but lower out-of-pocket costs.</p>
            </div>
        </div>
        
        <!-- Platinum Plan Content -->
        <div class="basetax-tier-content" data-tier="platinum">
            <div class="basetax-price-box">
                <div class="basetax-price-label">Estimated Monthly Premium</div>
                <div class="basetax-price basetax-subsidized-price">$0.00</div>
                <div class="basetax-price-period">per month</div>
                <div class="basetax-price-original">(Original price: <span class="basetax-original-price">$0.00</span>)</div>
            </div>
            
            <div class="basetax-coverage-details">
                <h4>Coverage Details</h4>
                <p>Platinum plans cover approximately 90% of healthcare costs on average, with the highest monthly premiums but lowest out-of-pocket costs.</p>
            </div>
        </div>
        
        <div class="basetax-disclaimer">
            Disclaimer: The estimates provided by this calculator are for informational purposes only and do not represent actual quotes. Please consult with an insurance professional or visit the Health Insurance Marketplace for accurate quotes.
        </div>
    </div>
</div>
