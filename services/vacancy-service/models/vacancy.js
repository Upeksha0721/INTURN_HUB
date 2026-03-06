const mongoose = require("mongoose");

const VacancySchema = new mongoose.Schema(
  {
    title: {
         type: String, 
         required: true 
    },
    company: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    location: { 
        type: String 
    },
    deadline: { 
        type: Date 
    },
    postedBy: { 
        type: String 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vacancy", VacancySchema);
