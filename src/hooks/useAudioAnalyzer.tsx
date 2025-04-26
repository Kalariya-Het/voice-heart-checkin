
import { useState, useEffect, useRef } from 'react';

interface AudioAnalyzerResult {
  audioLevel: number; // 0-1
  audioPattern: {
    pitch: number;
    rate: number;
    volume: number;
  };
  isAnalyzing: boolean;
  startAnalyzing: () => Promise<void>;
  stopAnalyzing: () => void;
}

const useAudioAnalyzer = (): AudioAnalyzerResult => {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [audioPattern, setAudioPattern] = useState<{ pitch: number; rate: number; volume: number }>({
    pitch: 1,
    rate: 1,
    volume: 1
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Clean up
  useEffect(() => {
    return () => {
      stopAnalyzing();
    };
  }, []);
  
  const startAnalyzing = async (): Promise<void> => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyzer
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Connect microphone to analyzer
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Start analyzing
      setIsAnalyzing(true);
      analyzeAudio();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopAnalyzing = (): void => {
    // Stop the analysis loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Close audio tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsAnalyzing(false);
    setAudioLevel(0);
  };
  
  const analyzeAudio = (): void => {
    if (!analyserRef.current || !isAnalyzing) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateAnalysis = () => {
      if (!analyserRef.current || !isAnalyzing) return;
      
      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedLevel = average / 255; // Convert to 0-1 range
      
      setAudioLevel(normalizedLevel);
      
      // Simple estimation of pitch, rate and volume
      // This is a simplified simulation - real pitch detection is more complex
      const lowFreqAvg = dataArray.slice(0, Math.floor(bufferLength / 3)).reduce((sum, val) => sum + val, 0) / 
                         Math.floor(bufferLength / 3);
      const midFreqAvg = dataArray.slice(Math.floor(bufferLength / 3), Math.floor(2 * bufferLength / 3)).reduce((sum, val) => sum + val, 0) / 
                         Math.floor(bufferLength / 3);
      const highFreqAvg = dataArray.slice(Math.floor(2 * bufferLength / 3)).reduce((sum, val) => sum + val, 0) / 
                          Math.floor(bufferLength / 3);
      
      // Normalize to reasonable ranges
      const pitchEstimate = ((highFreqAvg / 255) * 0.8) + 0.6; // 0.6-1.4 range
      const rateEstimate = ((midFreqAvg / 255) * 0.8) + 0.6; // 0.6-1.4 range
      const volumeEstimate = normalizedLevel;
      
      setAudioPattern({
        pitch: pitchEstimate,
        rate: rateEstimate,
        volume: volumeEstimate
      });
      
      // Continue analyzing
      animationFrameRef.current = requestAnimationFrame(updateAnalysis);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateAnalysis);
  };
  
  return {
    audioLevel,
    audioPattern,
    isAnalyzing,
    startAnalyzing,
    stopAnalyzing
  };
};

export default useAudioAnalyzer;
