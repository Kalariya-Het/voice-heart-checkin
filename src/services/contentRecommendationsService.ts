
import { EmotionType } from '@/components/EmotionBubble';

// Types for content categories and items
export type ContentCategory = 'music' | 'podcast' | 'meditation' | 'audiobook';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  duration?: string;
  imageUrl?: string;
}

// Mock content database organized by emotion
const contentDatabase: Record<EmotionType, ContentItem[]> = {
  happy: [
    {
      id: 'h1',
      title: 'Happy Vibes Playlist',
      description: 'Upbeat songs to celebrate your good mood',
      category: 'music',
      duration: '45 min'
    },
    {
      id: 'h2',
      title: 'The Comedy Hour',
      description: 'Laugh along with the best stand-up comedians',
      category: 'podcast',
      duration: '60 min'
    },
    {
      id: 'h3',
      title: 'Gratitude Meditation',
      description: 'Enhance your positive feelings with gratitude',
      category: 'meditation',
      duration: '12 min'
    }
  ],
  sad: [
    {
      id: 's1',
      title: 'Comforting Classics',
      description: 'Gentle piano melodies to soothe your soul',
      category: 'music',
      duration: '50 min'
    },
    {
      id: 's2',
      title: 'The Healing Podcast',
      description: 'Stories of overcoming difficult times',
      category: 'podcast',
      duration: '35 min'
    },
    {
      id: 's3',
      title: 'Compassionate Self-Care',
      description: 'A guided meditation for difficult emotions',
      category: 'meditation',
      duration: '15 min'
    }
  ],
  stressed: [
    {
      id: 'st1',
      title: 'Stress Relief Sounds',
      description: 'Calming nature sounds and gentle ambient music',
      category: 'music',
      duration: '60 min'
    },
    {
      id: 'st2',
      title: 'The Calm Space',
      description: 'Practical strategies for managing stress',
      category: 'podcast',
      duration: '25 min'
    },
    {
      id: 'st3',
      title: 'Deep Breathing Session',
      description: 'Guided breathing exercises to reduce stress',
      category: 'meditation',
      duration: '10 min'
    }
  ],
  calm: [
    {
      id: 'c1',
      title: 'Peaceful Ambient Mix',
      description: 'Gentle atmospheric sounds for your relaxed state',
      category: 'music',
      duration: '65 min'
    },
    {
      id: 'c2',
      title: 'Mindful Living',
      description: 'Conversations about maintaining balance and peace',
      category: 'podcast',
      duration: '40 min'
    },
    {
      id: 'c3',
      title: 'Body Scan Relaxation',
      description: 'Enhance your calm state with this guided relaxation',
      category: 'meditation',
      duration: '18 min'
    }
  ],
  excited: [
    {
      id: 'e1',
      title: 'Power Mix',
      description: 'High-energy tracks to match your enthusiasm',
      category: 'music',
      duration: '55 min'
    },
    {
      id: 'e2',
      title: 'Innovation Nation',
      description: 'Inspiring stories of creativity and achievement',
      category: 'podcast',
      duration: '45 min'
    },
    {
      id: 'e3',
      title: 'Channeling Energy Meditation',
      description: 'Direct your excitement productively',
      category: 'meditation',
      duration: '12 min'
    }
  ],
  neutral: [
    {
      id: 'n1',
      title: 'Balanced Playlist',
      description: 'A mix of gentle and uplifting tracks',
      category: 'music',
      duration: '50 min'
    },
    {
      id: 'n2',
      title: 'Curious Minds',
      description: 'Interesting facts and stories about the world',
      category: 'podcast',
      duration: '30 min'
    },
    {
      id: 'n3',
      title: 'Present Moment Awareness',
      description: 'Center yourself with this mindfulness practice',
      category: 'meditation',
      duration: '15 min'
    }
  ]
};

// Helper phrases for recommendations based on emotion
const recommendationPhrases: Record<EmotionType, string[]> = {
  happy: [
    "Let's amplify that great mood! How about:",
    "Wonderful to hear you're feeling good. I've got some suggestions that might match your vibe:",
    "That positive energy is contagious! Would any of these enhance your day:"
  ],
  sad: [
    "I understand you're feeling down. These might provide some comfort:",
    "When you're feeling sad, sometimes these can help:",
    "I've got some gentle suggestions that might meet you where you are:"
  ],
  stressed: [
    "I notice you're feeling stressed. These might help you unwind:",
    "Let's find something to help release some of that tension. How about:",
    "When stress is high, these options might offer some relief:"
  ],
  calm: [
    "To complement your peaceful state, you might enjoy:",
    "These selections could enhance your calm energy:",
    "Since you're feeling centered, perhaps one of these would resonate:"
  ],
  excited: [
    "With all that energy, you might enjoy:",
    "Channel that excitement with one of these options:",
    "To match your enthusiastic state, how about:"
  ],
  neutral: [
    "I've got some balanced options that might interest you:",
    "Since you're in a neutral space, perhaps one of these would be welcome:",
    "Here are some suggestions that could enhance your current state:"
  ]
};

class ContentRecommendationsService {
  // Get recommendations based on detected emotion
  static getRecommendations(emotion: EmotionType): ContentItem[] {
    return contentDatabase[emotion] || contentDatabase.neutral;
  }

  // Get an introductory phrase for recommendations
  static getRecommendationPhrase(emotion: EmotionType): string {
    const phrases = recommendationPhrases[emotion] || recommendationPhrases.neutral;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Get recommendations filtered by category
  static getRecommendationsByCategory(emotion: EmotionType, category: ContentCategory): ContentItem[] {
    const recommendations = this.getRecommendations(emotion);
    return recommendations.filter(item => item.category === category);
  }

  // Generate a natural language response with recommendations
  static generateRecommendationResponse(emotion: EmotionType): string {
    const phrase = this.getRecommendationPhrase(emotion);
    const recommendations = this.getRecommendations(emotion);
    
    let response = phrase + " ";
    
    // Add category-specific suggestions
    const musicRecs = recommendations.filter(item => item.category === 'music');
    const podcastRecs = recommendations.filter(item => item.category === 'podcast');
    const meditationRecs = recommendations.filter(item => item.category === 'meditation');
    
    if (musicRecs.length > 0) {
      response += `A "${musicRecs[0].title}" playlist, `;
    }
    
    if (podcastRecs.length > 0) {
      response += `the "${podcastRecs[0].title}" podcast, `;
    }
    
    if (meditationRecs.length > 0) {
      response += `or a ${meditationRecs[0].duration} "${meditationRecs[0].title}" meditation.`;
    }
    
    return response;
  }
}

export default ContentRecommendationsService;
