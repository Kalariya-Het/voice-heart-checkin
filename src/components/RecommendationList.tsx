
import React, { useState } from 'react';
import ContentRecommendation from './ContentRecommendation';
import { ContentItem } from '@/services/contentRecommendationsService';

interface RecommendationListProps {
  items: ContentItem[];
  onPlay: (item: ContentItem) => void;
  playingItem?: ContentItem | null;
  className?: string;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  items,
  onPlay,
  playingItem,
  className
}) => {
  if (!items || items.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-muted-foreground">No recommendations available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <ContentRecommendation
          key={item.id}
          item={item}
          onPlay={onPlay}
          isPlaying={playingItem?.id === item.id}
        />
      ))}
    </div>
  );
};

export default RecommendationList;
