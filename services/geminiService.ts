import { GoogleGenAI, Type } from "@google/genai";
import { WordGenerationResult } from "../types";
import { FALLBACK_WORDS } from "../constants";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateGameWord = async (): Promise<WordGenerationResult> => {
  if (!ai) {
    console.warn("API Key not found, using fallback data.");
    return getRandomFallback();
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a category and a secret word for a social deduction game like Spyfall. The word should be a specific object, location, or profession. It should be commonly known.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The general category of the word (e.g., 'Kitchen Appliances', 'Locations', 'Jobs')."
            },
            word: {
              type: Type.STRING,
              description: "The secret word itself (e.g., 'Toaster', 'Eiffel Tower', 'Firefighter')."
            }
          },
          required: ["category", "word"]
        }
      }
    });

    const jsonText = response.text;
    if (jsonText) {
      return JSON.parse(jsonText) as WordGenerationResult;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getRandomFallback();
  }
};

const getRandomFallback = (): WordGenerationResult => {
  const randomIndex = Math.floor(Math.random() * FALLBACK_WORDS.length);
  return FALLBACK_WORDS[randomIndex];
};
