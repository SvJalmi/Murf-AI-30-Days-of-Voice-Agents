import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (geminiKey: string) => void;
  initialGeminiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialGeminiKey }) => {
  const [geminiKey, setGeminiKey] = useState(initialGeminiKey);

  useEffect(() => {
    setGeminiKey(initialGeminiKey);
  }, [initialGeminiKey, isOpen]);

  const handleSave = () => {
    onSave(geminiKey);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-gray-800 border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">API Setting</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-300 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              id="gemini-key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter your Gemini API Key"
            />
             <p className="text-xs text-gray-500 mt-2">Your key is stored only in your browser's local storage.</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-400 disabled:bg-sky-800/50 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={!geminiKey.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;