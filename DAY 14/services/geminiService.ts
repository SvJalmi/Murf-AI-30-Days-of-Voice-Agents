import { GoogleGenAI, Chat } from '@google/genai';
import type { VoiceAgent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (agent: VoiceAgent): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: agent.personality,
      temperature: 0.8,
      topP: 0.95,
    },
  });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    return "I'm sorry, I encountered an error and can't respond right now.";
  }
};