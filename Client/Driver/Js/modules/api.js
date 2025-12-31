import { state, updateState } from './state.js';

const SERVER_URL = 'http://127.0.0.1:3000/api';

// 1. Generic Secure Fetch with JWT Simulation
async function secureFetch(endpoint, data) {
    const token = localStorage.getItem('authToken');
    
    // Simulate Network Check
    if (!navigator.onLine) {
        throw new Error('OFFLINE');
    }

    const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Professional Security Header
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

// 2. The Queue Manager
export async function syncData(endpoint, data) {
    try {
        console.log(`Trying to sync: ${endpoint}`);
        const result = await secureFetch(endpoint, data);
        console.log('Sync Success:', result);
        return true;
    } catch (e) {
        if (e.message === 'OFFLINE' || e.name === 'TypeError') {
            console.warn('Network down. Queuing data...');
            addToQueue(endpoint, data);
            return false; // Handled offline
        }
        throw e; // Real error
    }
}

function addToQueue(endpoint, data) {
    const queue = state.offlineQueue;
    queue.push({ endpoint, data, timestamp: Date.now() });
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
    updateState('offlineQueue', queue);
}

// 3. Process Queue when Online
export async function processQueue() {
    if (state.offlineQueue.length === 0) return;
    
    console.log('Processing offline queue...');
    const queue = [...state.offlineQueue];
    const failed = [];

    for (const item of queue) {
        try {
            await secureFetch(item.endpoint, item.data);
        } catch (e) {
            failed.push(item); // Keep in queue if still failing
        }
    }

    localStorage.setItem('offlineQueue', JSON.stringify(failed));
    updateState('offlineQueue', failed);
}