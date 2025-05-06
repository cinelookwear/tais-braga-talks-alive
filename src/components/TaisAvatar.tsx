
import { useEffect, useRef, useState } from "react";

interface TaisAvatarProps {
  audioAnalyzer: HTMLAudioElement | null;
}

const TaisAvatar = ({ audioAnalyzer }: TaisAvatarProps) => {
  const avatarRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Caminhos das 14 imagens para sincronia labial
  const mouthImages = [
    "/lovable-uploads/257b12d0-08b8-4079-85d4-328211d239bb.png", // fechada
    "/lovable-uploads/c5b92567-c9e0-4a67-b580-a980dc2d6d20.png",
    "/lovable-uploads/a5bd0423-6072-40c4-acfb-b2b3f9eea219.png",
    "/lovable-uploads/cb22f9ce-5e3a-40de-b061-8b9aee51d98c.png",
    "/lovable-uploads/23d6fb35-7983-40ed-9ee0-0be5ac606dce.png",
    "/lovable-uploads/ed54a784-e835-42a4-9cf7-8a079953000e.png",
    "/lovable-uploads/c78738f9-7bfb-4928-ba3b-bda9ed0c95ca.png",
    "/lovable-uploads/b51adffb-5925-491a-9508-05833106d695.png",
    "/lovable-uploads/a8db3024-d8ea-4914-88dc-f02b284f9dd6.png",
    "/lovable-uploads/87e20de4-d868-4fdc-a828-624f4ba071bd.png",
    "/lovable-uploads/47e71d5d-b7fe-4a92-99b7-a5ee2c5377e7.png",
    "/lovable-uploads/2147fc54-cde2-4cc1-8eca-2a37d923e5fb.png",
    "/lovable-uploads/8888c712-bbd5-47e0-a87d-e2a7128a9c99.png",
    "/lovable-uploads/09029157-a321-4bef-aeba-6598b63e2eb1.png"  // mais aberta
  ];
  
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
  
  // Função para mapear o volume para um índice de imagem
  const getImageIndexFromVolume = (volume: number): number => {
    // Calibração para mapear o volume (geralmente 0-255) para índices de imagem (0-13)
    // Ajuste esses valores conforme necessário para melhor sincronia labial
    if (volume < 15) return 0; // boca fechada para volume baixo
    
    // Mapeia o volume para um dos 14 frames
    // Para uma distribuição mais uniforme: (volume / volumeMax) * (totalFrames - 1)
    const index = Math.min(Math.floor((volume / 100) * 13), 13);
    return index;
  };
  
  const animateMouth = () => {
    if (!analyserRef.current || !dataArrayRef.current || !avatarRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate average volume across frequencies
    const avgVolume = dataArrayRef.current.reduce((sum, val) => sum + val, 0) / dataArrayRef.current.length;
    
    // Obter índice da imagem com base no volume
    const imageIndex = getImageIndexFromVolume(avgVolume);
    
    // Atualizar imagem apenas se o índice mudar (otimização)
    if (imageIndex !== currentImageIndex) {
      setCurrentImageIndex(imageIndex);
      avatarRef.current.src = mouthImages[imageIndex];
      console.log(`Volume: ${avgVolume.toFixed(2)}, Mouth frame: ${imageIndex}`);
    }
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animateMouth);
  };
  
  useEffect(() => {
    // Verificar se as imagens estão disponíveis
    const preloadImages = async () => {
      try {
        const preloadPromises = mouthImages.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(`Failed to load ${src}`);
            img.src = src;
          });
        });
        
        await Promise.all(preloadPromises);
        console.log("Todas as 14 imagens de boca foram carregadas com sucesso");
      } catch (error) {
        console.error("Erro ao pré-carregar imagens:", error);
      }
    };
    
    preloadImages();
  }, []);
  
  return (
    <div className="tais-avatar-container flex flex-col items-center justify-center">
      <img 
        ref={avatarRef}
        id="tais-avatar"
        src={mouthImages[0]} 
        alt="Agente Virtual"
        className="w-full max-w-md rounded-lg shadow-lg mx-auto transition-all duration-50 ease-in-out"
        onError={(e) => {
          console.error("Error loading image:", e);
          // Provide a fallback if image fails to load
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      <p className="text-lg font-medium text-gray-800 mt-3">Agente Virtual CARYS ULTRA</p>
    </div>
  );
};

export default TaisAvatar;
