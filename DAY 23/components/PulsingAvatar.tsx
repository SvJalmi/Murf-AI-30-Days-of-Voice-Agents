import React from 'react';

interface PulsingAvatarProps {
  isActive: boolean;
}

export const PulsingAvatar: React.FC<PulsingAvatarProps> = ({ isActive }) => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {isActive && (
        <>
          {/* Concentric rings */}
          <span className="absolute h-1/2 w-1/2 rounded-full bg-fuchsia-500/50 animate-ping"></span>
          <span style={{ animationDelay: '0.5s' }} className="absolute h-3/4 w-3/4 rounded-full bg-fuchsia-500/40 animate-ping"></span>
           <span style={{ animationDelay: '1s' }} className="absolute h-full w-full rounded-full bg-fuchsia-500/30 animate-ping"></span>
        </>
      )}
      {/* Central avatar */}
      <div className="relative w-[85%] h-[85%] rounded-full bg-gray-800 flex items-center justify-center shadow-lg border-2 border-fuchsia-500/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-fuchsia-400" viewBox="0 0 24 24" fill="currentColor">
           <path d="M19.95 11c.2 1.3.3 2.64.3 4 0 4.42-3.58 8-8 8s-8-3.58-8-8c0-1.36.1-2.7.3-4h15.4zM4 9c0-4.42 3.58-8 8-8s8 3.58 8 8v1H4V9zm8-5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      </div>
    </div>
  );
};