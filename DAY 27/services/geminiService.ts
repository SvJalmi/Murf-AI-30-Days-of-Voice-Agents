import { GoogleGenAI } from "@google/genai";

// Per Gemini API guidelines, initialize the client with the API key from environment variables.
// The GoogleGenAI instance is created once and reused.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateGeminiResponse(prompt: string): Promise<string> {
  // The apiKey parameter has been removed to enforce using environment variables.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a helpful and concise voice assistant. Respond in short, conversational sentences as if you were speaking.',
      },
    });
    
    const text = response.text;
    if (text) {
      return text;
    } else {
      // This case might happen if the response is blocked due to safety settings.
      throw new Error("Received an empty response from the AI. This could be due to safety filters or other issues.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error("The Google Gemini API key is invalid. Please check your environment configuration.");
        }
    }
    throw new Error("Failed to get a response from the AI. Please check your network connection and environment configuration.");
  }
}
