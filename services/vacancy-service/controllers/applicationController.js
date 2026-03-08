const Application = require('../models/Application');

const getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.id;
        // Populate vacancy details so frontend can display them
        const applications = await Application.find({ studentId }).populate('vacancyId').sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch applications", error: error.message });
    }
};

module.exports = {
    getMyApplications
};
