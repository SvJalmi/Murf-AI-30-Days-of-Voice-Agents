import React from 'react';
import { AgentStatus } from '../types';
import { MicIcon } from './icons/MicIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { StopIcon } from './icons/StopIcon';

interface MicButtonProps {
  status: AgentStatus;
  onClick: () => void;
  disabled?: boolean;
}

const MicButton: React.FC<MicButtonProps> = ({ status, onClick, disabled = false }) => {
  const getButtonContent = () => {
    switch (status) {
      case AgentStatus.LISTENING:
        return <StopIcon />;
      case AgentStatus.PROCESSING:
      case AgentStatus.SPEAKING:
        return <SpinnerIcon />;
      case AgentStatus.IDLE:
      default:
        return <MicIcon />;
    }
  };

  const getButtonClass = () => {
    let baseClass = "rounded-full p-5 shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900";
    if(disabled) {
        return `${baseClass} bg-gray-600 text-gray-400 cursor-not-allowed`;
    }
    switch (status) {
      case AgentStatus.LISTENING:
        return `${baseClass} bg-rose-600 hover:bg-rose-500 text-white animate-pulse focus:ring-rose-400`;
      case AgentStatus.PROCESSING:
      case AgentStatus.SPEAKING:
        return `${baseClass} bg-amber-600 text-white cursor-wait focus:ring-amber-400`;
      case AgentStatus.IDLE:
      default:
        return `${baseClass} bg-sky-600 hover:bg-sky-500 text-white hover:scale-110 focus:ring-sky-400`;
    }
  };
  
  return (
    <button className={getButtonClass()} onClick={onClick} disabled={disabled || status === AgentStatus.PROCESSING}>
      {getButtonContent()}
    </button>
  );
};

export default MicButton;