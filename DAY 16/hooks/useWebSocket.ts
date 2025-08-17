import { useState, useEffect, useRef, useCallback } from 'react';
import { ConnectionStatus } from '../types';

export const useWebSocket = (url: string) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTING);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    ws.current = new WebSocket(url);
    setConnectionStatus(ConnectionStatus.CONNECTING);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      setConnectionStatus(ConnectionStatus.CONNECTED);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus(ConnectionStatus.ERROR);
    };

    const currentWs = ws.current;

    return () => {
      if (currentWs.readyState === WebSocket.OPEN || currentWs.readyState === WebSocket.CONNECTING) {
        currentWs.close();
      }
    };
  }, [url]);
  
  const sendData = useCallback((data: Blob) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
      console.error('WebSocket is not connected.');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
  }, []);

  return { connectionStatus, sendData, disconnect };
};
