
import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps): React.ReactNode {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim()).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-700/50">
        <span className="text-xs font-semibold text-gray-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs text-gray-300 hover:text-white transition-colors disabled:opacity-50"
          disabled={isCopied}
        >
          {isCopied ? (
            <>
              <CheckIcon className="h-4 w-4 mr-1 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
