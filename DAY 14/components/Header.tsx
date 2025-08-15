import React from 'react';
import { BotIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 bg-base-200 border-b border-base-300 shadow-md">
      <BotIcon className="w-8 h-8 text-brand-secondary" />
      <div className="ml-3">
        <h1 className="text-xl font-bold text-content-100">AI Voice Agents</h1>
        <p className="text-sm text-content-200">30 Days of AI Personalities</p>
      </div>
    </header>
  );
};
