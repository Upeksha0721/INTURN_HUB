const mongoose = require("mongoose");

const VacancySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    deadline: { type: Date },
    postedBy: { type: String },
    imageUrl: { type: String, default: '' },
    salary: { type: String, default: '' },
    jobType: { type: String, enum: ['Internship', 'Full-time', 'Part-time'], default: 'Internship' },
    skills: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vacancy", VacancySchema);