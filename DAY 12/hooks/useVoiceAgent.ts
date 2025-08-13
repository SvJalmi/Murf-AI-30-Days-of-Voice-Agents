import { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChat } from '../services/geminiService';
import type { Status, Message } from '../types';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useVoiceAgent = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const recognitionRef = useRef<any>(null);

  const isBrowserSupported = !!SpeechRecognition && !!window.speechSynthesis;

  useEffect(() => {
    if (!isBrowserSupported) {
      setError("Voice agent not supported in this browser. Please use Google Chrome.");
      setStatus('error');
      return;
    }

    chatRef.current = createChat();
    if (!chatRef.current) {
        setError("API Key for Gemini is not configured.");
        setStatus('error');
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const userText = event.results[0][0].transcript;
      setConversation(prev => [...prev, { role: 'user', text: userText }]);
      processUserMessage(userText);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission is blocked. Please enable it in your browser\'s site settings (usually a lock icon in the address bar) and then refresh the page.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      setStatus('error');
    };

    recognition.onend = () => {
      // Only transition to idle if we were actively listening and not in an error state.
      if (status === 'listening') {
        setStatus('idle');
      }
    };
    
    recognitionRef.current = recognition;
  }, [isBrowserSupported]);

  const processUserMessage = useCallback(async (text: string) => {
    setStatus('thinking');
    setError(null);
    if (!chatRef.current) {
      setError("Chat is not initialized.");
      setStatus('error');
      return;
    }
    try {
      const result = await chatRef.current.sendMessage({ message: text });
      const responseText = result.text;
      speak(responseText);
      setConversation(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
      console.error("Error sending message to Gemini:", e);
      const errorMessage = "Sorry, I couldn't get a response. Please try again.";
      setError(errorMessage);
      setStatus('error');
      speak(errorMessage);
      setConversation(prev => [...prev, { role: 'model', text: errorMessage }]);
    }
  }, []);

  const speak = (text: string) => {
    setStatus('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setStatus('idle');
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setError(`Speech synthesis error: ${event.error}`);
      setStatus('error');
    };
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (status === 'listening') {
      recognitionRef.current?.stop();
    } else if (status === 'idle') {
      setError(null);
      try {
        recognitionRef.current?.start();
        setStatus('listening');
      } catch(e) {
        console.error("Could not start recognition:", e);
        setError("Could not start microphone. Please check permissions.");
        setStatus('error');
      }
    }
  };

  return { status, conversation, error, toggleRecording, isBrowserSupported };
};