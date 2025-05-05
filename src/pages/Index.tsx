import { useState } from "react";
import TaisAvatar from "@/components/TaisAvatar";
import VoiceAgent from "@/components/VoiceAgent";
const Index = () => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const handleAudioElementReady = (element: HTMLAudioElement) => {
    setAudioElement(element);
  };
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Agente Virtual Taís Braga</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <TaisAvatar audioAnalyzer={audioElement} />
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <VoiceAgent onAudioElementReady={handleAudioElementReady} />
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg w-full max-w-md">
              <h3 className="font-semibold text-blue-700 mb-2">Como funciona:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Clique no botão do microfone abaixo para iniciar</li>
                <li>Faça uma pergunta para a Taís Braga</li>
                <li>Boa Conversa</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>© 2025 Agente Virtual Taís Braga. Todos os direitos reservados.</p>
          <p className="mt-1">Powered by ElevenLabs</p>
        </div>
      </div>
    </div>;
};
export default Index;