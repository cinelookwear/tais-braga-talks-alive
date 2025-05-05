
// Define AudioContext properly for TypeScript
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// This file will be used if we need additional audio processing functionality
export const calculateAverageVolume = (dataArray: Uint8Array): number => {
  return dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
};

export const setupAudioAnalyzer = (audioElement: HTMLAudioElement) => {
  // Fix the AudioContext instantiation
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const source = audioContext.createMediaElementSource(audioElement);
  source.connect(analyser);
  source.connect(audioContext.destination);
  
  return {
    analyser,
    dataArray,
    audioContext,
    getAverageVolume: () => {
      analyser.getByteFrequencyData(dataArray);
      return calculateAverageVolume(dataArray);
    },
    cleanup: () => {
      audioContext.close();
    }
  };
};

export const createMicrophoneAnalyzer = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Fix the AudioContext instantiation
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    return {
      analyser,
      dataArray,
      audioContext,
      getAverageVolume: () => {
        analyser.getByteFrequencyData(dataArray);
        return calculateAverageVolume(dataArray);
      },
      cleanup: () => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      }
    };
  } catch (error) {
    console.error("Error accessing microphone:", error);
    throw error;
  }
};
