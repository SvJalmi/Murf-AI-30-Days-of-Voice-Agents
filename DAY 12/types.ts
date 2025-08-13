
export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  text: string;
}

export type Status = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

// Extend the Window interface for Web Speech API
// This is necessary because these properties are not standard in all TS lib definitions.
export {}; // Make this a module to allow global declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
