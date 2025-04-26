
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Headphones, Volume2, Pause } from "lucide-react";
import { EmotionType } from '@/components/EmotionBubble';
import { ContentItem } from '@/services/contentRecommendationsService';

interface ContentRecommendationProps {
  item: ContentItem;
  onPlay: (item: ContentItem) => void;
  isPlaying: boolean;
  className?: string;
}

const ContentRecommendation: React.FC<ContentRecommendationProps> = ({
  item,
  onPlay,
  isPlaying,
  className
}) => {
  // Get the appropriate icon based on content category
  const getIcon = () => {
    switch (item.category) {
      case 'music':
        return <Volume2 size={18} />;
      case 'podcast':
        return <Headphones size={18} />;
      default:
        return <Volume2 size={18} />;
    }
  };

  return (
    <div className={`bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center text-primary">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{item.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          {item.duration && (
            <p className="text-xs text-muted-foreground/80 mt-1">{item.duration}</p>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10 flex items-center justify-center"
          onClick={() => onPlay(item)}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default ContentRecommendation;
