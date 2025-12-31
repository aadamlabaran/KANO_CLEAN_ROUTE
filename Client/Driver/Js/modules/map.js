import { state } from './state.js';

let map;
let markers = [];

export function initMap() {
    // Kano Center Coordinates
    map = L.map('map-container').setView([12.0022, 8.5919], 13);

    // Load Tiles (OpenStreetMap - Free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    renderRoute();
}

export function renderRoute() {
    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    state.jobs.forEach((job, index) => {
        if (job.status === 'completed') return; // Don't show done jobs

        const color = index === state.currentJobIndex ? 'red' : 'blue';
        
        // Custom Marker
        const marker = L.circleMarker([job.lat, job.lng], {
            color: color,
            radius: 10,
            fillOpacity: 0.8
        }).addTo(map).bindPopup(job.address);

        markers.push(marker);
    });
}