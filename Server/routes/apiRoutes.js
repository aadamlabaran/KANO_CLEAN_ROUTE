// Server/routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../Controllers/mainController');

// Define the endpoints
router.post('/login', controller.loginUser);
router.get('/jobs', controller.getJobs);
router.post('/jobs', controller.createJob);
router.put('/jobs/:id', controller.updateJob);
router.get('/admin/stats', controller.getStats);

module.exports = router;