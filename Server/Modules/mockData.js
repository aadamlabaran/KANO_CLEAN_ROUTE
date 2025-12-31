// Server/Modules/mockData.js

const db = {
    users: [
        { id: 'ADMIN', pass: 'admin123', role: 'admin', name: 'Central Command' },
        { id: 'TK-01', pass: 'driver123', role: 'driver', name: 'Ibrahim Musa' },
        { id: 'RES-01', pass: 'user123', role: 'resident', name: 'Fatima Ali' }
    ],
    jobs: [
        { id: 101, type: 'Pickup', status: 'Pending', location: 'Sabon Gari', weight: 'N/A' },
        { id: 102, type: 'Disposal', status: 'In-Progress', location: 'Kantin Kwari', weight: '1.2T' }
    ],
    alerts: [
        { id: 1, type: 'Critical', msg: 'Bin #402 Overflow', location: 'State Road' }
    ]
};

module.exports = db;