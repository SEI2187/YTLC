// Function to change location
function changeLocation(location) {
    // Try multiple possible selectors for the location element
    const selectors = [
        'ytd-topbar-logo-renderer #country-code',
        'span#country-code',
        'ytd-topbar-logo-renderer span[id="country-code"]'
    ];

    // Try each selector
    for (let selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = location;
            return true;
        }
    }
    return false;
}

// Function to keep trying to change location until successful
function attemptChangeLocation(location, maxAttempts = 10) {
    let attempts = 0;
    
    const tryChange = () => {
        if (changeLocation(location)) {
            console.log('Location changed successfully');
            return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
            setTimeout(tryChange, 1000); // Try again after 1 second
        }
    };
    
    tryChange();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "changeLocation") {
        attemptChangeLocation(request.location);
    }
});

// Check storage when page loads
chrome.storage.local.get('savedLocation', function(data) {
    if (data.savedLocation) {
        attemptChangeLocation(data.savedLocation);
    }
});

// Update observer configuration to be more specific and efficient
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            const countryCode = document.querySelector('span#country-code');
            if (countryCode) {
                chrome.storage.local.get('savedLocation', function(data) {
                    if (data.savedLocation) {
                        attemptChangeLocation(data.savedLocation);
                    }
                });
                break;
            }
        }
    }
});

// Start observing changes with more specific targeting
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: false,
    attributes: false
}); 