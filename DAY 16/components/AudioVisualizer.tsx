import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  audioStream: MediaStream | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioStream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioStream || !canvasRef.current) {
      // Clear canvas when stream is not active
      const canvas = canvasRef.current;
      if(canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      context.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#d946ef'); // fuchsia-500
      gradient.addColorStop(0.5, '#8b5cf6'); // violet-500
      gradient.addColorStop(1, '#38bdf8'); // sky-400

      context.fillStyle = gradient;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      audioContext.close();
    };
  }, [audioStream]);

  return <canvas ref={canvasRef} width="300" height="90" className="w-full h-full" />;
};