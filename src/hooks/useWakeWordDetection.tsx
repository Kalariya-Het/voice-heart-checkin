
import { useEffect, useState, useCallback } from 'react';

interface UseWakeWordDetectionProps {
  wakeWord?: string;
  onDetected?: () => void;
  transcript?: string;
  isListening?: boolean;
  sensitivity?: number; // 0-1, where 1 is most sensitive
}

const useWakeWordDetection = ({
  wakeWord = "hey mindmosaic",
  onDetected,
  transcript = '',
  isListening = false,
  sensitivity = 0.7
}: UseWakeWordDetectionProps = {}) => {
  const [isActivated, setIsActivated] = useState(false);

  // Clean up the transcript for comparison
  const normalizeText = useCallback((text: string) => {
    return text.toLowerCase().replace(/[^\w\s]/gi, '');
  }, []);

  // Check for wake word
  useEffect(() => {
    if (!isListening || !transcript || isActivated) return;

    const normalizedTranscript = normalizeText(transcript);
    const normalizedWakeWord = normalizeText(wakeWord);

    // Simple exact match (could be improved with fuzzy matching)
    if (normalizedTranscript.includes(normalizedWakeWord)) {
      setIsActivated(true);
      if (onDetected) onDetected();
      return;
    }

    // Fuzzy matching for better detection with speech recognition errors
    if (sensitivity < 1) {
      const words = normalizedWakeWord.split(' ');
      let matchedWords = 0;
      
      for (const word of words) {
        if (normalizedTranscript.includes(word)) {
          matchedWords++;
        }
      }
      
      // If enough words match (based on sensitivity), consider it detected
      const matchThreshold = Math.max(1, Math.floor(words.length * sensitivity));
      if (matchedWords >= matchThreshold) {
        setIsActivated(true);
        if (onDetected) onDetected();
      }
    }
  }, [transcript, isListening, wakeWord, normalizeText, onDetected, sensitivity, isActivated]);

  const reset = useCallback(() => {
    setIsActivated(false);
  }, []);

  return {
    isActivated,
    reset
  };
};

export default useWakeWordDetection;
