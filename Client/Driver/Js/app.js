import { state, updateState } from './modules/state.js';
import { syncData, processQueue } from './modules/api.js';
import { initMap, renderRoute } from './modules/map.js';
import { updateDashboard } from './modules/ui.js';
import { initVoice } from './modules/voice.js';

// --- EVENT LISTENERS ---

// 1. Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('driver-id').value;
    // Simulate Login (In production, this would use api.js)
    localStorage.setItem('authToken', 'fake-jwt-token-123');
    updateState('driver', id);
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    initApp();
});

// 2. Network Status Monitoring (Offline/Online)
window.addEventListener('online', () => {
    document.getElementById('connection-status').innerText = '● Online';
    document.getElementById('connection-status').style.color = 'green';
    processQueue(); // Sync data immediately
});
window.addEventListener('offline', () => {
    document.getElementById('connection-status').innerText = '● Offline';
    document.getElementById('connection-status').style.color = 'red';
});

// 3. Complete Job Button
document.getElementById('btn-complete').addEventListener('click', handleCompleteJob);

// 4. Voice Button
const voiceRec = initVoice({
    onComplete: handleCompleteJob,
    onNavigate: () => alert('Launching Navigation...')
});
document.getElementById('btn-voice').addEventListener('click', () => {
    alert("Listening... Say 'Complete' or 'Navigate'");
    voiceRec.start();
});

// --- LOGIC ---

function initApp() {
    initMap();
    updateDashboard();
    processQueue(); // Check for old data on startup
}

async function handleCompleteJob() {
    const job = state.jobs[state.currentJobIndex];
    if (!job) return;

    // 1. Optimistic UI Update (Update screen instantly)
    job.status = 'completed';
    updateState('truckLoad', state.truckLoad + 15);
    updateState('currentJobIndex', state.currentJobIndex + 1);
    
    updateDashboard();
    renderRoute(); // Update map markers

    // 2. Send Data (Handles Offline Automatically)
    const success = await syncData('/job/complete', {
        jobId: job.id,
        driverId: state.driver,
        timestamp: Date.now()
    });

    if (!success) {
        updateDashboard(); // Will show offline queue indicator
    } else {
        alert("Job Logged to Server!");
    }
}

// React to state changes
window.addEventListener('stateChanged', () => {
    updateDashboard();
});