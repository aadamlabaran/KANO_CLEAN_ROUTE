// --- Global Constants & State ---
const KANO_LGAS = [
    "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", 
    "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", 
    "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", 
    "Nasarawa", "Nama", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", 
    "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa"
];

// --- Modal Functions ---
function showModal(type) {
    document.getElementById('register-modal').classList.add('hidden');
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('generic-modal').classList.add('hidden');

    if (type === 'login') {
        document.getElementById('login-modal').classList.remove('hidden');
    } else if (type === 'register') {
        document.getElementById('register-modal').classList.remove('hidden');
    } else if (type === 'payment') {
        document.getElementById('generic-modal').classList.remove('hidden');
        document.getElementById('generic-modal-title').innerText = "Simulated Payment Gateway";
        document.getElementById('generic-modal-text').innerText = "Payment processing is simulated. Click continue to confirm.";
    }
}

function hideModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// --- Navigation Logic ---
// We define the base function here. It might be wrapped/modified in schedule.js or auth.js
window.originalSwitchTab = function(tabId) {
    const tabs = ['home', 'schedule', 'guide', 'report'];
    tabs.forEach(t => {
        document.getElementById(t).classList.add('hidden');
        const navBtn = document.getElementById('nav-' + t);
        if (navBtn) {
            navBtn.classList.remove('tab-active');
            navBtn.classList.add('text-gray-500');
        }
    });

    document.getElementById(tabId).classList.remove('hidden');
    const activeBtn = document.getElementById('nav-' + tabId);
    if (activeBtn) {
        activeBtn.classList.add('tab-active');
        activeBtn.classList.remove('text-gray-500');
    }
};

// Global wrapper that lets other scripts hook into it
window.switchTab = function(tabId) {
    window.originalSwitchTab(tabId);
};

// --- Initialization ---
function populateLGAs() {
    const select = document.getElementById('reg-lga');
    if (!select) return;

    select.innerHTML = '<option value="">Select LGA</option>';
    KANO_LGAS.forEach(lga => {
        const option = document.createElement('option');
        option.value = lga.toLowerCase().replace(/\s/g, '-');
        option.textContent = lga;
        select.appendChild(option);
    });
}

// Global Event Listener
window.addEventListener('DOMContentLoaded', () => {
    populateLGAs();
    
    // Auth checks from auth.js might run here if functions are ready
    if (typeof updateAuthControls === 'function') updateAuthControls(false); 
    if (typeof applyAccessGates === 'function') applyAccessGates(); 
    
    window.switchTab('home');
});