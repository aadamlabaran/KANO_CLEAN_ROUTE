// Function to handle navigation clicks for analytics or tracking
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        
        const href = this.getAttribute('href');
        
        // Block empty links for demo purposes
        if (href === '#' || href === '') {
            e.preventDefault();
            console.warn("Empty link clicked. Navigation blocked.");
            return;
        }

        // Log navigation for debugging
        console.log(`Navigation initialized: Navigating to ${href}`);
        
        // In a real app, you might add a loading spinner here
    });
});

// Log system ready state
window.addEventListener('load', () => {
    console.log("KANO CLEANROUTE Landing Page Loaded Successfully.");
    console.log("System Status: OPERATIONAL");
});