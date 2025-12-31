const API_URL_GET_SCHEDULE = 'http://127.0.0.1:3000/api/customer/get-schedule';

function getScheduleContent() {
    return `
        <div class="mb-6 max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">My Collection Schedule</h2>
            <p class="text-gray-600">Enter your street address to view your personalized trash and recycling schedule.</p>
        </div>
        <div class="bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto space-y-6">
            <label for="address-input" class="block text-sm font-medium text-gray-700">Enter Address / Street Name</label>
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <input type="text" id="address-input" placeholder="e.g., Emir Palace Road, Zone B" class="flex-grow border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500" />
                <button onclick="displaySchedule()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Find Schedule
                </button>
            </div>
            <div id="schedule-error" class="text-red-500 text-sm hidden"></div>
            <div id="schedule-output" class="pt-6 border-t border-blue-100 hidden">
                <h3 class="text-xl font-bold text-cyan-600 mb-3">Service Details for <span id="schedule-address"></span></h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p><strong>Collection Day:</strong> <span id="schedule-day" class="font-semibold text-emerald-600"></span></p>
                    <p><strong>Service Type:</strong> <span id="schedule-type" class="text-gray-700"></span></p>
                </div>
                <h4 class="font-bold text-gray-800 mt-4 mb-2">Next 4 Collection Dates:</h4>
                <div id="schedule-dates" class="flex flex-wrap gap-2"></div>
            </div>
        </div>`;
}

async function displaySchedule() {
    if (!window.userId) {
        alert('You must be logged in to view your schedule.');
        return;
    }
    // Check for pickup request before showing schedule
    try {
        const resp = await fetch('http://127.0.0.1:3000/api/customer/has-pickup-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: window.userId })
        });
        const result = await resp.json();
        if (!resp.ok || !result.hasRequest) {
            showRequestPickupModal();
            alert('You must request a pickup before viewing your schedule.');
            return;
        }
    } catch (e) {
        alert('Could not verify pickup request status.');
        return;
    }

    const address = document.getElementById('address-input').value.trim();
    const output = document.getElementById('schedule-output');
    const errorElement = document.getElementById('schedule-error');
    errorElement.classList.add('hidden');
    output.classList.add('hidden');
    
    if (address.length < 5) {
        errorElement.innerText = "Please enter a valid street address.";
        errorElement.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch(API_URL_GET_SCHEDULE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: address })
        });
        const result = await response.json();
        if (response.ok && result.success) {
            const schedule = result.schedule;
            document.getElementById('schedule-address').innerText = address;
            document.getElementById('schedule-day').innerText = schedule.day;
            document.getElementById('schedule-type').innerText = schedule.type;
            const datesContainer = document.getElementById('schedule-dates');
            datesContainer.innerHTML = '';
            schedule.nextDates.forEach(date => {
                const span = document.createElement('span');
                span.className = "bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs";
                span.innerText = date;
                datesContainer.appendChild(span);
            });
            output.classList.remove('hidden');
        } else {
            errorElement.innerText = result.message || 'Error fetching schedule. Please try again.';
            errorElement.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Schedule Fetch Error:", e);
        errorElement.innerText = 'Could not connect to the scheduling service.';
        errorElement.classList.remove('hidden');
    }
}

// --- Pickup Request Logic ---
function showRequestPickupModal() {
    let modal = document.getElementById('pickup-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'pickup-modal';
        modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative">
                <button onclick="hideModal('pickup-modal')" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">&times;</button>
                <h3 class="text-2xl font-bold text-emerald-600 mb-4">Request On-Demand Pickup</h3>
                <form id="pickup-form" class="space-y-4">
                    <div>
                        <label for="pickup-address" class="block text-sm font-medium text-gray-700">Pickup Address</label>
                        <input type="text" id="pickup-address" required class="w-full border border-gray-300 rounded-lg p-3" placeholder="e.g., No. 4, Bello Road" />
                    </div>
                    <div>
                        <label for="pickup-details" class="block text-sm font-medium text-gray-700">Details (Optional)</label>
                        <textarea id="pickup-details" rows="2" class="w-full border border-gray-300 rounded-lg p-3" placeholder="e.g., Large item, urgent"></textarea>
                    </div>
                    <div id="pickup-error" class="text-red-500 text-sm hidden"></div>
                    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">Submit Pickup Request</button>
                </form>
                <div id="pickup-confirmation" class="hidden text-center p-6 bg-green-50 rounded-xl border border-green-300 mt-4">
                    <span class="text-4xl block mb-3">✅</span>
                    <h3 class="text-xl font-bold text-emerald-700">Pickup Requested!</h3>
                    <p class="text-gray-700 mt-2">Your request has been received. Our team will contact you soon.</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('pickup-form').onsubmit = submitPickupRequest;
    }
    document.getElementById('pickup-form').reset();
    document.getElementById('pickup-error').classList.add('hidden');
    document.getElementById('pickup-confirmation').classList.add('hidden');
    document.getElementById('pickup-form').classList.remove('hidden');
    modal.classList.remove('hidden');
}

async function submitPickupRequest(e) {
    e.preventDefault();
    const address = document.getElementById('pickup-address').value.trim();
    const details = document.getElementById('pickup-details').value.trim();
    const errorEl = document.getElementById('pickup-error');
    errorEl.classList.add('hidden');
    if (address.length < 5) {
        errorEl.innerText = 'Please enter a valid address.';
        errorEl.classList.remove('hidden');
        return;
    }
    try {
        const resp = await fetch('http://127.0.0.1:3000/api/customer/request-pickup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, details, userId: window.userId })
        });
        const result = await resp.json();
        if (resp.ok && result.success) {
            document.getElementById('pickup-form').classList.add('hidden');
            document.getElementById('pickup-confirmation').classList.remove('hidden');
        } else {
            errorEl.innerText = result.message || 'Failed to submit pickup request.';
            errorEl.classList.remove('hidden');
        }
    } catch (e) {
        errorEl.innerText = 'Could not connect to the pickup service.';
        errorEl.classList.remove('hidden');
    }
}

function addPickupButton() {
    if (!window.userId) return;
    const home = document.getElementById('home');
    if (!home) return;
    if (document.getElementById('pickup-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'pickup-btn';
    btn.className = 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all mt-6';
    btn.innerText = '🚛 Request Pickup';
    btn.onclick = showRequestPickupModal;
    home.appendChild(btn);
}

// Override switchTab to intercept schedule logic
const baseSwitchTab = window.switchTab; 
window.switchTab = function(tabId) {
    if (tabId === 'schedule' && window.userId) {
        fetch('http://127.0.0.1:3000/api/customer/has-pickup-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: window.userId })
        })
        .then(resp => resp.json())
        .then(result => {
            if (result.hasRequest) {
                // Use the base functionality defined in app.js
                window.originalSwitchTab(tabId);
            } else {
                showRequestPickupModal();
                alert('You must request a pickup before viewing your schedule.');
            }
        })
        .catch(() => {
            alert('Could not verify pickup request status.');
        });
    } else {
        window.originalSwitchTab(tabId);
    }
};