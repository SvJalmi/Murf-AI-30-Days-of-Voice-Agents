import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center p-2 bg-base-200 border-t border-base-300">
      <p className="text-xs text-content-200">
        &copy; {new Date().getFullYear()} AI Voice Agents.
      </p>
    </footer>
  );
};