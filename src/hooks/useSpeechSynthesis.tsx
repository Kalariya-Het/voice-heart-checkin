
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface SpeechSynthesisResult {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  hasSynthesisSupport: boolean;
}

const useSpeechSynthesis = ({
  onStart,
  onEnd,
  onError,
  voice,
  rate = 1,
  pitch = 1,
  volume = 1,
}: UseSpeechSynthesisProps = {}): SpeechSynthesisResult => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasSynthesisSupport, setHasSynthesisSupport] = useState<boolean>(false);
  
  // Check if browser supports speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSynthesisSupport(true);
      
      // Get available voices
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices();
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      console.warn('Speech synthesis is not supported in this browser.');
      setHasSynthesisSupport(false);
    }
  }, []);
  
  // Handle speech synthesis events
  const speak = useCallback((text: string) => {
    if (!hasSynthesisSupport) return;
    
    // Cancel any ongoing speech
    stop();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.voice = voice || (voices.length > 0 ? 
      // Prefer a natural-sounding female voice if available
      voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('female') || 
        v.name.includes('Fiona') ||
        v.name.includes('Karen')
      ) || voices[0] 
      : null);
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (onStart) onStart();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      if (onError) onError(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    window.speechSynthesis.speak(utterance);
  }, [hasSynthesisSupport, voices, voice, rate, pitch, volume, onStart, onEnd, onError]);
  
  const stop = useCallback(() => {
    if (hasSynthesisSupport) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [hasSynthesisSupport]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (hasSynthesisSupport) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hasSynthesisSupport]);
  
  return {
    speak,
    stop,
    isSpeaking,
    voices,
    hasSynthesisSupport,
  };
};

export default useSpeechSynthesis;
