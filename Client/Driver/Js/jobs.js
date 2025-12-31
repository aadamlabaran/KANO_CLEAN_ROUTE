function updateMetrics() {
    document.getElementById('truck-load').innerText = `${truckLoadPercentage}% 📦`;
    const el = document.getElementById('truck-load');
    el.classList.remove('text-red-600', 'text-yellow-600');
    
    if (truckLoadPercentage > 75) el.classList.add('text-red-600');
    else if (truckLoadPercentage > 50) el.classList.add('text-yellow-600');
}

function updateJobCard() {
    const job = driverRoute[currentJobIndex];
    
    if (!job || job.status === 'Completed') {
        document.getElementById('stop-details').innerHTML = '<p class="text-xl text-emerald-600 font-extrabold text-center py-4">All stops complete on current route.</p>';
        document.getElementById('confirmation-view').classList.add('hidden');
        document.getElementById('report-issue').classList.add('hidden');
        switchActionView('stop-details');
        return;
    }

    document.getElementById('job-address').innerText = job.address;
    document.getElementById('job-type').innerText = job.type;
    document.getElementById('job-instructions').innerText = job.instructions;
    
    document.getElementById('confirm-address').innerText = job.address;
    document.getElementById('report-location').innerText = job.address + " (Stop " + job.id + ")";
    document.getElementById('confirm-job-id').innerText = job.id;
}

function updateJobHistory() {
    const historyList = document.getElementById('job-history');
    if (!historyList) return;
    historyList.innerHTML = '';
    
    if (jobHistory.length === 0) {
        historyList.innerHTML = '<li class="text-gray-500 p-2">No jobs completed yet.</li>';
        return;
    }
    jobHistory.forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex justify-between text-gray-700 py-1 border-b border-gray-50';
        li.innerHTML = `<span>Stop ${item.id}: ${item.address.split(',')[0]}</span><span class="text-xs text-emerald-600 font-semibold">${item.weight} T</span>`;
        historyList.appendChild(li);
    });
}

function showCompleteModal() {
    document.getElementById('completion-modal').classList.remove('hidden');
}

async function completeJob() {
    hideModal('completion-modal');
    const job = driverRoute[currentJobIndex];
    const weight = parseFloat(document.getElementById('weight-input').value);
    
    if (weight <= 0 || isNaN(weight)) {
        alert("Invalid weight logged.");
        return;
    }
    
    try {
        const response = await fetch(API_URLS.COMPLETE_JOB, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                driverId: loggedInDriverInfo.id,
                truckId: loggedInDriverInfo.truck,
                jobId: job.id,
                weight: weight
            })
        });

        if (!response.ok) throw new Error("Backend failed");
        const result = await response.json();

        // Local updates
        job.status = 'Completed';
        jobHistory.push({ id: job.id, address: job.address, weight: weight.toFixed(1) });
        truckLoadPercentage = Math.min(100, truckLoadPercentage + 15); 

        const nextPendingIndex = driverRoute.findIndex(j => j.status === 'Pending');
        currentJobIndex = nextPendingIndex !== -1 ? nextPendingIndex : driverRoute.length;

        updateMap();
        updateJobCard();
        updateMetrics();
        updateJobHistory();
        switchActionView('stop-details');
        
        showToast(`Job ${job.id} Logged!`);
    } catch (error) {
        console.error(error);
        alert(`Error: Job could not be saved. Check server.`);
    }
}