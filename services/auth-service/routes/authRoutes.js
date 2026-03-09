const router = require('express').Router();
const {
  register,
  login,
  getProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/profile',   protect, getProfile);
router.get('/users',     protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;