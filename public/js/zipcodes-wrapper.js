/**
 * Wrapper for zipcodes.js
 * This file ensures the zipcodes.js file is properly loaded and initialized
 * before being used by calculator.js and ui.js
 */

// Create a global zipcodes object if it doesn't exist
if (typeof window.zipcodes === 'undefined') {
    window.zipcodes = {
        _data: null,
        _loaded: false,
        _callbacks: [],
        _cache: {}, // Cache for zipcode lookups
        _zipMap: null, // For fast lookups of zipcodes

        // Initialize the zipcodes data
        init() {
            // First load the browser-compatible wrapper
            const script = document.createElement('script');
            script.src = 'js/zipcodes-browser.js';
            script.onload = () => {
                console.log('Zipcodes browser wrapper loaded');
            };
            document.head.appendChild(script);
            
            // Listen for the zipcodesLoaded event
            window.addEventListener('zipcodesLoaded', () => {
                this._loaded = true;
                this._buildZipMap();
                
                // Execute any pending callbacks
                this._callbacks.forEach(callback => callback());
                this._callbacks = [];
            });
        },

        // Build a zipcode to state map for faster lookups
        _buildZipMap() {
            try {
                console.log('Building zipcode map for faster lookups...');
                this._zipMap = {};
                
                if (typeof window._ZIPCODES === 'undefined') {
                    console.error('_ZIPCODES is not defined');
                    return;
                }
                
                for (const state in window._ZIPCODES) {
                    const zipCodes = window._ZIPCODES[state];
                    for (let i = 0; i < zipCodes.length; i++) {
                        const zip = zipCodes[i];
                        this._zipMap[zip] = state;
                    }
                }
                console.log('Zipcode map built successfully.');
            } catch (error) {
                console.error('Error building zipcode map:', error);
            }
        },

        // Look up a zipcode and return location information
        lookup(zipCode) {
            if (!zipCode || typeof zipCode !== 'string' || zipCode.length !== 5) {
                return null;
            }

            // Check cache first for faster lookups
            if (this._cache[zipCode]) {
                return this._cache[zipCode];
            }

            try {
                // Fast lookup using zipMap if available
                if (this._zipMap && this._zipMap[zipCode]) {
                    const result = {
                        zipCode: zipCode,
                        state: this._zipMap[zipCode],
                        city: '', // zipcodes.js doesn't include city information
                        county: '' // zipcodes.js doesn't include county information
                    };
                    
                    // Store in cache for future lookups
                    this._cache[zipCode] = result;
                    return result;
                }
                
                // Fallback to the slower method if zipMap is not available
                if (!this._zipMap && typeof window._ZIPCODES !== 'undefined') {
                    // Loop through each state to find the zipcode
                    for (const state in window._ZIPCODES) {
                        if (window._ZIPCODES[state].includes(zipCode)) {
                            const result = {
                                zipCode: zipCode,
                                state: state,
                                city: '', // zipcodes.js doesn't include city information
                                county: '' // zipcodes.js doesn't include county information
                            };
                            
                            // Store in cache for future lookups
                            this._cache[zipCode] = result;
                            
                            return result;
                        }
                    }
                }
                
                // Cache negative results too
                this._cache[zipCode] = null;
                return null;
            } catch (error) {
                console.error("Error looking up zipcode:", error);
                return null;
            }
        },

        // Wait for zipcodes to be loaded and then execute callback
        onLoaded(callback) {
            if (this._loaded) {
                callback();
            } else {
                this._callbacks.push(callback);
            }
        }
    };

    // Initialize the zipcodes data
    window.zipcodes.init();
} 