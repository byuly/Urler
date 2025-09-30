import { useEffect, useRef } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ClickEventMessage {
  urlId: number;
  clicks: number;
  clickDate: string;
}

interface UseWebSocketProps {
  urlIds: number[];
  onMessage: (message: ClickEventMessage) => void;
}

export function useWebSocket({ urlIds, onMessage }: UseWebSocketProps) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<number, StompSubscription>>(new Map());

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');

        // Subscribe to each URL's click events
        urlIds.forEach((urlId) => {
          if (!subscriptionsRef.current.has(urlId)) {
            const subscription = client.subscribe(`/topic/clicks/${urlId}`, (message) => {
              console.log('Received message:', message.body);
              const clickEvent: ClickEventMessage = JSON.parse(message.body);
              onMessage(clickEvent);
            });
            subscriptionsRef.current.set(urlId, subscription);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [urlIds, onMessage]);

  return clientRef.current;
}
