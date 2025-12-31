const express = require('express');
const cors = require('cors');
const path = require('path');

// Import your custom modules
const config = require('./Config/config');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
// 1. Mount API Routes
app.use('/api', apiRoutes);

// 2. Serve Frontend Files (The Client Folder)
// We go up one level (..) to find Client
app.use(express.static(path.join(__dirname, '../Client')));

// 3. Fallback Route (Send index.html for any other request)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/Main.html'));
});

// --- START SERVER ---
app.listen(config.PORT, () => {
    console.log(`
    =============================================
    ♻️  KANO CLEANROUTE SERVER RUNNING
    =============================================
    🚀 Mode:   ${config.ENV}
    🔗 Port:   ${config.PORT}
    📂 Client: Connected
    =============================================
    `);
});