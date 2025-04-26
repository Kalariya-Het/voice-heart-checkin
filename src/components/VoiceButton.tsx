
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const handleClick = () => {
    onClick();
    toast({
      title: isListening ? "Microphone off" : "Microphone on",
      description: isListening 
        ? "Voice recording stopped" 
        : "I'm listening... Say 'Hey MindMosaic' to begin",
      duration: 2000,
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant={isListening ? "default" : "outline"}
      size="lg"
      className={cn(
        "rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 relative",
        isListening ? 
          "bg-primary text-primary-foreground hover:bg-primary/90" : 
          "border-2 hover:bg-primary/10",
        className
      )}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <>
          <Mic className="animate-pulse" size={24} />
          <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse" />
        </>
      ) : (
        <MicOff size={24} />
      )}
    </Button>
  );
};

export default VoiceButton;
