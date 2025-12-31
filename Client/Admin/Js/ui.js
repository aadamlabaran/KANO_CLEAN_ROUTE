function switchTab(tabId) {
    document.querySelectorAll('main > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('tab-active', 'text-blue-600');
        btn.classList.add('text-gray-500');
    });
    
    const navBtn = document.getElementById(`nav-${tabId}`);
    navBtn.classList.add('tab-active', 'text-blue-600');
    navBtn.classList.remove('text-gray-500');
    
    if (tabId === 'dashboard') {
        if (charts.volume) charts.volume.resize();
        if (charts.completed) charts.completed.resize();
    } else if (tabId === 'fleet') {
        renderFleetTable();
    } else if (tabId === 'compliance') {
        renderComplianceTable();
    }
}

let currentModalAction = null; 

function showModal(action, portal = null, identifier = null) {
    const modal = document.getElementById('action-modal');
    const title = document.getElementById('modal-action-title');
    const text = document.getElementById('modal-action-text');
    const form = document.getElementById('modal-action-form');
    form.innerHTML = '';
    currentModalAction = { action: action, identifier: identifier };

    if (action === 'reassign-job') {
        title.innerText = `Reassign Job for ${identifier}`;
        text.innerText = `Select a new route or stop for this truck.`;
        form.innerHTML = `<label for="new-route" class="block text-sm font-medium text-gray-700">New Route/Destination</label><select id="new-route" class="w-full border border-gray-300 rounded-lg p-2 mt-1"><option value="R-Central">R-Central (Emergency)</option><option value="R-North">R-North (Dawanau)</option><option value="Depot">Return to Depot</option></select>`;
    } else if (action === 'view-alert') {
         let alert = alertsData.find(a => a.id == identifier);
         title.innerText = `View Field Alert #${identifier}`;
         text.innerText = `Report Type: ${alert.type} | Severity: ${alert.severity}. Truck: ${alert.truck}.`;
         form.innerHTML = `<p class="p-3 bg-red-50 rounded-lg text-sm font-semibold">Location: ${alert.location}. Notes: Access Blocked. Requires KAROTA intervention.</p>`;
    } else if (action === 'view-log') {
        title.innerText = `View Log for ${identifier}`;
        text.innerText = `Displaying compliance log history for ${identifier}.`;
        form.innerHTML = `<ul class="list-disc list-inside text-sm p-3 bg-gray-50 rounded-lg">${complianceData.filter(log => log.truck === identifier).map(log => `<li>${log.time}: ${log.action} (${log.weight}T) - Status: ${log.compliance}</li>`).join('')}</ul>`;
    }

    modal.classList.remove('hidden');
}

function hideModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function handleModalAction() {
    if (currentModalAction.action === 'reassign-job') {
        const newRoute = document.getElementById('new-route').value;
        const truckId = currentModalAction.identifier;
        const truck = fleetData.find(t => t.id === truckId);
        
        if (truck) {
            truck.currentStop = `Re-assigned to: ${newRoute}`;
            truck.status = 'Active';
            renderFleetTable(); 
            alert(`Truck ${truckId} reassigned to ${newRoute}.`);
        }
    } else if (currentModalAction.action === 'view-alert') {
        const alertId = parseInt(currentModalAction.identifier);
        const index = alertsData.findIndex(a => a.id == alertId); 
        if (index !== -1) {
            alertsData.splice(index, 1);
            updateKPIs({ routesCompleted: parseFloat(document.getElementById('kpi-routes-completed').innerText), activeTrucks: parseFloat(document.getElementById('kpi-active-trucks').innerText) }); 
            renderAlerts();
            alert(`Alert #${alertId} dismissed.`);
        }
    }
    hideModal('action-modal');
}