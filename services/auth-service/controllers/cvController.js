const CV = require('../models/CV');

// GET /api/cv — get student's CV
exports.getCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user.id });
    if (!cv) return res.json(null);
    res.json(cv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cv — save/update student's CV
exports.saveCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body, userId: req.user.id },
      { upsert: true, new: true }
    );
    res.json({ message: 'CV saved successfully!', cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};