// Server/routes/apiRoutes.js
const express = require('express');
const router = express.Router();

// --- MOCK DATABASE (The "Key List") ---
const USERS = {
    'admin':  { password: 'admin123', role: 'admin' },
    'driver': { password: 'truck1',   role: 'driver' },
    'resident': { password: 'home1',  role: 'resident' }
};

// --- LOGIN ROUTE ---
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // 🔍 SPY LOG: This prints to your VS Code Terminal
    console.log(`👉 Login Attempt: User="${username}" | Pass="${password}"`);

    const user = USERS[username]; // Look up the user

    if (user && user.password === password) {
        // MATCH!
        console.log("✅ Login Success!");
        res.json({ success: true, role: user.role });
    } else {
        // NO MATCH
        console.log("❌ Login Failed");
        res.json({ success: false, message: 'Invalid ID or Password' });
    }
});

module.exports = router;