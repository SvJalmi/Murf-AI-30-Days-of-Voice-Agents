import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Sender } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { ChatBubble } from './components/ChatBubble';
import { MicButton } from './components/MicButton';
import { PulsingAvatar } from './components/PulsingAvatar';
import { PermissionsGuide } from './components/PermissionsGuide';

type PermissionErrorType = 'not-allowed' | 'other' | null;

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { sender: Sender.Agent, text: "Hello! I'm your AI voice assistant. Tap the orb and speak." }
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<PermissionErrorType>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { speak, isSpeaking, stopSpeaking } = useSpeechSynthesis();
  const { isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition({
    onSpeechEnd: (finalTranscript: string) => {
      if (finalTranscript) {
        handleUserMessage(finalTranscript.trim());
      }
    },
    onError: (error: string) => {
      if (error === 'not-allowed') {
        setPermissionError('not-allowed');
      } else {
        console.error(`An unexpected microphone error occurred: ${error}`);
        setPermissionError('other');
      }
    }
  });

  const handleUserMessage = useCallback(async (userMessage: string) => {
    if(!userMessage) return;
    setChatHistory(prev => [...prev, { sender: Sender.User, text: userMessage }]);
    setIsProcessing(true);

    try {
      const agentResponse = await sendMessageToGemini(userMessage, chatHistory);
      setChatHistory(prev => [...prev, { sender: Sender.Agent, text: agentResponse }]);
      speak(agentResponse);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setChatHistory(prev => [...prev, { sender: Sender.Agent, text: errorMessage }]);
      speak(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [chatHistory, speak]);
  
  const handleRetryPermissions = () => {
    setPermissionError(null);
    // Attempt to start recording immediately. This will re-trigger the browser's
    // permission prompt if the user hasn't permanently blocked it.
    startRecording();
  };

  const toggleRecording = () => {
    if (permissionError) {
      // For 'other' errors, a simple click on the disabled button resets the state.
      setPermissionError(null);
      return;
    }
    
    if (isRecording) {
      stopRecording();
    } else {
      if (isSpeaking) {
        stopSpeaking();
      }
      startRecording();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, transcript]);

  const getStatusText = () => {
    if (permissionError === 'not-allowed') return ""; // The guide component handles its own text
    if (permissionError === 'other') return "An error occurred. Click the orb to reset.";
    if (isRecording) return "Listening...";
    if (isProcessing) return "Thinking...";
    if (isSpeaking) return "Speaking...";
    return "Tap the Orb to Speak";
  };

  const renderControls = () => {
    if (permissionError === 'not-allowed') {
      return <PermissionsGuide onRetry={handleRetryPermissions} />;
    }
    if (isProcessing || isSpeaking) {
      return <PulsingAvatar isActive={isProcessing || isSpeaking} />;
    }
    return <MicButton isRecording={isRecording} onClick={toggleRecording} isDisabled={!!permissionError} />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-4 z-10 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <h1 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
          AI Voice Agent
        </h1>
      </header>

      {/* Chat Area */}
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pt-24 pb-48">
        {chatHistory.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isRecording && transcript && (
          <ChatBubble message={{ sender: Sender.User, text: transcript }} isPartial={true} />
        )}
      </main>

      {/* Footer / Control Area */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 z-10 bg-black/50 backdrop-blur-md border-t border-gray-800">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-24 w-full flex items-center justify-center px-4">
            {renderControls()}
          </div>
          <p className={`text-sm h-5 transition-all duration-300 text-center ${permissionError ? 'text-red-400' : 'text-gray-400'}`}>
            {getStatusText()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;