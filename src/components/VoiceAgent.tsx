
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceAgentProps {
  onAudioElementReady: (audioElement: HTMLAudioElement) => void;
}

const VoiceAgent = ({ onAudioElementReady }: VoiceAgentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Add the ElevenLabs script
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Return cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Wait for the widget to be loaded and find the audio element
    const findAudioElement = setInterval(() => {
      if (containerRef.current) {
        const audio = document.querySelector("audio") as HTMLAudioElement;
        
        if (audio && audio !== audioRef.current) {
          audioRef.current = audio;
          onAudioElementReady(audio);
          clearInterval(findAudioElement);
          console.log("Audio element found and passed to parent");
        }
      }
    }, 1000);
    
    return () => {
      clearInterval(findAudioElement);
    };
  }, [onAudioElementReady]);

  return (
    <Card className="voice-agent-card w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div ref={containerRef} className="elevenlabs-widget-container">
          <elevenlabs-convai agent-id="BU58ibZ81ZOTXJuiNZrB"></elevenlabs-convai>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAgent;
