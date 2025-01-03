document.getElementById('save').addEventListener('click', function() {
    const button = this;
    const newLocation = document.getElementById('location').value;
    
    // Store the location
    chrome.storage.local.set({ 'savedLocation': newLocation }, function() {
        // Send message to update current page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "changeLocation",
                location: newLocation
            });
            
            // Add success animation
            button.classList.add('success');
            button.textContent = 'Saved!';
            
            // Reset button after animation
            setTimeout(() => {
                button.classList.remove('success');
                button.textContent = 'Save Changes';
            }, 1500);
        });
    });
});

// Add input animation
const input = document.getElementById('location');
input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
input.addEventListener('blur', () => input.parentElement.classList.remove('focused')); 