const CV = require('../models/CV');

exports.getCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user.id });
    if (!cv) return res.json(null);
    res.json(cv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveCV = async (req, res) => {
  try {
    const { versions, ...cvData } = req.body;
    
    // Get existing CV
    const existing = await CV.findOne({ userId: req.user.id });
    
    // Build versions array - keep max 5
    let existingVersions = existing?.versions || [];
    const newVersion = {
      versionNumber: existingVersions.length + 1,
      savedAt: new Date(),
      data: cvData
    };
    
    // Keep only last 5 versions
    existingVersions = [...existingVersions, newVersion].slice(-5);

    const cv = await CV.findOneAndUpdate(
      { userId: req.user.id },
      { ...cvData, userId: req.user.id, versions: existingVersions },
      { upsert: true, new: true }
    );
    res.json({ message: 'CV saved successfully!', cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};