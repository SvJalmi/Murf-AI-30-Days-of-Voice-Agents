
import React from 'react';

interface IconProps {
  className?: string;
}

function ClipboardIcon({ className }: IconProps): React.ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.75m-8.5-4.362a2.25 2.25 0 00-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.75m-8.5-4.362a2.25 2.25 0 00-2.166 1.638m13.5 4.362V11.25m-13.5 0V11.25m13.5 0v3.75m-13.5 0v3.75M17.25 6H6.75c-1.24 0-2.25 1.01-2.25 2.25v10.5c0 1.24 1.01 2.25 2.25 2.25h10.5c1.24 0 2.25-1.01 2.25-2.25V8.25c0-1.24-1.01-2.25-2.25-2.25z"
      />
    </svg>
  );
}

export default ClipboardIcon;
