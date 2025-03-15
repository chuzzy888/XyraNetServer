// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
