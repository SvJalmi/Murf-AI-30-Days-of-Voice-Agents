import React from 'react';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
  isPartial?: boolean;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const AgentIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.95 11c.2 1.3.3 2.64.3 4 0 4.42-3.58 8-8 8s-8-3.58-8-8c0-1.36.1-2.7.3-4h15.4zM4 9c0-4.42 3.58-8 8-8s8 3.58 8 8v1H4V9zm8-5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isPartial = false }) => {
  const isUser = message.sender === Sender.User;

  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-tr-none'
    : 'bg-gray-800 text-gray-200 rounded-tl-none';
  
  const containerClasses = isUser
    ? 'flex-row-reverse'
    : 'flex-row';

  return (
    <div className={`flex items-start gap-3 ${containerClasses}`}>
      <div className={`flex-shrink-0 p-2 rounded-full ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
        {isUser ? <UserIcon /> : <AgentIcon />}
      </div>
      <div className={`relative px-4 py-3 rounded-2xl max-w-xs md:max-w-md lg:max-w-lg shadow-lg ${bubbleClasses} ${isPartial ? 'opacity-70 italic' : ''}`}>
        <p className="break-words leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
};