const axios = require("axios");

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const BASE_URL_HF = "https://api-inference.huggingface.co/models";
const BASE_URL_RAPIDAPI_AGE = "https://age-detection2.p.rapidapi.com/age";
const BASE_URL_RAPIDAPI_NSFW_TEXT =
  "https://nsfw-text-detection-service-content-safety-api.p.rapidapi.com/?get=check&noqueue=1";

// Hugging Face headers
const headersHF = {
  Authorization: `Bearer ${HF_API_KEY}`,
};

// RapidAPI headers for Age Detection
const headersRapidAPI_Age = {
  "x-rapidapi-key": RAPIDAPI_KEY,
  "x-rapidapi-host": "age-detection2.p.rapidapi.com",
  "Content-Type": "application/json",
};

// RapidAPI headers for NSFW Text Detection
const headersRapidAPI_NsfwText = {
  "x-rapidapi-key": RAPIDAPI_KEY,
  "x-rapidapi-host":
    "nsfw-text-detection-service-content-safety-api.p.rapidapi.com",
  "Content-Type": "application/json",
};

// NSFW Detection (Hugging Face)
const detectNsfw = async imageBuffer => {
  try {
    const response = await axios.post(
      `${BASE_URL_HF}/Falconsai/nsfw_image_detection`,
      imageBuffer,
      {
        headers: {
          ...headersHF,
          "Content-Type": "application/octet-stream",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in detectNsfw (Hugging Face):", error);
    throw error;
  }
};

// Age Detection (RapidAPI)
const detectAgeRapidAPI = async imageURL => {
  try {
    const response = await axios.post(
      BASE_URL_RAPIDAPI_AGE,
      JSON.stringify({ image: imageURL, return_face: false }),
      {
        headers: headersRapidAPI_Age,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in detectAgeRapidAPI:", error);
    throw error;
  }
};

// Content Moderation (NSFW Text Detection - RapidAPI)
const moderateContentRapidAPI = async text => {
  try {
    const response = await axios.post(
      BASE_URL_RAPIDAPI_NSFW_TEXT,
      JSON.stringify({ content: text }),
      { headers: headersRapidAPI_NsfwText }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in moderateContentRapidAPI (NSFW Text Detection):",
      error
    );
    throw error;
  }
};

module.exports = { detectNsfw, detectAgeRapidAPI, moderateContentRapidAPI };
