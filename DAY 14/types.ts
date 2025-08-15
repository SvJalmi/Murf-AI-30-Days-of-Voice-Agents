
export interface VoiceAgent {
  id: number;
  name: string;
  description: string;
  avatarUrl: string;
  personality: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
}
