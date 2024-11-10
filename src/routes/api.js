const express = require("express");
const multer = require("multer");
const {
  nsfwDetectionHandler,
  ageDetectionRapidAPIHandler,
  contentModerationHandler,
} = require("../controllers/contentController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Test route to confirm API is working
router.get("/test", (req, res) => {
  res.json({ message: "SafeNet API is working!" });
});

// File upload route
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully!",
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
  });
});

// Route for Hugging Face NSFW detection
router.post("/detect-nsfw", upload.single("file"), nsfwDetectionHandler);

// Route for RapidAPI age detection (using image URL)
router.post("/detect-age-rapidapi", ageDetectionRapidAPIHandler);

// Route for RapidAPI content moderation (text-based)
router.post("/moderate-content", contentModerationHandler);

module.exports = router;
