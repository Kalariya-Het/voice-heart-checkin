
import { EmotionType } from '@/components/EmotionBubble';
import ContentRecommendationsService from './contentRecommendationsService';

// Types for our conversation
export type ConversationStage = 
  | 'idle'
  | 'greeting'
  | 'initial_question'
  | 'listening'
  | 'analyzing'
  | 'follow_up'
  | 'confirming_emotion'
  | 'recommendation'
  | 'closing';

export type ConversationState = {
  stage: ConversationStage;
  detectedEmotion?: EmotionType;
  userResponses: string[];
  currentQuestion: string;
};

// Simple responses based on emotion
const emotionResponses: Record<EmotionType, string[]> = {
  neutral: [
    "How is your day going so far?",
    "What's been on your mind lately?",
    "Tell me more about how you're feeling right now.",
  ],
  happy: [
    "You sound joyful! What's brought this happiness to your day?",
    "It's wonderful to hear that positive tone! What's making you feel this way?",
    "I notice some cheerfulness in your voice. Want to share what's going well?"
  ],
  sad: [
    "I'm sensing some heaviness in your voice. Would you like to talk about what's troubling you?",
    "You sound a bit down. Is there something specific that's weighing on your mind?",
    "It seems like you might be feeling sad. Would taking a few deep breaths together help?"
  ],
  stressed: [
    "I'm noticing tension in your voice. Would you like to take a deep breath together?",
    "You sound a bit stressed. Is there something specific that's causing pressure right now?",
    "I can hear that you're carrying some stress. What might help you feel more at ease?"
  ],
  calm: [
    "You have a peaceful quality to your voice today. What's contributing to this sense of calm?",
    "I'm picking up on a relaxed energy from you. Has something helped you find this balance?",
    "Your voice has a grounded quality to it. What practices have been helping you stay centered?"
  ],
  excited: [
    "There's definitely excitement in your voice! What's got you feeling so energized?",
    "I can hear your enthusiasm! What are you looking forward to right now?",
    "Your voice is full of energy today! What's sparking this excitement?"
  ]
};

// Follow-up questions based on emotion
const followUpQuestions: Record<EmotionType, string[]> = {
  neutral: [
    "Would you like to explore what might help you connect more with your feelings?",
    "Is there something specific you'd like to focus on in our conversation today?",
    "Sometimes a neutral state is exactly what we need. How are you experiencing this moment?"
  ],
  happy: [
    "That's wonderful to hear! How could you carry this positive energy forward in your day?",
    "Joy is such a gift. Is there a way you could share some of this happiness with someone else today?",
    "I'm glad you're feeling good! What helps you sustain this positive feeling when challenges arise?"
  ],
  sad: [
    "I appreciate you sharing that with me. What's one small thing that might bring you a moment of comfort right now?",
    "That sounds difficult. Is there someone in your life who could offer support during this time?",
    "Sometimes sadness needs space to be felt. Would you like to sit quietly together for a moment?"
  ],
  stressed: [
    "Let's take a deep breath together. Inhale slowly for 4 counts, hold for 2, and exhale for 6. How did that feel?",
    "Stress can be overwhelming. What's one small task you could take off your plate today?",
    "When you're feeling stressed like this, what has helped you in the past?"
  ],
  calm: [
    "That sense of calm is precious. What practices help you maintain this balanced state?",
    "It's wonderful that you're feeling centered. How might you create more moments like this in your day?",
    "Calmness often gives us clarity. Is there any insight or wisdom that's present for you right now?"
  ],
  excited: [
    "Your enthusiasm is contagious! How are you channeling this energy in a positive direction?",
    "Excitement can be so motivating! What are you most looking forward to about this?",
    "That vibrant energy is wonderful! How does this excitement feel in your body right now?"
  ]
};

// Confirmation questions
const confirmationQuestions: Record<EmotionType, string[]> = {
  neutral: [
    "It seems like you're feeling pretty neutral right now. Does that sound right?",
    "I'm sensing a balanced state from you today. Would you say that's accurate?",
    "You seem to be in an even place emotionally. Is that how you'd describe it?"
  ],
  happy: [
    "You sound like you're in a happy place right now. Did I get that right?",
    "I'm picking up on joy in your voice. Is that how you're feeling?",
    "There seems to be a positive energy about you today. Would you say you're feeling happy?"
  ],
  sad: [
    "I sense some sadness in your voice. Is that what you're experiencing?",
    "You seem to be feeling down right now. Is that accurate?",
    "I'm hearing a touch of sadness in how you're expressing yourself. Does that resonate with you?"
  ],
  stressed: [
    "I'm noticing signs of stress in your voice. Is that what you're feeling?",
    "You sound like you might be under some pressure right now. Is that right?",
    "There's a tension I'm picking up on. Would you say you're feeling stressed?"
  ],
  calm: [
    "You have a peaceful quality about you right now. Would you say you're feeling calm?",
    "I sense a grounded energy from you today. Does that match how you're feeling?",
    "There's a tranquility in your voice. Are you experiencing a sense of calm?"
  ],
  excited: [
    "I hear enthusiasm in your voice! Are you feeling excited about something?",
    "There's an energetic quality to how you're speaking. Would you say you're excited right now?",
    "You seem to have an upbeat energy today. Is excitement what you're feeling?"
  ]
};

// Initial greeting responses
const greetings = [
  "Hey there! How's your heart feeling today?",
  "Hello! I'm here to check in. How are you doing right now?",
  "Hi! It's good to connect with you. How are you feeling today?"
];

