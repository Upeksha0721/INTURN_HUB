const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancyController');
const { protect } = require('../middleware/authMiddleware');

// Vacancy routes
router.post('/', vacancyController.createVacancy);
router.get('/', vacancyController.getAllVacancies);
router.get('/:id', vacancyController.getVacancyById);
router.put('/:id', vacancyController.updateVacancy);
router.delete('/:id', vacancyController.deleteVacancy);
router.post('/:id/apply', protect, vacancyController.applyVacancy);

module.exports = router;
