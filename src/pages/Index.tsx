
import React, { useState, useEffect, useCallback } from 'react';
import VoiceButton from '@/components/VoiceButton';
import VoiceWaveVisualizer from '@/components/VoiceWaveVisualizer';
import ResponseBubble from '@/components/ResponseBubble';
import EmotionBubble, { EmotionType } from '@/components/EmotionBubble';
import RecommendationList from '@/components/RecommendationList';
import ContentPlayer from '@/components/ContentPlayer';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import useWakeWordDetection from '@/hooks/useWakeWordDetection';
import useEmotionDetection from '@/hooks/useEmotionDetection';
import ConversationManager, { ConversationStage, ConversationState } from '@/services/conversationManager';
import ContentRecommendationsService, { ContentItem } from '@/services/contentRecommendationsService';
import { toast } from '@/components/ui/use-toast';
import { withBrowserCompatibility } from "@/components/hoc/withBrowserCompatibility";
import { cn } from '@/lib/utils';  // Fixed import path

const WAKE_WORD = 'hey mindmosaic';

interface IndexProps {
  hasRecognitionSupport: boolean;
  hasSynthesisSupport: boolean;
}

const Index: React.FC<IndexProps> = ({ hasRecognitionSupport, hasSynthesisSupport }) => {
  // State for UI
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userText, setUserText] = useState<string>('');
  const [listeningForWakeWord, setListeningForWakeWord] = useState<boolean>(true);
  
  // Content player state
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);
  const [isContentPlaying, setIsContentPlaying] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  
  // Conversation state
  const [conversationState, setConversationState] = useState<ConversationState>({
    stage: 'idle',
    userResponses: [],
    currentQuestion: '',
  });

  // Voice hooks
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    // Remove duplicate property that's already passed in props
  } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      if (isFinal) {
        setUserText(text);
      }
    }
  });

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    // Remove duplicate property that's already passed in props
  } = useSpeechSynthesis();

  const {
    audioLevel,
    audioPattern,
    isAnalyzing,
    startAnalyzing,
    stopAnalyzing
  } = useAudioAnalyzer();

  // Wake word detection
  const { isActivated, reset: resetWakeWord } = useWakeWordDetection({
    wakeWord: WAKE_WORD,
    transcript,
    isListening: listeningForWakeWord && isListening,
    onDetected: () => handleWakeWordDetected()
  });

  // Emotion detection
  const { emotion, confidence } = useEmotionDetection({
    text: userText,
    voicePattern: audioPattern
  });

  // Handle wake word detection
  const handleWakeWordDetected = useCallback(() => {
    toast({
      title: "MindMosaic Activated",
      description: "I'm listening...",
      duration: 2000
    });
    
    resetTranscript();
    setConversationState(prevState => 
      ConversationManager.getNextState({ ...prevState, stage: 'idle' })
    );
  }, [resetTranscript]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      stopAnalyzing();
    } else {
      startListening();
      startAnalyzing();
    }
  }, [isListening, startListening, stopListening, startAnalyzing, stopAnalyzing]);

  // Process user input and advance conversation
  useEffect(() => {
    if (!userText || conversationState.stage === 'idle' || isTyping) return;
    
    // Special case for closing the conversation
    if (conversationState.stage === 'closing') {
      const timeoutId = setTimeout(() => {
        setConversationState({
          stage: 'idle',
          userResponses: [],
          currentQuestion: '',
        });
        setListeningForWakeWord(true);
        setUserText('');
        resetTranscript();
        resetWakeWord();
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Process this user input in the current conversation
    const nextState = ConversationManager.getNextState(
      conversationState, 
      userText,
      conversationState.stage === 'listening' ? emotion : conversationState.detectedEmotion
    );
    
    // Update state with the new conversation state
    setConversationState(nextState);
    setUserText('');
    resetTranscript();
  }, [userText, conversationState, isTyping, resetTranscript, emotion, resetWakeWord]);

  // Handle content recommendations
  useEffect(() => {
    if (conversationState.stage === 'recommendation' || conversationState.stage === 'closing') {
      if (conversationState.detectedEmotion) {
        const newRecommendations = ContentRecommendationsService.getRecommendations(conversationState.detectedEmotion);
        setRecommendations(newRecommendations);
        
        // Show recommendations after explanation is complete
        if (conversationState.stage === 'closing') {
          setShowRecommendations(true);
        }
      }
    } else {
      setShowRecommendations(false);
    }
  }, [conversationState]);

  // Speak response when conversation state changes
  useEffect(() => {
    const question = conversationState.currentQuestion;
    if (question && hasSynthesisSupport) {
      setIsTyping(true);
      setCurrentResponse(question);
      speak(question);
    }
  }, [conversationState, hasSynthesisSupport, speak]);

  // Check for browser compatibility
  useEffect(() => {
    if (!hasRecognitionSupport) {
      toast({
        variant: "destructive",
        title: "Browser not supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.",
        duration: 5000
      });
    }
    
    if (!hasSynthesisSupport) {
      toast({
        variant: "destructive",
        title: "Browser not supported",
        description: "Your browser doesn't support speech synthesis. Please try Chrome, Edge, or Safari.",
        duration: 5000
      });
    }
    
    // Start listening for wake word on mount
    if (hasRecognitionSupport) {
      startListening();
      startAnalyzing();
    }
    
    return () => {
      stopListening();
      stopAnalyzing();
      stopSpeaking();
    };
  }, [hasRecognitionSupport, hasSynthesisSupport, startListening, stopListening, startAnalyzing, stopAnalyzing, stopSpeaking]);

  // Update UI based on conversation stage
  useEffect(() => {
    if (isActivated && listeningForWakeWord) {
      setListeningForWakeWord(false);
    }
  }, [isActivated, listeningForWakeWord]);

  // Handle typing animation completion
  const handleFinishTyping = useCallback(() => {
    setIsTyping(false);
  }, []);

  // Handle playing content
  const handlePlayContent = useCallback((content: ContentItem) => {
    if (currentContent?.id === content.id) {
      // Toggle play/pause for current content
      setIsContentPlaying(!isContentPlaying);
    } else {
      // Start playing new content
      setCurrentContent(content);
      setIsContentPlaying(true);
      
      toast({
        title: `Playing ${content.category}`,
        description: content.title,
        duration: 3000
      });
    }
  }, [currentContent, isContentPlaying]);

  // Handle stopping content playback
  const handleStopContent = useCallback(() => {
    setIsContentPlaying(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-br from-background to-muted pb-24">
      {/* Header */}
      <header className="w-full max-w-md text-center mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          MindMosaic
        </h1>
        <p className="text-sm text-muted-foreground">
          {listeningForWakeWord ? "Say \"Hey MindMosaic\" to begin" : 
          conversationState.stage !== 'idle' ? "I'm listening..." : 
          "Tap the microphone to start"}
        </p>
      </header>
      
      {/* Main Conversation Area */}
      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center space-y-8">
        {/* Emotion Bubble */}
        {conversationState.detectedEmotion && conversationState.stage !== 'idle' && (
          <div className="flex flex-col items-center">
            <EmotionBubble 
              emotion={conversationState.detectedEmotion} 
              confidence={confidence}
              size="lg"
              className="animate-float mb-2"
            />
            <p className="text-sm text-muted-foreground">
              {conversationState.detectedEmotion.charAt(0).toUpperCase() + conversationState.detectedEmotion.slice(1)}
            </p>
          </div>
        )}
        
        {/* Response Bubble */}
        {currentResponse && (
          <ResponseBubble
            message={currentResponse}
            isTyping={isTyping}
            onFinishTyping={handleFinishTyping}
            className="animate-fade-in"
          />
        )}
        
        {/* Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <div className="w-full mt-6 animate-fade-in-up">
            <h2 className="text-lg font-medium mb-3">Recommendations for you</h2>
            <RecommendationList
              items={recommendations}
              onPlay={handlePlayContent}
              playingItem={currentContent}
            />
          </div>
        )}
        
        {/* Voice Visualization with enhanced animation */}
        <div className="relative my-4">
          <VoiceWaveVisualizer
            isListening={isListening && !listeningForWakeWord}
            audioLevel={audioLevel}
            className={cn(
              "transition-opacity duration-300",
              isListening ? "opacity-100" : "opacity-50"
            )}
          />
          {transcript && !listeningForWakeWord && (
            <p className="text-center text-sm mt-2 text-muted-foreground max-w-xs animate-fade-in">
              "{transcript}"
            </p>
          )}
        </div>
      </main>
      
      {/* Controls with enhanced button */}
      <footer className="w-full max-w-md flex flex-col items-center space-y-4">
        <VoiceButton
          isListening={isListening}
          onClick={toggleListening}
        />
        <p className="text-xs text-muted-foreground animate-fade-in">
          {isListening ? "Tap to pause" : "Tap to resume"}
        </p>
      </footer>
      
      {/* Content Player */}
      {currentContent && (
        <ContentPlayer
          content={currentContent}
          isPlaying={isContentPlaying}
          onPlayPause={() => setIsContentPlaying(!isContentPlaying)}
          onClose={() => setCurrentContent(null)}
        />
      )}
      
      {/* Wake Word Indicator (hidden unless searching for wake word) */}
      {listeningForWakeWord && isListening && (
        <div className="fixed bottom-4 right-4 flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
          <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></div>
          Listening for wake word
        </div>
      )}
    </div>
  );
};

export default withBrowserCompatibility(Index);
