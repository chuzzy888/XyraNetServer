// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "https://xyra-net.vercel.app/", // replace with your frontend's live URL
  methods: ["GET", "POST", "PUT", "DELETE"], // specify allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // specify allowed headers
};

// Apply the CORS middleware to the app
app.use(cors(corsOptions));
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Start server
app.listen(PORT, () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
