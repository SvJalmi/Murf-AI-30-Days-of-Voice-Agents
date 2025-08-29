
export interface Message {
  role: 'user' | 'agent';
  text: string;
}

export enum AgentStatus {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  SPEAKING = 'speaking',
}
