// --- CENTRAL DATA STORE ---

// 1. Define the Initial State
export const state = {
    // Auth Info
    driver: null,
    vehicle: null,

    // Route / Jobs Data (Demo Data for Kano)
    jobs: [
        { 
            id: 101, 
            lat: 12.0022, 
            lng: 8.5919, 
            address: "Bayero Univ. Campus", 
            type: "Commercial",
            status: 'pending', 
            instructions: "Enter via West Gate."
        },
        { 
            id: 102, 
            lat: 11.9964, 
            lng: 8.5167, 
            address: "Kano Emir's Palace", 
            type: "Residential",
            status: 'pending', 
            instructions: "Restricted access. Call security."
        },
        { 
            id: 103, 
            lat: 11.9764, 
            lng: 8.5367, 
            address: "Sabon Gari Market", 
            type: "Organic Waste",
            status: 'pending', 
            instructions: "Heavy traffic area."
        }
    ],

    // Tracking Progress
    currentJobIndex: 0,
    truckLoad: 45, // Starting load percentage

    // Offline Management (Loads saved data from browser storage)
    offlineQueue: JSON.parse(localStorage.getItem('offlineQueue')) || []
};

// 2. State Updater Function
// Call this function whenever you want to change data.
// It automatically tells the rest of the app to update the UI.
export function updateState(key, value) {
    // Update the internal state object
    state[key] = value;

    // Special handling: If we modify the offline queue, save it to LocalStorage immediately
    if (key === 'offlineQueue') {
        localStorage.setItem('offlineQueue', JSON.stringify(value));
    }

    // Debugging log (optional, helps you see what's happening)
    console.log(`State Change: [${key}]`, value);

    // Trigger a custom event that 'app.js' and 'ui.js' listen for
    window.dispatchEvent(new CustomEvent('stateChanged', { 
        detail: { key, value } 
    }));
}