window.userId = null;

// --- Auth Functions ---
function simulateLogin() {
    const id = document.getElementById('login-id').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error-msg');

    if (id && password) {
        hideModal('login-modal');
        window.userId = id;
        updateAuthControls(true);
        applyAccessGates(); // Enable restricted tabs
        errorElement.classList.add('hidden');
        
        // Add Pickup Button (Feature from schedule logic)
        if(typeof addPickupButton === 'function') addPickupButton();

        switchTab('schedule'); 
        console.log(`Simulated login successful for user: ${id}`);
    } else {
        errorElement.innerText = "Please enter both ID/Email and Password.";
        errorElement.classList.remove('hidden');
    }
}

function simulateRegistration() {
    const address = document.getElementById('reg-address').value.trim();
    const lga = document.getElementById('reg-lga').value;
    const name = document.getElementById('reg-name').value.trim();
    const errorElement = document.getElementById('reg-error');

    if (address && lga && name && lga !== '') {
        hideModal('register-modal');
        window.userId = name.split(' ')[0] + Date.now(); 
        updateAuthControls(true);
        applyAccessGates(); 
        errorElement.classList.add('hidden');

        if(typeof addPickupButton === 'function') addPickupButton();

        switchTab('schedule'); 
        console.log(`Simulated registration and login successful for: ${name}`);
    } else {
         errorElement.innerText = "Please fill in all required fields, including LGA.";
         errorElement.classList.remove('hidden');
    }
}

function appLogOut() {
    window.userId = null;
    updateAuthControls(false);
    applyAccessGates();
    switchTab('home');
    console.log("Logout successful.");
}

// --- Access Control ---
function handleGuardedTabSwitch(tabId) {
    if (!window.userId) {
        showModal('login');
    } else {
        switchTab(tabId);
    }
}

function updateAuthControls(isAuthenticated) {
    const authControls = document.getElementById('auth-controls');
    const userControls = document.getElementById('user-controls');
    const userDisplay = document.getElementById('user-display');
    const authControlsMobile = document.getElementById('auth-controls-mobile');
    const userControlsMobile = document.getElementById('user-controls-mobile');

    authControls.classList.toggle('hidden', isAuthenticated);
    userControls.classList.toggle('hidden', !isAuthenticated);
    if (authControlsMobile) authControlsMobile.classList.toggle('hidden', isAuthenticated);
    if (userControlsMobile) userControlsMobile.classList.toggle('hidden', !isAuthenticated);

    if (isAuthenticated) {
        const shortId = window.userId.substring(0, 8);
        if (userDisplay) userDisplay.innerText = `User ID: ${shortId}`;
        const userDisplayMobile = document.getElementById('user-display-mobile');
        if (userDisplayMobile) userDisplayMobile.innerText = `User ID: ${shortId}`;
    }
}

function applyAccessGates() {
    const isAuth = !!window.userId;
    // We rely on functions defined in schedule.js and report.js
    // We check if they exist first to avoid errors during load order
    
    if (typeof getScheduleContent === 'function') {
        const tabElement = document.getElementById('schedule');
        tabElement.innerHTML = isAuth ? getScheduleContent() : renderLoginPrompt('schedule');
    }

    if (typeof getReportContent === 'function') {
        const tabElement = document.getElementById('report');
        tabElement.innerHTML = isAuth ? getReportContent() : renderLoginPrompt('report');
        if (isAuth && typeof resetReportForm === 'function') resetReportForm();
    }
}

function renderLoginPrompt(targetTabId) {
    const promptText = targetTabId === 'schedule' 
        ? "You must be registered to view your private collection schedule."
        : "You must be logged in to submit a service request or report an issue.";
        
    return `
        <div class="text-center bg-white p-10 rounded-xl shadow-lg mt-10 max-w-xl mx-auto border-t-4 border-amber-500 space-y-4">
            <span class="text-4xl text-amber-500 block">🔒</span>
            <h3 class="text-xl font-bold text-gray-800">Access Restricted</h3>
            <p class="text-gray-600">${promptText}</p>
            <button onclick="showModal('login')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Log In / Register Now
            </button>
        </div>
    `;
}