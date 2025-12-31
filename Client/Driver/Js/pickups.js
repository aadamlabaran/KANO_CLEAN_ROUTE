let pickupFilter = 'all'; 
let pickupSort = 'time'; 
let pickupRequestsInterval = null;

function startPickupRequestsPolling() {
    if (pickupRequestsInterval) clearInterval(pickupRequestsInterval);
    fetchPickupRequests();
    pickupRequestsInterval = setInterval(fetchPickupRequests, 10000); 
}

async function fetchPickupRequests() {
    try {
        const response = await fetch(API_URLS.PICKUP_REQUESTS);
        const result = await response.json();
        if (response.ok && result.success) {
            pickupRequests = (result.requests || []).map(r => ({ ...r, urgent: r.urgent || (r.details && /urgent|asap|immediate/i.test(r.details)) }));
            renderPickupRequests();
            isOffline = false;
        } else {
            pickupRequests = [];
            renderPickupRequests();
        }
    } catch (e) {
        isOffline = true;
        renderPickupRequests(); // Render empty or cached
        // Silent fail or toast once
    }
}

function renderPickupRequests() {
    const containerId = 'pickup-requests-panel';
    let container = document.getElementById(containerId);
    if (!container) {
        const panel = document.createElement('div');
        panel.id = containerId;
        panel.className = 'bg-white p-4 rounded-xl shadow-lg border-t-4 border-amber-500 mt-6';
        panel.innerHTML = `
            <h2 class="text-xl font-bold mb-3 text-amber-700 flex items-center">Pickup Requests <span id="pickup-count-badge" class="ml-2 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">0</span></h2>
            <div id="pickup-filter-bar" class="flex flex-wrap gap-2 mb-2 items-center">
                <select id="pickup-filter-select" class="border rounded px-2 py-1 text-xs" onchange="pickupFilter=this.value; renderPickupRequests()">
                    <option value="all">All</option><option value="pending">Pending</option><option value="urgent">Urgent</option>
                </select>
            </div>
            <div id="pickup-requests-list" class="space-y-3"></div>
        `;
        const ref = document.getElementById('job-actions-panel');
        ref.parentNode.insertBefore(panel, ref.nextSibling);
        container = panel;
    }

    let filtered = pickupRequests.slice();
    if (pickupFilter === 'pending') filtered = filtered.filter(r => r.status !== 'Completed');
    if (pickupFilter === 'urgent') filtered = filtered.filter(r => r.urgent);
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const list = container.querySelector('#pickup-requests-list');
    container.querySelector('#pickup-count-badge').innerText = filtered.filter(r => r.status !== 'Completed').length;

    if (!filtered.length) {
        list.innerHTML = '<div class="text-gray-500 text-center py-4">No pickup requests.</div>';
        return;
    }

    list.innerHTML = filtered.map(req => `
        <div class="border ${req.urgent ? 'border-red-400 bg-red-50' : req.status === 'Completed' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} rounded-lg p-3 flex flex-col gap-2">
            <div class="font-bold text-gray-800 flex justify-between">${req.address} ${req.urgent ? '🔴' : ''}</div>
            <div class="text-xs text-gray-500">${req.details || ''}</div>
            <div class="flex justify-between items-center">
                 <span class="text-xs font-semibold ${req.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}">${req.status}</span>
                 ${req.status !== 'Completed' ? `<button class="bg-emerald-600 text-white font-bold py-1 px-3 rounded text-xs" onclick="completePickupRequest(${req.id})">Done</button>` : ''}
            </div>
        </div>
    `).join('');
}

async function completePickupRequest(id) {
    try {
        const response = await fetch(API_URLS.COMPLETE_PICKUP, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (response.ok) {
            const req = pickupRequests.find(r => r.id === id);
            if (req) req.status = 'Completed';
            renderPickupRequests();
            showToast('Pickup completed!');
        }
    } catch (e) {
        showToast('Connection failed', 'error');
    }
}