
import React from "react";
import { toast } from "@/components/ui/use-toast";

interface BrowserCompatibilityProps {
  hasRecognitionSupport: boolean;
  hasSynthesisSupport: boolean;
}

export const withBrowserCompatibility = <P extends BrowserCompatibilityProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithBrowserCompatibility(props: Omit<P, keyof BrowserCompatibilityProps>) {
    const [checkedBrowser, setCheckedBrowser] = React.useState(false);

    React.useEffect(() => {
      if (!checkedBrowser) {
        const hasRecognition = !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
        const hasSynthesis = 'speechSynthesis' in window;

        if (!hasRecognition || !hasSynthesis) {
          toast({
            variant: "destructive",
            title: "Browser Compatibility Issue",
            description: "Please use Chrome, Edge, or Safari for full voice functionality.",
            duration: 5000,
          });
        }
        setCheckedBrowser(true);
      }
    }, [checkedBrowser]);

    return (
      <WrappedComponent
        {...(props as P)}
        hasRecognitionSupport={!!(window.SpeechRecognition || (window as any).webkitSpeechRecognition)}
        hasSynthesisSupport={'speechSynthesis' in window}
      />
    );
  };
};
