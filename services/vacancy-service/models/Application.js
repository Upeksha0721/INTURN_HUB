const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentId: { 
        type: String, 
        required: true 
    },
    studentName: { 
        type: String, 
        required: true 
    },
    vacancyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Vacancy", 
        required: true 
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
