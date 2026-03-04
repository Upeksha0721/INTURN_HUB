const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const studyMaterialRoutes = require("./routes/studyMaterial.routes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Study Material Service Running");
});

app.use("/api/study-materials", studyMaterialRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});