// Recommendation transition questions
const recommendationTransitions: Record<EmotionType, string[]> = {
  neutral: [
    "Would you like me to suggest something that might enhance your day?",
    "I have some recommendations that might be interesting. Would you like to hear them?",
    "Would you like to hear some content suggestions that might resonate with you right now?"
  ],
  happy: [
    "I have some upbeat recommendations to keep this positive energy going. Would you like to hear them?",
    "Would you like me to suggest some content that matches your joyful mood?",
    "I can recommend something to complement your happy state. Interested?"
  ],
  sad: [
    "I have some gentle suggestions that might provide comfort. Would you like to hear them?",
    "Some people find certain content soothing when they're feeling down. Would you like some recommendations?",
    "Would you like to hear some recommendations that might help lift your spirits a bit?"
  ],
  stressed: [
    "I sensed today's been a lot. I've got something that might help... want a calming playlist, a light-hearted podcast, or a short mindful reset?",
    "When stress is high, sometimes the right audio can help. Would you like some recommendations?",
    "I have some content suggestions that might help ease your stress. Would you like to hear them?"
  ],
  calm: [
    "To complement your peaceful state, would you like some content recommendations?",
    "I have some suggestions that might enhance your calm mood. Would you like to hear them?",
    "Would you be interested in some content recommendations that align with your tranquil state?"
  ],
  excited: [
    "I have some energizing recommendations that match your enthusiasm. Would you like to hear them?",
    "With that exciting energy, would you like some content suggestions to channel it?",
    "Would you like to hear some recommendations that complement your excitement?"
  ]
};

class ConversationManager {
  // Get a greeting message
  static getGreeting(): string {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  }
  
  // Get an initial question
  static getInitialQuestion(): string {
    return "Tell me about your day in a few words.";
  }
  
  // Get a response based on detected emotion
  static getEmotionResponse(emotion: EmotionType): string {
    const responses = emotionResponses[emotion] || emotionResponses.neutral;
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
  
  // Get a follow-up question based on emotion
  static getFollowUpQuestion(emotion: EmotionType): string {
    const questions = followUpQuestions[emotion] || followUpQuestions.neutral;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }
  
  // Get a recommendation transition question
  static getRecommendationTransition(emotion: EmotionType): string {
    const transitions = recommendationTransitions[emotion] || recommendationTransitions.neutral;
    const randomIndex = Math.floor(Math.random() * transitions.length);
    return transitions[randomIndex];
  }
  
  // Get a content recommendation response
  static getRecommendationResponse(emotion: EmotionType): string {
    return ContentRecommendationsService.generateRecommendationResponse(emotion);
  }
  
  // Get a confirmation question
  static getConfirmationQuestion(emotion: EmotionType): string {
    const questions = confirmationQuestions[emotion] || confirmationQuestions.neutral;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }
  
  // Get next conversation state based on current state and input
  static getNextState(current: ConversationState, userInput?: string, detectedEmotion?: EmotionType): ConversationState {
    const userResponses = [...current.userResponses];
    if (userInput) {
      userResponses.push(userInput);
    }
    
    switch (current.stage) {
      case 'idle':
        return {
          stage: 'greeting',
          userResponses,
          currentQuestion: this.getGreeting(),
          detectedEmotion: current.detectedEmotion
        };
        
      case 'greeting':
        return {
          stage: 'initial_question',
          userResponses,
          currentQuestion: this.getInitialQuestion(),
          detectedEmotion: current.detectedEmotion
        };
        
      case 'initial_question':
        return {
          stage: 'listening',
          userResponses,
          currentQuestion: '',
          detectedEmotion: current.detectedEmotion
        };
        
      case 'listening':
        if (!detectedEmotion) {
          return current;
        }
        return {
          stage: 'analyzing',
          userResponses,
          currentQuestion: '',
          detectedEmotion
        };
        
      case 'analyzing':
        return {
          stage: 'confirming_emotion',
          userResponses,
          currentQuestion: this.getConfirmationQuestion(detectedEmotion || 'neutral'),
          detectedEmotion
        };
        
      case 'confirming_emotion':
        // Check for affirmative response
        const isAffirmative = /\b(yes|yeah|yep|correct|right|true|agree|accurate|exactly)\b/i.test(userInput || '');
        
        if (isAffirmative) {
          return {
            stage: 'recommendation',
            userResponses,
            currentQuestion: this.getRecommendationTransition(detectedEmotion || 'neutral'),
            detectedEmotion
          };
        } else {
          // User disagreed, ask how they're feeling
          return {
            stage: 'follow_up',
            userResponses,
            currentQuestion: "I see. How would you describe how you're feeling right now?",
            detectedEmotion
          };
        }
        
      case 'follow_up':
        return {
          stage: 'recommendation',
          userResponses,
          currentQuestion: this.getRecommendationTransition(detectedEmotion || 'neutral'),
          detectedEmotion
        };
        
      case 'recommendation':
        // Check if user wants recommendations
        const wantsRecommendations = /\b(yes|yeah|yep|sure|ok|okay|please|recommend|suggestions?)\b/i.test(userInput || '');
        
        if (wantsRecommendations) {
          return {
            stage: 'closing',
            userResponses,
            currentQuestion: this.getRecommendationResponse(detectedEmotion || 'neutral'),
            detectedEmotion
          };
        } else {
          return {
            stage: 'closing',
            userResponses,
            currentQuestion: "Thank you for sharing with me today. Is there anything else on your mind before we finish our check-in?",
            detectedEmotion
          };
        }
        
      case 'closing':
      default:
        return {
          stage: 'idle',
          userResponses: [],
          currentQuestion: '',
          detectedEmotion: undefined
        };
    }
  }
}

export default ConversationManager;
