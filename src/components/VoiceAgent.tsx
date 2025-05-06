
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceAgentProps {
  onAudioElementReady: (audioElement: HTMLAudioElement) => void;
}

// Define the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
      }
    }
  }
}

const VoiceAgent = ({ onAudioElementReady }: VoiceAgentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const findIntervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Add the ElevenLabs script
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Return cleanup function
    return () => {
      document.body.removeChild(script);
      
      // Limpar o intervalo se ele ainda existir
      if (findIntervalRef.current) {
        clearInterval(findIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Função para encontrar o elemento de áudio e transmiti-lo para o componente pai
    const findAudioElement = () => {
      const audio = document.querySelector("audio") as HTMLAudioElement;
      
      if (audio && audio !== audioRef.current) {
        audioRef.current = audio;
        onAudioElementReady(audio);
        console.log("Elemento de áudio encontrado e passado para o componente pai");
        
        // Adicionar informações de depuração para o elemento de áudio
        audio.addEventListener('play', () => console.log("Áudio começou a tocar (de VoiceAgent)"));
        audio.addEventListener('pause', () => console.log("Áudio pausado (de VoiceAgent)"));
        audio.addEventListener('ended', () => console.log("Áudio terminou (de VoiceAgent)"));
        
        // Limpar o intervalo depois de encontrar o elemento de áudio
        if (findIntervalRef.current) {
          clearInterval(findIntervalRef.current);
          findIntervalRef.current = null;
        }
      }
    };
    
    // Verifica repetidamente até encontrar o elemento de áudio
    findIntervalRef.current = window.setInterval(findAudioElement, 500);
    
    // Tentar encontrar o elemento de áudio imediatamente
    findAudioElement();
    
    return () => {
      if (findIntervalRef.current) {
        clearInterval(findIntervalRef.current);
      }
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
