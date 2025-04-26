
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onClick,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={isListening ? "default" : "outline"}
      size="lg"
      className={cn(
        "rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300",
        isListening ? 
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30 pulse-animation" : 
          "border-2 hover:bg-primary/10",
        className
      )}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? <Mic size={24} /> : <MicOff size={24} />}
    </Button>
  );
};

export default VoiceButton;
