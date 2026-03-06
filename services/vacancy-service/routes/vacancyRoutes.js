const express = require('express');
const router = express.Router();

// basic placeholder routes until the service implementation is ready
router.get('/', (req, res) => {
  res.json({ message: 'Vacancy service endpoint' });
});

module.exports = router;
