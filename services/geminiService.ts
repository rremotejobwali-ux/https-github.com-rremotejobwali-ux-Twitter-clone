import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTweetContent = async (topic: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI services unavailable. Please check API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, engaging tweet about ${topic}. Keep it under 280 characters. Do not include hashtags unless necessary. Just the text.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Tweet Gen Error:", error);
    return "Could not generate tweet. Try again.";
  }
};

export const enhanceBio = async (currentBio: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return currentBio;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following social media bio to be more professional yet witty and engaging. Keep it short. Bio: "${currentBio}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Bio Gen Error:", error);
    return currentBio;
  }
};