'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { urlAPI } from '@/lib/api';
import { UrlDto } from '@/lib/types';
import { useWebSocket } from '@/lib/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface UrlListProps {
  refreshTrigger?: number;
}

export function UrlList({ refreshTrigger }: UrlListProps) {
  const [urls, setUrls] = useState<UrlDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchUrls = async () => {
    setIsLoading(true);
    try {
      const result = await urlAPI.getMyUrls();

      if (result.success) {
        setUrls(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger]);

  // Handle WebSocket click updates with highlight effect
  const handleClickUpdate = useCallback((message: { urlId: number; clicks: number; clickDate: string }) => {
    setUrls((prevUrls) =>
      prevUrls.map((url) =>
        url.id === message.urlId ? { ...url, clicks: message.clicks } : url
      )
    );

    // Highlight the updated URL
    setHighlightedId(message.urlId);

    // Clear previous timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    // Remove highlight after animation
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedId(null);
    }, 1000);
  }, []);

  useWebSocket({
    urlIds: urls.map((url) => url.id),
    onMessage: handleClickUpdate,
  });

  const copyToClipboard = async (shortenedUrl: string) => {
    const fullUrl = `${window.location.origin}/${shortenedUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    toast.success('Copied to clipboard!');
  };

  if (isLoading) {
    return (
      <Card className="animate-scale-in">
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p className="text-gray-500 font-medium">Loading your URLs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (urls.length === 0) {
    return (
      <Card className="animate-scale-in">
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-gray-500 text-lg font-medium">
              No URLs yet. Create your first shortened URL above!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          📊 Your URLs
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({urls.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {urls.map((url, index) => (
            <div
              key={url.id}
              className={`stagger-item p-5 border-2 rounded-xl transition-all duration-300 ${
                highlightedId === url.id
                  ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20 animate-highlight shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate mb-2">
                    {url.url}
                  </p>
                  <a
                    href={`${window.location.origin}/${url.shortenedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-blue-600 dark:text-blue-400 font-semibold mb-3 truncate hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-all duration-300 inline-flex items-center gap-1 group"
                  >
                    🔗 {window.location.origin}/{url.shortenedUrl}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                  </a>
                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <span className="text-base">👆</span>
                      <span className={highlightedId === url.id ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                        {url.clicks}
                      </span>
                      clicks
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-base">📅</span>
                      {new Date(url.dateCreated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(url.shortenedUrl)}
                  className="hover:scale-110 transition-transform duration-300 shadow-md"
                >
                  📋 Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
