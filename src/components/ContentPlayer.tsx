
import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/services/contentRecommendationsService';
import { cn } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentPlayerProps {
  content?: ContentItem;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  className?: string;
}

const ContentPlayer: React.FC<ContentPlayerProps> = ({
  content,
  isPlaying,
  onPlayPause,
  onClose,
  className
}) => {
  const [progress, setProgress] = useState(0);
  
  // Simulated progress update
  useEffect(() => {
    if (!content || !isPlaying) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          onPlayPause();
          return 0;
        }
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [content, isPlaying, onPlayPause]);
  
  if (!content) return null;
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-4 shadow-lg",
      className
    )}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{content.title}</h3>
            <p className="text-xs text-muted-foreground">{content.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <SkipBack size={16} />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full h-10 w-10" 
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <SkipForward size={16} />
            </Button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 w-full bg-muted mt-4">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentPlayer;
