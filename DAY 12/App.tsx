import React from 'react';
import { useVoiceAgent } from './hooks/useVoiceAgent';
import { RecordButton } from './components/RecordButton';
import { Conversation } from './components/Conversation';
import { StatusDisplay } from './components/StatusDisplay';

const App: React.FC = () => {
  const { status, conversation, error, toggleRecording, isBrowserSupported } = useVoiceAgent();

  const renderContent = () => {
    if (!isBrowserSupported) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
          <h2 className="text-xl font-bold">Browser Not Supported</h2>
          <p>The Web Speech API is required for this application. Please use a recent version of Google Chrome.</p>
        </div>
      );
    }

    return (
      <>
        <header className="w-full max-w-2xl p-4 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            AI Voice Agent
          </h1>
        </header>

        <Conversation messages={conversation} />

        <footer className="w-full max-w-2xl p-4 flex flex-col items-center justify-center space-y-4">
          <StatusDisplay status={status} error={error} />
          <RecordButton status={status} onClick={toggleRecording} />
          {status === 'error' && error?.toLowerCase().includes('microphone') && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-white font-semibold transition-colors animate-fadeIn"
              aria-label="Refresh page to apply new permissions"
            >
              Refresh Page
            </button>
          )}
        </footer>
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full h-full max-w-3xl max-h-[90vh] bg-slate-800/20 backdrop-blur-xl rounded-2xl shadow-2xl shadow-sky-500/5 flex flex-col items-center justify-between border border-white/10 animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;