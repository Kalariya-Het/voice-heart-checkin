
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface ResponseBubbleProps {
  message: string;
  isTyping?: boolean;
  className?: string;
  onFinishTyping?: () => void;
}

const ResponseBubble: React.FC<ResponseBubbleProps> = ({
  message,
  isTyping = false,
  className,
  onFinishTyping
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!message) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }
    
    if (!isTyping) {
      setDisplayedText(message);
      onFinishTyping?.();
      return;
    }
    
    // Reset if new message
    if (currentIndex === 0) {
      setDisplayedText('');
    }
    
    // Type effect
    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(typingInterval);
        onFinishTyping?.();
      }
    }, 30); // Typing speed
    
    return () => clearInterval(typingInterval);
  }, [message, currentIndex, isTyping, onFinishTyping]);
  
  return (
    <div className={cn(
      "p-4 rounded-2xl bg-muted text-foreground max-w-full",
      className
    )}>
      <p className="text-xl leading-relaxed">
        {displayedText}
        {isTyping && currentIndex < message.length && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
};

export default ResponseBubble;
