
import { useState, useEffect } from 'react';
import { EmotionType } from '@/components/EmotionBubble';

interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
}

interface UseEmotionDetectionProps {
  text?: string;
  voicePattern?: {
    pitch?: number;
    rate?: number;
    volume?: number;
  };
}

const useEmotionDetection = ({ 
  text, 
  voicePattern 
}: UseEmotionDetectionProps = {}): EmotionResult => {
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult>({
    emotion: 'neutral',
    confidence: 0.5
  });

  useEffect(() => {
    if (!text && !voicePattern) return;
    
    // This is a simplified emotion detection simulation
    // In a real app, you'd use more sophisticated NLP and voice analysis
    const detectEmotion = () => {
      let emotion: EmotionType = 'neutral';
      let confidence = 0.5;
      
      // Simple keyword-based detection (would be more sophisticated in production)
      if (text) {
        const textLower = text.toLowerCase();
        
        if (/\b(happy|joy|great|awesome|wonderful|excited|love|amazing)\b/.test(textLower)) {
          emotion = 'happy';
          confidence = 0.7;
        } else if (/\b(sad|unhappy|depressed|miserable|down|upset)\b/.test(textLower)) {
          emotion = 'sad';
          confidence = 0.7;
        } else if (/\b(stressed|anxious|worried|nervous|tense|pressure|overwhelmed)\b/.test(textLower)) {
          emotion = 'stressed';
          confidence = 0.7;
        } else if (/\b(calm|peaceful|relaxed|content|serene)\b/.test(textLower)) {
          emotion = 'calm';
          confidence = 0.7;
        } else if (/\b(excited|thrilled|eager|energetic|enthusiastic)\b/.test(textLower)) {
          emotion = 'excited';
          confidence = 0.7;
        }
      }
      
      // Voice pattern analysis (simplified simulation)
      if (voicePattern) {
        // High pitch and rate could indicate excitement or stress
        if (voicePattern.pitch && voicePattern.pitch > 1.2) {
          if (voicePattern.rate && voicePattern.rate > 1.2) {
            emotion = 'excited';
            confidence = 0.8;
          } else {
            emotion = 'stressed';
            confidence = 0.6;
          }
        }
        
        // Low pitch and slow rate could indicate calm or sad
        if (voicePattern.pitch && voicePattern.pitch < 0.8) {
          if (voicePattern.rate && voicePattern.rate < 0.8) {
            emotion = 'sad';
            confidence = 0.7;
          } else {
            emotion = 'calm';
            confidence = 0.6;
          }
        }
        
        // Low volume might indicate sadness
        if (voicePattern.volume && voicePattern.volume < 0.4) {
          emotion = 'sad';
          confidence = 0.6;
        }
      }
      
      setDetectedEmotion({ emotion, confidence });
    };
    
    detectEmotion();
  }, [text, voicePattern]);
  
  return detectedEmotion;
};

export default useEmotionDetection;
