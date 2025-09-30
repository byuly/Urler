import { useEffect, useRef} from 'react';
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
  const onMessageRef = useRef(onMessage);

  // Keep onMessage ref updated without causing reconnections
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Initialize WebSocket connection once
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
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
  }, []); // Only connect once

  // Handle subscriptions separately when urlIds change
  useEffect(() => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      // Wait for connection and retry
      const timer = setTimeout(() => {
        if (clientRef.current?.connected) {
          subscribeToUrls();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    subscribeToUrls();

    function subscribeToUrls() {
      const client = clientRef.current;
      if (!client) return;

      // Subscribe to new URLs
      urlIds.forEach((urlId) => {
        if (!subscriptionsRef.current.has(urlId)) {
          console.log(`Subscribing to /topic/clicks/${urlId}`);
          const subscription = client.subscribe(`/topic/clicks/${urlId}`, (message) => {
            console.log('Received message:', message.body);
            const clickEvent: ClickEventMessage = JSON.parse(message.body);
            onMessageRef.current(clickEvent);
          });
          subscriptionsRef.current.set(urlId, subscription);
        }
      });

      // Unsubscribe from removed URLs
      const currentUrlIds = new Set(urlIds);
      subscriptionsRef.current.forEach((subscription, urlId) => {
        if (!currentUrlIds.has(urlId)) {
          console.log(`Unsubscribing from /topic/clicks/${urlId}`);
          subscription.unsubscribe();
          subscriptionsRef.current.delete(urlId);
        }
      });
    }
  }, [urlIds]);

  return clientRef.current;
}
