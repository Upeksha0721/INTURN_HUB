const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Vacancy = require('./models/vacancy');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/vacancies', require('./routes/vacancyRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.get('/', (req, res) => {
  res.json({ message: 'Vacancy Service is running ✅' });
});

const deleteExpiredVacancies = async () => {
  try {
    const now = new Date();
    const result = await Vacancy.deleteMany({ deadline: { $lt: now } });
    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} expired vacancies from DB.`);
    }
  } catch (err) {
    console.error('Failed to delete expired vacancies:', err);
  }
};

// Remove expired vacancies on startup and once every 24 hours
deleteExpiredVacancies();
setInterval(deleteExpiredVacancies, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Vacancy service running on port ${PORT} 🚀`);
});

// optional export for tests
module.exports = app;