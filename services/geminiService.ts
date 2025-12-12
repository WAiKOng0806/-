import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ArtistType, Era, Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const songSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The Cantonese name of the song" },
    artist: { type: Type.STRING, description: "The name of the artist or band in Chinese" },
    year: { type: Type.STRING, description: "The release year" },
    album: { type: Type.STRING, description: "The album name" },
    duration: { type: Type.STRING, description: "Duration in MM:SS format" },
    coverDescription: { type: Type.STRING, description: "A short visual description of the album cover mood/color (e.g. 'Dark Blue Melancholy', 'Red Energetic')" }
  },
  required: ["title", "artist", "year", "album", "duration"]
};

export const fetchRecommendations = async (artistType: ArtistType, era: Era): Promise<Song[]> => {
  const model = "gemini-2.5-flash";
  
  // Create a random seed/context to ensure variety each time
  const randomContext = Math.random().toString(36).substring(7);
  const adjectives = ["classic", "lesser-known", "chart-topping", "sentimental", "upbeat", "cult-classic", "karaoke-favorite"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  const prompt = `
    Generate a unique and randomized list of exactly 20 Cantonese Pop (Cantopop) songs.
    
    Session ID: ${randomContext} (Do not repeat the standard default list).
    
    Criteria:
    - Era: ${era} (Strictly within this period).
    - Artist Type: ${artistType}
    - Style: Mix of ${randomAdjective} hits and others.
    - The songs must be real, commercially released tracks from Hong Kong.
    - Strictly Cantonese language songs.
    - Try to vary the artists if possible, or pick different songs from famous artists than usual.
    
    Return the response as a JSON array.
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
