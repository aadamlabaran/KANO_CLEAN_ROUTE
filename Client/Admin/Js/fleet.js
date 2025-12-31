function renderFleetTable() {
    const tbody = document.getElementById('fleet-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    fleetData.forEach(truck => {
        let statusColor = truck.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                          truck.status === 'Alert' ? 'bg-red-100 text-red-800' : 
                          truck.status === 'Depot' ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-200 text-gray-800';
        
        const row = tbody.insertRow();
        row.className = 'hover:bg-gray-50 transition-colors';
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-semibold">${truck.id}</td>
            <td class="px-4 py-3 text-sm">${truck.driver}</td>
            <td class="px-4 py-3 text-sm">${truck.load}%</td>
            <td class="px-4 py-3 text-sm">${truck.currentStop}</td>
            <td class="px-4 py-3">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}">${truck.status}</span>
            </td>
            <td class="px-4 py-3 text-sm font-medium space-x-2">
                <button onclick="showModal('reassign-job', null, '${truck.id}')" class="text-blue-600 hover:text-blue-900">Reassign</button>
                <button onclick="showModal('view-log', null, '${truck.id}')" class="text-gray-600 hover:text-gray-900">Log</button>
            </td>
        `;
    });
}