// Server/Controllers/mainController.js
const db = require('../Modules/mockData'); // Import your data

// 1. Handle Login
exports.loginUser = (req, res) => {
    const { id, password } = req.body;
    console.log(`Login attempt: ${id}`);

    const user = db.users.find(u => u.id === id && u.pass === password);

    if (user) {
        res.json({ success: true, role: user.role, name: user.name });
    } else {
        res.status(401).json({ success: false, message: 'Invalid ID or Password' });
    }
};

// 2. Get All Jobs
exports.getJobs = (req, res) => {
    res.json(db.jobs);
};

// 3. Create Job
exports.createJob = (req, res) => {
    const newJob = {
        id: db.jobs.length + 101,
        type: 'Pickup',
        status: 'Pending',
        location: req.body.location || 'Unknown',
        date: new Date().toLocaleDateString()
    };
    db.jobs.push(newJob);
    res.json({ success: true, job: newJob });
};

// 4. Update Job
exports.updateJob = (req, res) => {
    const jobId = parseInt(req.params.id);
    const job = db.jobs.find(j => j.id === jobId);
    
    if (job) {
        job.status = req.body.status;
        res.json({ success: true, job });
    } else {
        res.status(404).json({ success: false, message: 'Job not found' });
    }
};

// 5. Get Dashboard Stats
exports.getStats = (req, res) => {
    res.json({
        totalVolume: '124.5 T',
        activeFleet: '18/22',
        alerts: db.alerts.length
    });
};