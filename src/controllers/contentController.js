const {
  detectNsfw,
  detectAgeRapidAPI,
  moderateContentRapidAPI,
} = require("../services/huggingFaceService");
const { sendGuardianAlertEmail } = require("../services/notificationService");

// NSFW Detection Handler
const nsfwDetectionHandler = async (req, res) => {
  console.log("NSFW Detection Handler triggered");
  try {
    const imageBuffer = req.file.buffer;
    console.log("File buffer received:", imageBuffer);

    // Get NSFW detection result
    const result = await detectNsfw(imageBuffer);
    console.log("NSFW detection result:", result);

    // Find the NSFW score from the result (looking for the 'nsfw' label)
    const nsfwResult = result.find(item => item.label === "nsfw");
    const nsfwScore = nsfwResult ? nsfwResult.score : 0;
    console.log("NSFW Score:", nsfwScore);

    const NSFW_THRESHOLD = 0.5; // You can adjust this threshold based on your needs

    if (nsfwScore > NSFW_THRESHOLD) {
      // Send alert to the guardian's email
      await sendGuardianAlertEmail(
        req.body.guardianEmail, // Get guardian email from request body
        `Alert: A high NSFW score was detected in the uploaded image. Please review the content.`
      );
      console.log("Guardian alert email sent.");
    }

    res.status(200).json({ nsfwScore: result });
  } catch (error) {
    console.error("NSFW detection failed:", error);
    res.status(500).json({ error: "NSFW detection failed." });
  }
};

// Age Detection Handler
const ageDetectionRapidAPIHandler = async (req, res) => {
  console.log("Age Detection Handler triggered");
  try {
    const { imageURL, guardianEmail } = req.body;
    console.log("Image URL:", imageURL);
    console.log("Guardian Email:", guardianEmail);

    const result = await detectAgeRapidAPI(imageURL);
    console.log("Age detection result:", result);

    const age = result?.agePrediction?.age;

    if (age < 18) {
      // Send alert to the guardian's email
      await sendGuardianAlertEmail(
        guardianEmail,
        `Alert: An underage user (detected age: ${age}) attempted to access age-restricted content.`
      );
      console.log("Guardian alert email sent.");
    }

    res.status(200).json({ agePrediction: result });
  } catch (error) {
    console.error("Age detection failed:", error);
    res.status(500).json({ error: "Age detection failed." });
  }
};

// Content Moderation Handler (Text)
const contentModerationHandler = async (req, res) => {
  console.log("Content Moderation Handler triggered");
  try {
    const { text, guardianEmail } = req.body;
    console.log("Text to moderate:", text);
    console.log("Guardian Email:", guardianEmail);

    const result = await moderateContentRapidAPI(text);
    console.log("Content moderation result:", result);

    // Define a threshold for flagging content as harmful (e.g., 50%)
    const FLAG_THRESHOLD = 0.5;
    const sensitiveCategories = [
      "sexuality",
      "violence",
      "substance_abuse",
      "hate_speech",
      "profanity",
      "nudity",
    ];

    // Check if any sensitive category exceeds the threshold
    const flaggedContent = sensitiveCategories.some(category => {
      const score = parseFloat(result.result[category].replace("%", "")) / 100;
      return score > FLAG_THRESHOLD;
    });

    if (flaggedContent) {
      // Send alert to the guardian's email
      await sendGuardianAlertEmail(
        guardianEmail,
        `Alert: Potentially harmful content detected. Please review the following: "${text}"`
      );
      console.log("Guardian alert email sent.");
    }

    res.status(200).json({ moderationResult: result });
  } catch (error) {
    console.error("Content moderation failed:", error);
    res.status(500).json({ error: "Content moderation failed." });
  }
};

module.exports = {
  nsfwDetectionHandler,
  ageDetectionRapidAPIHandler,
  contentModerationHandler,
};
