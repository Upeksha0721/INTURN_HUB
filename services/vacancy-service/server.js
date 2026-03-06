const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use('/api/vacancy', require('./routes/vacancyRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Vacancy Service is running ✅' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Vacancy service running on port ${PORT} 🚀`);
});

// optional export for tests
module.exports = app;