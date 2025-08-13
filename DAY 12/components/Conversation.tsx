import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';

interface ConversationProps {
  messages: Message[];
}

export const Conversation: React.FC<ConversationProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow w-full max-w-2xl p-4 space-y-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex animate-fadeInUp ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`px-4 py-2 rounded-2xl max-w-sm md:max-w-md shadow-md ${
              msg.role === 'user'
                ? 'bg-sky-600 text-white rounded-br-none'
                : 'bg-slate-700 text-gray-100 rounded-bl-none'
            }`}
          >
            <p className="break-words">{msg.text}</p>
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
