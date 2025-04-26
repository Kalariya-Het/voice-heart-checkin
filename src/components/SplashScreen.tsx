
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

const SplashScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background",
      "animate-fade-in transition-opacity duration-1000"
    )}>
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          MindMosaic
        </h1>
        <div className="animate-pulse">
          <p className="text-muted-foreground">Your Voice Companion</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
