import { useState, useEffect, useRef } from 'react';

interface SpeechToTextHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
}

// Fix for property errors by casting window to any.
// Fix for type/value collision by renaming the implementation constant.
const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechToText = (): SpeechToTextHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // Use the global SpeechRecognition type, which is no longer shadowed.
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognitionImpl) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return { isListening, transcript, startListening, stopListening };
};
