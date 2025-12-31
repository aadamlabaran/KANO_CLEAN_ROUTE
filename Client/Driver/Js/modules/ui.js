import { state } from './state.js';

export function updateDashboard() {
    const job = state.jobs[state.currentJobIndex];
    
    // Update Job Card
    if (job) {
        document.getElementById('current-job-title').innerText = `Stop #${job.id}`;
        document.getElementById('current-job-addr').innerText = job.address;
    } else {
        document.getElementById('current-job-title').innerText = "All Done!";
        document.getElementById('current-job-addr').innerText = "Return to base.";
        document.getElementById('btn-complete').disabled = true;
    }

    // Update Load
    document.getElementById('load-stat').innerText = `${state.truckLoad}%`;

    // Update List
    const list = document.getElementById('job-list');
    list.innerHTML = state.jobs.map(j => 
        `<li style="padding:0.5rem; border-bottom:1px solid #eee; color:${j.status === 'completed' ? 'green' : 'black'}">
            ${j.status === 'completed' ? '✓' : '○'} ${j.address}
         </li>`
    ).join('');

    // Update Offline Indicator
    const indicator = document.getElementById('offline-indicator');
    if (state.offlineQueue.length > 0) {
        indicator.classList.remove('hidden');
        indicator.querySelector('p').innerText = `${state.offlineQueue.length} items queued.`;
    } else {
        indicator.classList.add('hidden');
    }
}