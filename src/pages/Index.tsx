
import { useState, useEffect } from "react";
import TaisAvatar from "@/components/TaisAvatar";
import VoiceAgent from "@/components/VoiceAgent";

const Index = () => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  const handleAudioElementReady = (element: HTMLAudioElement) => {
    console.log("Audio element ready:", element);
    setAudioElement(element);
  };
  
  useEffect(() => {
    // Verificar se as imagens estão disponíveis
    const checkImages = async () => {
      try {
        const imagePaths = [
          '/lovable-uploads/257b12d0-08b8-4079-85d4-328211d239bb.png',
          '/lovable-uploads/c5b92567-c9e0-4a67-b580-a980dc2d6d20.png',
          '/lovable-uploads/a5bd0423-6072-40c4-acfb-b2b3f9eea219.png',
          '/lovable-uploads/cb22f9ce-5e3a-40de-b061-8b9aee51d98c.png',
          '/lovable-uploads/23d6fb35-7983-40ed-9ee0-0be5ac606dce.png',
          '/lovable-uploads/ed54a784-e835-42a4-9cf7-8a079953000e.png',
          '/lovable-uploads/c78738f9-7bfb-4928-ba3b-bda9ed0c95ca.png',
          '/lovable-uploads/b51adffb-5925-491a-9508-05833106d695.png',
          '/lovable-uploads/a8db3024-d8ea-4914-88dc-f02b284f9dd6.png',
          '/lovable-uploads/87e20de4-d868-4fdc-a828-624f4ba071bd.png',
          '/lovable-uploads/47e71d5d-b7fe-4a92-99b7-a5ee2c5377e7.png',
          '/lovable-uploads/2147fc54-cde2-4cc1-8eca-2a37d923e5fb.png',
          '/lovable-uploads/8888c712-bbd5-47e0-a87d-e2a7128a9c99.png',
          '/lovable-uploads/09029157-a321-4bef-aeba-6598b63e2eb1.png'
        ];
        
        const results = await Promise.all(
          imagePaths.map(async (path, index) => {
            const response = await fetch(path);
            return { 
              path, 
              status: response.status, 
              ok: response.ok,
              index
            };
          })
        );
        
        // Log do status de todas as imagens
        results.forEach(result => {
          console.log(`Imagem ${result.index + 1}: ${result.path} - Status: ${result.status}`);
        });
        
        // Verificar se há alguma imagem que não foi carregada
        const failedImages = results.filter(result => !result.ok);
        if (failedImages.length > 0) {
          console.error("Algumas imagens não foram encontradas:", failedImages.map(img => img.path));
        } else {
          console.log("Todas as 14 imagens foram carregadas com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao verificar imagens:", error);
      }
    };
    
    checkImages();
  }, []);
  
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Agente Virtual CARYS ULTRA</h1>
        
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
                <li>Faça uma pergunta para o agente virtual</li>
                <li>Boa Conversa</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>© 2025 Agente Virtual CARYS ULTRA. Todos os direitos reservados.</p>
          <p className="mt-1">Powered by ElevenLabs</p>
        </div>
      </div>
    </div>;
};

export default Index;
