import { useState, useEffect } from "react";
import { Badge } from "./badge";
import { AlertCircle, CheckCircle2, WifiOff } from "lucide-react";

export interface WsConnectStatusProps {
  url: string;
  onConnect?: (socket: WebSocket) => void;
  onDisconnect?: () => void;
  onMessage?: (data: any) => void;
  className?: string;
}

export function WsConnectStatus({
  url,
  onConnect,
  onDisconnect,
  onMessage,
  className
}: WsConnectStatusProps) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(url);
    
    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
      setStatus('connected');
      setSocket(ws);
      if (onConnect) onConnect(ws);
    });
    
    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      setStatus('disconnected');
      if (onDisconnect) onDisconnect();
    });
    
    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setStatus('disconnected');
    });
    
    if (onMessage) {
      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      });
    }
    
    // Clean up function
    return () => {
      ws.close();
    };
  }, [url, onConnect, onDisconnect, onMessage]);
  
  const getStatusDisplay = () => {
    switch (status) {
      case 'connecting':
        return (
          <Badge variant="outline" className="text-amber-500 animate-pulse">
            <AlertCircle className="w-3 h-3 mr-1" />
            Conectando...
          </Badge>
        );
      case 'connected':
        return (
          <Badge variant="outline" className="text-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline" className="text-red-500">
            <WifiOff className="w-3 h-3 mr-1" />
            Desconectado
          </Badge>
        );
    }
  };
  
  return (
    <div className={className}>
      {getStatusDisplay()}
    </div>
  );
}