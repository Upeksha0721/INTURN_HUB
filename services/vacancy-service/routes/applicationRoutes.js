const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, applicationController.getMyApplications);

module.exports = router;
