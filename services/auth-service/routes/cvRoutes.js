const router = require('express').Router();
const { getCV, saveCV } = require('../controllers/cvController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCV);
router.post('/', protect, saveCV);

module.exports = router;