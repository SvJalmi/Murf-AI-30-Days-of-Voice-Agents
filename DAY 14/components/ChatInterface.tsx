import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import type { VoiceAgent, ChatMessage } from '../types';
import { createChatSession, sendMessage } from '../services/aiService';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { UserIcon, SendIcon, PauseIcon, PlayIcon, StopIcon, SettingsIcon } from './IconComponents';

interface ChatInterfaceProps {
  agent: VoiceAgent;
}

const ChatBubble: React.FC<{ message: ChatMessage; agent: VoiceAgent }> = ({ message, agent }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img src={agent.avatarUrl} alt={agent.name} className="w-10 h-10 rounded-full" />
      )}
      <div className={`max-w-md lg:max-w-lg p-3 rounded-xl shadow ${isUser ? 'bg-brand-secondary text-white rounded-br-none' : 'bg-base-300 text-content-100 rounded-bl-none'}`}>
        <p className="text-sm">{message.text}</p>
      </div>
      {isUser && (
         <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-brand-dark" />
         </div>
      )}
    </div>
  );
};

const TTSControls: React.FC<ReturnType<typeof useTextToSpeech>> = ({ isSpeaking, isPaused, voices, selectedVoice, rate, pitch, setSelectedVoice, setRate, setPitch, cancel, pause, resume }) => {
    const [showSettings, setShowSettings] = useState(false);

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const voice = voices.find(v => v.name === e.target.value);
        if (voice) setSelectedVoice(voice);
    };

    return (
        <div className="relative">
            <button onClick={() => setShowSettings(s => !s)} className="p-2 rounded-full hover:bg-base-300 transition-colors" aria-label="Toggle speech settings">
                <SettingsIcon className="w-5 h-5" />
            </button>
            {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-base-200 border border-base-300 rounded-lg shadow-xl p-4 z-10 animate-fade-in">
                    <h4 className="font-semibold mb-2">Speech Settings</h4>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="voice-select" className="text-xs font-medium text-content-200 block mb-1">Voice</label>
                            <select id="voice-select" value={selectedVoice?.name || ''} onChange={handleVoiceChange} className="w-full bg-base-300 border border-base-300 rounded p-1 text-xs focus:ring-brand-secondary focus:border-brand-secondary">
                                {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rate-slider" className="text-xs font-medium text-content-200 block mb-1">Rate: {rate.toFixed(1)}</label>
                            <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <label htmlFor="pitch-slider" className="text-xs font-medium text-content-200 block mb-1">Pitch: {pitch.toFixed(1)}</label>
                            <input id="pitch-slider" type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-4">
                        <button onClick={isPaused ? resume : pause} disabled={!isSpeaking} className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-300 transition-colors" aria-label={isPaused ? "Resume speech" : "Pause speech"}>{isPaused ? <PlayIcon className="w-5 h-5"/> : <PauseIcon className="w-5 h-5"/>}</button>
                        <button onClick={cancel} disabled={!isSpeaking} className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-300 transition-colors" aria-label="Stop speech"><StopIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            )}
        </div>
    );
};


export const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tts = useTextToSpeech();

  useEffect(() => {
    chatSession.current = createChatSession(agent);
    setMessages([
      { id: Date.now().toString(), text: `Hello! I'm ${agent.name}. How can I help you today?`, sender: 'agent' }
    ]);
  }, [agent]);
  
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'agent') {
      tts.speak(lastMessage.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatSession.current) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessage(chatSession.current, input);
    
    const agentMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: responseText, sender: 'agent' };
    setMessages(prev => [...prev, agentMessage]);
    setIsLoading(false);

  }, [input, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-base-300 flex items-center space-x-3">
        <img src={agent.avatarUrl} alt={agent.name} className="w-12 h-12 rounded-full border-2 border-brand-secondary" />
        <div>
          <h3 className="text-lg font-bold">{agent.name}</h3>
          <p className="text-sm text-content-200">{agent.description}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => <ChatBubble key={msg.id} message={msg} agent={agent} />)}
        {isLoading && (
          <div className="flex items-start gap-3 my-4 justify-start">
            <img src={agent.avatarUrl} alt={agent.name} className="w-10 h-10 rounded-full" />
            <div className="max-w-md p-3 rounded-xl bg-base-300 text-content-100 rounded-bl-none">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-content-200 rounded-full animate-pulse-fast"></span>
                <span className="w-2 h-2 bg-content-200 rounded-full animate-pulse-fast animation-delay-300"></span>
                <span className="w-2 h-2 bg-content-200 rounded-full animate-pulse-fast animation-delay-600"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-base-300 bg-base-200">
        <div className="flex items-center bg-base-300 rounded-lg p-1">
          <TTSControls {...tts} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${agent.name}...`}
            className="flex-1 bg-transparent px-4 py-2 text-content-100 placeholder-content-200 focus:outline-none"
            disabled={isLoading}
            aria-label={`Message to ${agent.name}`}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-brand-secondary text-white rounded-md p-2 hover:bg-brand-dark disabled:bg-base-300 disabled:text-content-200 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
