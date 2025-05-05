
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
  
  // Caminhos das imagens
  const closedMouthImage = "/lovable-uploads/e659eeed-15d3-4bc0-b51f-9b993c5ff130.png";
  const openMouthImage = "/lovable-uploads/4f134e66-6340-4425-a349-9a5425b5ca13.png";
  
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
      avatarRef.current.src = openMouthImage;
      console.log("Mouth open image:", openMouthImage);
    } else {
      avatarRef.current.src = closedMouthImage;
      console.log("Mouth closed image:", closedMouthImage);
    }
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animateMouth);
  };
  
  return (
    <div className="tais-avatar-container flex flex-col items-center justify-center">
      <img 
        ref={avatarRef}
        id="tais-avatar"
        src={closedMouthImage} 
        alt="Taís Braga"
        className="w-full max-w-md rounded-lg shadow-lg mx-auto transition-all duration-100 ease-in-out"
        onError={(e) => {
          console.error("Error loading image:", e);
          // Provide a fallback if image fails to load
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      <p className="text-lg font-medium text-gray-800 mt-3">Agente Virtual Taís Braga</p>
    </div>
  );
};

export default TaisAvatar;
