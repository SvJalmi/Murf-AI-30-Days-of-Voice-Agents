import React from 'react';
import type { Message } from '../types';

const UserIcon: React.FC = () => (
  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  </div>
);

const AgentIcon: React.FC = () => (
  <div className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center text-sky-300 flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L10.5 8.5L5 10L10.5 11.5L12 17L13.5 11.5L19 10L13.5 8.5Z" />
    </svg>
  </div>
);

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AgentIcon />}
      <div
        className={`max-w-xl rounded-2xl px-5 py-3 shadow-md ${
          isUser
            ? 'bg-sky-600 rounded-br-none text-white'
            : 'bg-gray-700 rounded-bl-none text-gray-200'
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};

export default ChatBubble;