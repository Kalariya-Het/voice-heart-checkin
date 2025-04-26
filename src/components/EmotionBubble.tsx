
import React from "react";
import { cn } from "@/lib/utils";

export type EmotionType = "neutral" | "happy" | "sad" | "stressed" | "calm" | "excited";

interface EmotionBubbleProps {
  emotion: EmotionType;
  confidence?: number; // 0-1
  className?: string;
  size?: "sm" | "md" | "lg";
}

const EmotionBubble: React.FC<EmotionBubbleProps> = ({
  emotion,
  confidence = 1,
  className,
  size = "md"
}) => {
  // Colors mapped to emotions
  const emotionColors: Record<EmotionType, string> = {
    neutral: "from-blue-300 to-purple-300",
    happy: "from-yellow-300 to-orange-300",
    sad: "from-blue-400 to-indigo-500",
    stressed: "from-red-400 to-pink-400",
    calm: "from-teal-300 to-cyan-400",
    excited: "from-fuchsia-400 to-pink-300"
  };

  // Icons or emojis could be added here
  const emotionLabels: Record<EmotionType, string> = {
    neutral: "Neutral",
    happy: "Happy",
    sad: "Sad",
    stressed: "Stressed",
    calm: "Calm",
    excited: "Excited"
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base"
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-r animate-pulse-subtle",
        emotionColors[emotion],
        sizeClasses[size],
        className
      )}
      style={{
        opacity: 0.3 + (confidence * 0.7) // Fade with confidence
      }}
    >
      <span className="sr-only">{emotionLabels[emotion]}</span>
    </div>
  );
};

export default EmotionBubble;
