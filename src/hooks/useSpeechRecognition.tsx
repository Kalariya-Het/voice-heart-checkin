
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
  onEnd?: () => void;
  language?: string;
  autoStart?: boolean;
}

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognitionSupport: boolean;
}

const useSpeechRecognition = ({
  onResult,
  onError,
  onEnd,
  language = 'en-US',
  autoStart = false,
}: UseSpeechRecognitionProps = {}): SpeechRecognitionResult => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState<boolean>(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    // Use type assertion to tell TypeScript these properties exist
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                 (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;
      
      setRecognition(recognitionInstance);
      setHasRecognitionSupport(true);
      
      if (autoStart) {
        try {
          recognitionInstance.start();
          setIsListening(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
        }
      }
    } else {
      console.warn('Speech recognition is not supported in this browser.');
      setHasRecognitionSupport(false);
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition on unmount', error);
        }
      }
    };
  }, [language, autoStart]);

  // Set up event handlers for speech recognition
  useEffect(() => {
    if (!recognition) return;
    
    const handleResult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      let isFinal = false;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
        isFinal = event.results[i].isFinal;
      }
      
      setTranscript(currentTranscript);
      
      if (onResult) {
        onResult(currentTranscript, isFinal);
      }
    };
    
    const handleError = (event: SpeechRecognitionErrorEvent) => {
      const error = new Error(`Speech recognition error: ${event.error}`);
      console.error(error);
      if (onError) {
        onError(error);
      }
    };
    
    const handleEnd = () => {
      setIsListening(false);
      if (onEnd) {
        onEnd();
      }
    };
    
    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;
    
  }, [recognition, onResult, onError, onEnd]);

  // Start listening
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }, [recognition, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
      }
    }
  }, [recognition, isListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport,
  };
};

export default useSpeechRecognition;
