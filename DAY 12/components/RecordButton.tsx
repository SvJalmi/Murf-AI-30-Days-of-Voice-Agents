import React from 'react';
import type { Status } from '../types';

interface MicrophoneIconProps {
  className?: string;
}

const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM10 5a2 2 0 1 1 4 0v6a2 2 0 1 1-4 0V5Z" />
    <path d="M12 15a4 4 0 0 0-4 4v1h8v-1a4 4 0 0 0-4-4Zm-6 4a6 6 0 0 1 12 0v1h2v-1a8 8 0 0 0-16 0v1h2Z" />
  </svg>
);


interface RecordButtonProps {
  status: Status;
  onClick: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ status, onClick }) => {
  const isListening = status === 'listening';
  const isProcessing = status === 'thinking' || status === 'speaking';
  const isIdle = status === 'idle';
  const hasError = status === 'error';

  const isDisabled = isProcessing || hasError;

  const baseClasses = "relative w-28 h-28 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-black transform shadow-xl";
  
  let statusClasses = '';
  if (isListening) {
    statusClasses = "bg-rose-600 ring-rose-500 animate-pulse-ring";
  } else if (hasError) {
    statusClasses = "bg-red-800 ring-red-700 cursor-not-allowed opacity-60";
  } else if (isProcessing) {
    statusClasses = "bg-slate-700 cursor-not-allowed ring-slate-600";
  } else { // Idle
    statusClasses = "bg-sky-600 hover:bg-sky-500 ring-sky-500 hover:scale-105 active:scale-95";
  }

  const idleAnimation = isIdle ? "animate-pulse-glow" : "";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${statusClasses} ${idleAnimation}`}
      aria-label={
        isListening ? "Stop recording" :
        hasError ? "Recording disabled due to error" :
        "Start recording"
      }
    >
      <MicrophoneIcon className="w-12 h-12" />
    </button>
  );
};