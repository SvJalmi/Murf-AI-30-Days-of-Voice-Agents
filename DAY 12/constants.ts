
import type { Status } from './types';

export const STATUS_MESSAGES: { [key in Status]: string } = {
  idle: 'Click the microphone to speak',
  listening: 'Listening...',
  thinking: 'Thinking...',
  speaking: 'Agent is speaking...',
  error: 'An error occurred. Please try again.',
};
