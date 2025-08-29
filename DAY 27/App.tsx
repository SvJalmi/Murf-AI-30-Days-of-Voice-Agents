import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Message } from './types';
import { AgentStatus } from './types';
// Settings related imports are removed as API key is now handled by environment variables.
import MicButton from './components/MicButton';
import ChatBubble from './components/ChatBubble';
import { generateGeminiResponse } from './services/geminiService';
import { useSpeechToText } from './hooks/useSpeechToText';
import { useTextToSpeech } from './hooks/useTextToSpeech';

const App: React.FC = () => {
  // State for API key and settings modal is removed to align with guidelines.
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechToText();
  const { isSpeaking, speak, cancel } = useTextToSpeech();

  // useEffect for loading API key from localStorage is removed.

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isListening) {
      setAgentStatus(AgentStatus.LISTENING);
    } else if (agentStatus === AgentStatus.LISTENING) {
      setAgentStatus(AgentStatus.IDLE);
    }
  }, [isListening, agentStatus]);
  
  // handleSaveKey function is removed.
  
  const processTranscript = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, newUserMessage]);
    setAgentStatus(AgentStatus.PROCESSING);
    setError(null);

    try {
      // generateGeminiResponse no longer requires an API key argument.
      const aiResponse = await generateGeminiResponse(text);
      const newAgentMessage: Message = { role: 'agent', text: aiResponse };
      setMessages(prev => [...prev, newAgentMessage]);
      setAgentStatus(AgentStatus.SPEAKING);
      speak(aiResponse, () => setAgentStatus(AgentStatus.IDLE));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'agent', text: `Error: ${errorMessage}` }]);
      setAgentStatus(AgentStatus.IDLE);
    }
  }, [speak]);

  useEffect(() => {
    if (!isListening && transcript) {
      processTranscript(transcript);
    }
  }, [isListening, transcript, processTranscript]);

  const handleMicClick = () => {
    // Logic for checking API key configuration is removed.
    setError(null);

    if (isSpeaking) {
      cancel();
      setAgentStatus(AgentStatus.IDLE);
    } else if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0D1117] to-[#1a202c] text-gray-200 font-sans">
      <header className="flex justify-between items-center p-4 border-b border-white/10 shadow-lg backdrop-blur-sm bg-black/20">
        <h1 className="text-2xl font-bold text-gray-100">AI Voice Agent</h1>
        {/* Settings button is removed. */}
      </header>
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <div className="bg-white/5 p-8 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M12 3L10.5 8.5L5 10L10.5 11.5L12 17L13.5 11.5L19 10L13.5 8.5Z"></path></svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-200">Welcome!</h2>
                <p className="mt-2 max-w-md">
                    {/* Welcome text is simplified. */}
                    Click the microphone button below to start your conversation.
                </p>
            </div>
        )}
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {error && (
            <div className="bg-rose-900/50 border border-rose-700 text-rose-200 p-4 rounded-lg text-sm">
                <strong>Error:</strong> {error}
            </div>
        )}
      </main>
      <footer className="p-4 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm">
        {/* MicButton is no longer disabled based on API key configuration. */}
        <MicButton status={agentStatus} onClick={handleMicClick} />
        <p className="text-xs text-gray-500 mt-3 h-4 transition-opacity duration-300">
          {agentStatus === AgentStatus.LISTENING ? "Listening..." : transcript && agentStatus === AgentStatus.IDLE ? `I heard: "${transcript}"` : ""}
        </p>
      </footer>
      {/* SettingsModal is removed. */}
    </div>
  );
};

export default App;
