import { useState, useRef, useCallback, useEffect } from 'react';

// --- Web Speech API Type Definitions ---
// These are not part of standard DOM library types, so we define them here.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: { error: string }) => void;
  onresult: (event: {
    resultIndex: number;
    results: {
      isFinal: boolean;
      [key: number]: { transcript: string };
    }[];
  }) => void;
}

// Augment the Window interface to include non-standard SpeechRecognition APIs.
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionHook {
  isRecording: boolean;
  transcript: string;
  startRecording: () => void;
  stopRecording: () => void;
}

interface SpeechRecognitionOptions {
  onSpeechEnd: (finalTranscript: string) => void;
  onError?: (error: string) => void;
}

const getSpeechRecognition = (): (new () => SpeechRecognition) | null => {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions): SpeechRecognitionHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const { onSpeechEnd, onError } = options;

  // Use refs to hold the latest values of callbacks.
  // This avoids stale closures in the speech recognition event handlers inside useEffect.
  const transcriptRef = useRef(transcript);
  transcriptRef.current = transcript;

  const onSpeechEndRef = useRef(onSpeechEnd);
  onSpeechEndRef.current = onSpeechEnd;
  
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      const errorMsg = "Speech Recognition API not supported in this browser.";
      console.error(errorMsg);
      if(onErrorRef.current) {
        onErrorRef.current('not-supported');
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcriptRef.current) {
        onSpeechEndRef.current(transcriptRef.current);
      }
      setTranscript('');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (onErrorRef.current) {
        onErrorRef.current(event.error);
      }
      setIsRecording(false);
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // The dependency array is empty to ensure this effect runs only once to set up the recognition object.
    // Callbacks and state are accessed via refs to prevent stale closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        if (onErrorRef.current) {
          onErrorRef.current('start-error');
        }
      }
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      // The onend event will handle the final transcript processing
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  return { isRecording, transcript, startRecording, stopRecording };
};