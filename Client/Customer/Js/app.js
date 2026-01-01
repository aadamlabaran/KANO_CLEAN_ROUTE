// Client/Customer/js/app.js

function switchTab(tabId) {
    // 1. Hide ALL tabs
    const tabs = ['home', 'schedule', 'guide', 'report', 'history'];
    tabs.forEach(id => {
        const element = document.getElementById(id);
        const button = document.getElementById('nav-' + id);
        
        if (element) element.classList.add('hidden');
        if (button) {
            button.classList.remove('text-emerald-600', 'border-b-2', 'border-emerald-600');
            button.classList.add('text-gray-500');
        }
    });

    // 2. Show the SELECTED tab
    const activeTab = document.getElementById(tabId);
    const activeButton = document.getElementById('nav-' + tabId);

    if (activeTab) activeTab.classList.remove('hidden');
    if (activeButton) {
        activeButton.classList.remove('text-gray-500');
        activeButton.classList.add('text-emerald-600', 'border-b-2', 'border-emerald-600');
    }

    // 3. Trigger the Content Loaders (The missing link!)
    if (tabId === 'schedule' && typeof loadSchedule === 'function') {
        loadSchedule();
    }
    if (tabId === 'report' && typeof loadReportForm === 'function') {
        loadReportForm();
    }
    if (tabId === 'history' && typeof loadHistory === 'function') {
        loadHistory();
    }
}

// Global Modal Helpers
function showGenericModal(title, text) {
    document.getElementById('generic-modal-title').innerText = title;
    document.getElementById('generic-modal-text').innerText = text;
    document.getElementById('generic-modal').classList.remove('hidden');
}

function hideModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// Listener for Alerts (Driver Communication)
setInterval(() => {
    const signal = localStorage.getItem('ksc_client_alert');
    if (signal) {
        const data = JSON.parse(signal);
        showGenericModal("🔔 Notification", `${data.message}\n\nFrom: ${data.driver}`);
        
        const status = document.getElementById('driver-status-text');
        if (status) {
            status.innerText = "Truck Approaching 🚛";
            status.classList.add('text-emerald-600', 'font-bold');
        }
        localStorage.removeItem('ksc_client_alert');
    }
}, 3000);