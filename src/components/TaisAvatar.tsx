
import { useEffect, useRef } from "react";

interface TaisAvatarProps {
  audioAnalyzer: HTMLAudioElement | null;
}

const TaisAvatar = ({ audioAnalyzer }: TaisAvatarProps) => {
  const avatarRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  useEffect(() => {
    if (!audioAnalyzer) return;
    
    // Initialize audio context and analyzer
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Connect our audio element to the analyzer
    const source = audioContext.createMediaElementSource(audioAnalyzer);
    source.connect(analyser);
    source.connect(audioContext.destination);
    
    // Store references
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    
    // Start animation
    animateMouth();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioAnalyzer]);
  
  const animateMouth = () => {
    if (!analyserRef.current || !dataArrayRef.current || !avatarRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate average volume across frequencies
    const avgVolume = dataArrayRef.current.reduce((sum, val) => sum + val, 0) / dataArrayRef.current.length;
    
    // Switch between images based on volume threshold
    // Using a higher threshold for clearer visual distinction
    if (avgVolume > 40) {
      avatarRef.current.src = "/lovable-uploads/6a62777d-43a0-4d35-9a1f-c7b994fd4bd9.png";
    } else {
      avatarRef.current.src = "/lovable-uploads/7c76c577-5921-45c9-8c25-9f0fca607b25.png";
    }
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animateMouth);
  };
  
  return (
    <div className="tais-avatar-container flex flex-col items-center justify-center">
      <img 
        ref={avatarRef}
        id="tais-avatar"
        src="/lovable-uploads/7c76c577-5921-45c9-8c25-9f0fca607b25.png" 
        alt="Taís Braga"
        className="w-full max-w-md rounded-lg shadow-lg mx-auto transition-all duration-100 ease-in-out"
      />
      <p className="text-lg font-medium text-gray-800 mt-3">Agente Virtual Taís Braga</p>
    </div>
  );
};

export default TaisAvatar;
