const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Vacancy routes
router.post('/', protect, adminOnly, vacancyController.createVacancy);
router.get('/', vacancyController.getAllVacancies);
router.get('/:id', vacancyController.getVacancyById);
router.put('/:id', protect, adminOnly, vacancyController.updateVacancy);
router.delete('/:id', protect, adminOnly, vacancyController.deleteVacancy);
router.post('/:id/apply', protect, vacancyController.applyVacancy);

module.exports = router;
