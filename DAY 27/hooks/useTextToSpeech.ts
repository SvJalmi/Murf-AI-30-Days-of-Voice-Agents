
import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechHook {
  isSpeaking: boolean;
  speak: (text: string, onEndCallback?: () => void) => void;
  cancel: () => void;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const synth = window.speechSynthesis;

  const speak = useCallback((text: string, onEndCallback?: () => void) => {
    if (synth.speaking) {
      console.error('SpeechSynthesis.speaking');
      return;
    }
    if (text !== '') {
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.onstart = () => {
        setIsSpeaking(true);
      };
      utterThis.onend = () => {
        setIsSpeaking(false);
        if (onEndCallback) {
          onEndCallback();
        }
      };
      utterThis.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
        if (onEndCallback) {
          onEndCallback();
        }
      };
      synth.speak(utterThis);
    }
  }, [synth]);

  const cancel = useCallback(() => {
    synth.cancel();
    setIsSpeaking(false);
  }, [synth]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  return { isSpeaking, speak, cancel };
};
