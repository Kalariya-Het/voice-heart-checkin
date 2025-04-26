
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VoiceWaveVisualizerProps {
  isListening: boolean;
  audioLevel?: number;
  className?: string;
}

const VoiceWaveVisualizer: React.FC<VoiceWaveVisualizerProps> = ({
  isListening,
  audioLevel = 0,
  className
}) => {
  const barCount = 5;
  const maxHeight = 40;

  // Calculate height based on audio level with a minimum height when listening
  const calculateHeight = (index: number) => {
    if (!isListening) return 4;
    
    // Create a wave-like pattern that's influenced by the audio level
    const baseHeight = Math.max(8, audioLevel * maxHeight);
    const position = index / (barCount - 1); // 0 to 1
    const waveOffset = Math.sin(position * Math.PI) * 0.8 + 0.2;
    
    return baseHeight * waveOffset;
  };

  return (
    <div className={cn("flex items-end justify-center gap-1 h-12", className)}>
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 rounded-full transition-all duration-150 ease-in-out",
            isListening ? "bg-primary pulse-animation" : "bg-muted"
          )}
          style={{
            height: `${calculateHeight(index)}px`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveVisualizer;
