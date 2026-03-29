const Vacancy = require('../models/vacancy');
const Application = require('../models/Application');

const convertToEndOfDay = (dateString) => {
    const date = new Date(dateString);
    date.setHours(23, 59, 59, 999);
    return date;
};

// Create a new vacancy
const createVacancy = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            location,
            deadline,
            imageUrl,
            salary,
            jobType,
            skills
        } = req.body;

        const postedBy = req.user.id;

        if (!title || !company) {
            return res.status(400).json({ message: "Title and company are required." });
        }

        if (!deadline) {
            return res.status(400).json({ message: "Deadline is required." });
        }

        const formattedDeadline = convertToEndOfDay(deadline);

        if (formattedDeadline < new Date()) {
            return res.status(400).json({ message: "Deadline cannot be in the past." });
        }

        const newVacancy = new Vacancy({
            title,
            company,
            description,
            location,
            deadline: formattedDeadline,
            postedBy,
            imageUrl: imageUrl || '',
            salary: salary || '',
            jobType: jobType || 'Internship',
            skills: skills || []
        });

        const savedVacancy = await newVacancy.save();
        res.status(201).json(savedVacancy);
    } catch (error) {
        res.status(500).json({ message: "Failed to create vacancy", error: error.message });
    }
};

// Get only visible vacancies for users
const getVisibleVacancies = async (req, res) => {
    try {
        const now = new Date();

        const vacancies = await Vacancy.find({
            deadline: { $gte: now }
        }).sort({ createdAt: -1 });

        res.status(200).json(vacancies);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch vacancies", error: error.message });
    }
};

// Get all vacancies for admin
const getAllVacancies = async (req, res) => {
    try {
        const vacancies = await Vacancy.find().sort({ createdAt: -1 });
        res.status(200).json(vacancies);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch vacancies", error: error.message });
    }
};

// Get a single vacancy by ID
const getVacancyById = async (req, res) => {
    try {
        const vacancy = await Vacancy.findById(req.params.id);

        if (!vacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        res.status(200).json(vacancy);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch vacancy", error: error.message });
    }
};

// Update a vacancy
const updateVacancy = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.deadline) {
            const formattedDeadline = convertToEndOfDay(updateData.deadline);

            if (formattedDeadline < new Date()) {
                return res.status(400).json({ message: "Deadline cannot be in the past." });
            }

            updateData.deadline = formattedDeadline;
        }

        const updatedVacancy = await Vacancy.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedVacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        res.status(200).json(updatedVacancy);
    } catch (error) {
        res.status(500).json({ message: "Failed to update vacancy", error: error.message });
    }
};

// Delete a vacancy
const deleteVacancy = async (req, res) => {
    try {
        const deletedVacancy = await Vacancy.findByIdAndDelete(req.params.id);

        if (!deletedVacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        res.status(200).json({ message: "Vacancy deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete vacancy", error: error.message });
    }
};

// Apply for a vacancy
const applyVacancy = async (req, res) => {
    try {
        const vacancyId = req.params.id;
        const studentId = req.user.id;
        const studentName = req.user.name;

        // Check if vacancy exists
        const vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        // Prevent applying for expired vacancy
        if (new Date(vacancy.deadline) < new Date()) {
            return res.status(400).json({ message: "This vacancy has expired." });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            vacancyId,
            studentId
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this vacancy." });
        }

        const newApplication = new Application({
            studentId,
            studentName,
            vacancyId
        });

        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (error) {
        res.status(500).json({ message: "Failed to apply for vacancy", error: error.message });
    }
};

module.exports = {
    createVacancy,
    getVisibleVacancies,
    getAllVacancies,
    getVacancyById,
    updateVacancy,
    deleteVacancy,
    applyVacancy
};