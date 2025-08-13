import React from 'react';
import { STATUS_MESSAGES } from '../constants';
import type { Status } from '../types';

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin" />
);

interface StatusDisplayProps {
  status: Status;
  error?: string | null;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, error }) => {
  let message = STATUS_MESSAGES[status] || 'Ready';
  if (status === 'error' && error) {
    message = error;
  }
  
  const textColor = status === 'error' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="flex items-center justify-center h-10 space-x-2 text-lg">
      {status === 'thinking' && <Spinner />}
      <p className={textColor}>{message}</p>
    </div>
  );
};
