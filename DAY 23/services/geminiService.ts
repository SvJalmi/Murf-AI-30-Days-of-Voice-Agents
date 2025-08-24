
import { GoogleGenAI, Chat } from "@google/genai";
import { Message, Sender } from "../types";

let chat: Chat | null = null;

const initializeChat = (history: Message[]) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const formattedHistory = history.map(msg => ({
    role: msg.sender === Sender.User ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: formattedHistory,
    config: {
      systemInstruction: 'You are a friendly and helpful voice assistant. Keep your responses concise and conversational.',
    }
  });
};

export const sendMessageToGemini = async (message: string, currentHistory: Message[]): Promise<string> => {
  try {
    if (!chat) {
      initializeChat(currentHistory);
    }
    
    if (!chat) {
        throw new Error("Chat not initialized");
    }

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    // In case of an error, reset the chat session
    chat = null;
    return "I seem to be having trouble connecting. Please try again in a moment.";
  }
};
