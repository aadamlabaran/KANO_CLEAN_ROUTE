function renderComplianceTable() {
    const tbody = document.getElementById('compliance-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    complianceData.forEach(log => {
        let complianceColor = log.compliance === 'OK' ? 'text-emerald-600' : 'text-red-600';

        const row = tbody.insertRow();
        row.className = 'hover:bg-gray-50 transition-colors';
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium">${log.id}</td>
            <td class="px-4 py-3 text-sm">${log.truck}</td>
            <td class="px-4 py-3 text-sm">${log.time}</td>
            <td class="px-4 py-3 text-sm">${log.action}</td>
            <td class="px-4 py-3 text-sm">${log.weight} Tons</td>
            <td class="px-4 py-3 text-sm font-semibold ${complianceColor}">${log.compliance}</td>
        `;
    });
}