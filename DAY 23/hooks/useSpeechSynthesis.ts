
import { useState, useCallback, useEffect } from 'react';

interface SpeechSynthesisHook {
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error("Speech Synthesis API not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Attempt to find a suitable voice
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(voice => voice.name === 'Google US English');
    const defaultVoice = voices.find(voice => voice.lang === 'en-US' && voice.default);
    
    utterance.voice = googleVoice || defaultVoice || voices[0];
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  useEffect(() => {
    // Ensure voices are loaded. In some browsers, getVoices() is async.
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded, this is just to trigger the loading.
      };
    }
  }, []);

  return { isSpeaking, speak, stopSpeaking };
};
