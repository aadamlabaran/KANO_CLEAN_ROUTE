function updateKPIs(kpis) {
    document.getElementById('kpi-routes-completed').innerText = `${kpis.routesCompleted}%`;
    document.getElementById('kpi-active-trucks').innerText = `${kpis.activeTrucks} Active`;
    document.getElementById('kpi-alert-count').innerText = `${alertsData.length} Critical`;
}

function initCharts(totalVolume) {
    // 1. Doughnut Chart
    const ctxCompleted = document.getElementById('completedChart').getContext('2d');
    if (charts.completed) charts.completed.destroy();

    const completionRate = parseFloat(document.getElementById('kpi-routes-completed').innerText.replace('%', '')) || 85;
    
    charts.completed = new Chart(ctxCompleted, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completionRate, 100 - completionRate], 
                backgroundColor: ['var(--primary)', '#e5e7eb'], 
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: { legend: { display: false }, tooltip: { enabled: true } }
        }
    });

    // 2. Line Chart (Volume)
    const ctxVolume = document.getElementById('volumeChart').getContext('2d');
    if (charts.volume) charts.volume.destroy();
    
    const currentVolume = parseFloat(totalVolume) || 0;
    const volumeData = [currentVolume * 0.1, currentVolume * 0.4, currentVolume * 0.6, currentVolume * 0.8, currentVolume * 0.9, currentVolume]; 
    
    charts.volume = new Chart(ctxVolume, {
        type: 'line',
        data: {
            labels: ['06:00', '08:00', '10:00', '12:00', '14:00', 'Current'],
            datasets: [{
                label: 'Total Tonnage Collected (Today)',
                data: volumeData,
                borderColor: 'var(--success)', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Tonnage (T)' } } },
            plugins: { legend: { position: 'top' } }
        }
    });
}

function renderAlerts() {
    const feed = document.getElementById('alerts-feed');
    if (!feed) return;
    feed.innerHTML = '';
    
    alertsData.forEach(alert => {
        let colorClass = 'bg-gray-100 text-gray-800';
        if (alert.severity === 'High') colorClass = 'bg-red-100 text-red-800 border-l-4 border-red-500';
        if (alert.severity === 'Medium') colorClass = 'bg-amber-100 text-amber-800 border-l-4 border-amber-500';

        const div = document.createElement('div');
        div.className = `p-3 rounded-lg ${colorClass} flex justify-between items-center shadow-sm`;
        div.innerHTML = `
            <div>
                <p class="font-semibold">${alert.type} - ${alert.location}</p>
                <p class="text-xs text-gray-600">Truck ${alert.truck} reported at ${alert.time}</p>
            </div>
            <button onclick="showModal('view-alert', null, '${alert.id}')" class="text-blue-500 hover:text-blue-700 text-sm font-medium">View/Dismiss</button>
        `;
        feed.appendChild(div);
    });
}