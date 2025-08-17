import React, { useState, useCallback, useMemo } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { AudioVisualizer } from './components/AudioVisualizer';
import { MicrophoneIcon, ServerIcon, StopIcon } from './components/Icons';
import { ConnectionStatus, RecordingState } from './types';

// IMPORTANT: Replace this with your actual WebSocket server URL
const WEBSOCKET_URL = 'ws://localhost:8000/ws/audio';

const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const { connectionStatus, sendData, disconnect } = useWebSocket(WEBSOCKET_URL);
  
  const handleAudioData = useCallback((chunk: Blob) => {
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      sendData(chunk);
    }
  }, [connectionStatus, sendData]);

  const { 
    recordingState, 
    startRecording, 
    stopRecording, 
    audioStream 
  } = useAudioRecorder(handleAudioData, setError);

  const handleToggleRecording = useCallback(async () => {
    setError(null);
    if (recordingState === RecordingState.RECORDING) {
      stopRecording();
    } else {
      try {
        await startRecording();
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error starting recording: ${err.message}`);
        } else {
          setError('An unknown error occurred while trying to start recording.');
        }
      }
    }
  }, [recordingState, startRecording, stopRecording]);
  
  const statusInfo = useMemo(() => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTING:
        return { text: 'Connecting to server...', color: 'text-yellow-300', icon: <ServerIcon className="animate-pulse" /> };
      case ConnectionStatus.CONNECTED:
        return { text: 'Connected', color: 'text-green-400', icon: <ServerIcon /> };
      case ConnectionStatus.DISCONNECTED:
        return { text: 'Disconnected from server', color: 'text-gray-400', icon: <ServerIcon /> };
      case ConnectionStatus.ERROR:
        return { text: 'Connection error', color: 'text-red-400', icon: <ServerIcon /> };
      default:
        return { text: 'Unknown status', color: 'text-gray-400', icon: <ServerIcon /> };
    }
  }, [connectionStatus]);

  const isRecording = recordingState === RecordingState.RECORDING;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-md border border-indigo-500/30 rounded-2xl shadow-lg shadow-indigo-500/20 p-8 flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
            Audio Streamer
          </h1>

          <div className={`flex items-center space-x-2 p-2 rounded-lg ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="font-medium text-sm">{statusInfo.text}</span>
          </div>

          <div className="w-full h-24 flex items-center justify-center bg-black/30 rounded-lg overflow-hidden border border-gray-700">
            <AudioVisualizer audioStream={audioStream} />
          </div>
          
          <button
            onClick={handleToggleRecording}
            disabled={connectionStatus !== ConnectionStatus.CONNECTED}
            className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ease-in-out focus:outline-none 
              ${isRecording 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse' 
                : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]'}
              ${connectionStatus !== ConnectionStatus.CONNECTED ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isRecording ? <StopIcon /> : <MicrophoneIcon />}
          </button>
          
          <div className="h-8 text-center">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {!error && (
              <p className="text-gray-400 text-sm">
                {connectionStatus !== ConnectionStatus.CONNECTED 
                  ? "Waiting for server connection..."
                  : isRecording
                  ? "Streaming audio..."
                  : "Press the button to start streaming"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;