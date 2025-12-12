import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ArtistType, Era, Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simplified schema to reduce token count and improve speed
const songSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Song title" },
    artist: { type: Type.STRING, description: "Artist name" },
    year: { type: Type.STRING, description: "Year" },
    album: { type: Type.STRING, description: "Album" },
    duration: { type: Type.STRING, description: "MM:SS" }
  },
  required: ["title", "artist", "year", "album", "duration"]
};

export const fetchRecommendations = async (artistType: ArtistType, era: Era): Promise<Song[]> => {
  const model = "gemini-2.5-flash";
  
  // Random seed for variety
  const randomContext = Math.random().toString(36).substring(7);
  const adjectives = ["classic", "top-rated", "sentimental", "dynamic", "golden", "legendary"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  const prompt = `
    Generate a list of 20 Cantonese Pop songs.
    Session: ${randomContext}.
    Context: Era ${era}, Artist ${artistType}, Style ${randomAdjective}.
    Rules: Real HK Cantopop songs only. Unique selection.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: songSchema
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Song[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};
