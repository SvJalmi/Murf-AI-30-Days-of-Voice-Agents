import React from 'react';

interface PermissionsGuideProps {
  onRetry: () => void;
}

export const PermissionsGuide: React.FC<PermissionsGuideProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 bg-red-900/30 rounded-2xl border border-red-500/50 max-w-sm mx-auto animate-pulse animation-duration-2000">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      </svg>
      <h3 className="font-bold text-md text-white mb-1">Microphone Access Needed</h3>
      <p className="text-xs text-gray-300 mb-3">
        Please allow microphone access in your browser to continue.
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-1.5 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50"
      >
        Try Again
      </button>
    </div>
  );
};