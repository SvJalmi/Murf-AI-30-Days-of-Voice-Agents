import React from 'react';

interface MicButtonProps {
  isRecording: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({ isRecording, onClick, isDisabled = false }) => {
  const buttonStateClasses = isDisabled
    ? 'bg-gray-700 shadow-none'
    : isRecording 
    ? 'bg-red-500 shadow-red-500/40' 
    : 'bg-cyan-500 shadow-cyan-500/40 animate-breathing';

  const ringClasses = isDisabled 
    ? 'focus:ring-gray-600' 
    : isRecording 
    ? 'focus:ring-red-400' 
    : 'focus:ring-cyan-400';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      aria-label={isDisabled ? 'Microphone disabled' : (isRecording ? 'Stop recording' : 'Start recording')}
      className={`relative w-24 h-24 rounded-full text-white flex items-center justify-center transition-all duration-300 ease-in-out shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 ${ringClasses} ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {/* Pulsing effect */}
      {!isDisabled && isRecording && (
        <span className="absolute h-full w-full rounded-full bg-red-500 animate-ping opacity-75"></span>
      )}
      {!isDisabled && !isRecording && (
         <span className="absolute h-full w-full rounded-full bg-cyan-500 animate-ping opacity-20"></span>
      )}
      
      {/* Main button surface */}
      <div className={`absolute h-full w-full rounded-full transition-colors duration-300 ${buttonStateClasses}`}></div>

      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
      </svg>
    </button>
  );
};