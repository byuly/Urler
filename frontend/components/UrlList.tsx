'use client';

import { useEffect, useState, useCallback } from 'react';
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

  // Handle WebSocket click updates
  const handleClickUpdate = useCallback((message: { urlId: number; clicks: number; clickDate: string }) => {
    setUrls((prevUrls) =>
      prevUrls.map((url) =>
        url.id === message.urlId ? { ...url, clicks: message.clicks } : url
      )
    );
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
      <Card>
        <CardContent>
          <p className="text-center text-gray-500">Loading your URLs...</p>
        </CardContent>
      </Card>
    );
  }

  if (urls.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-gray-500">
            No URLs yet. Create your first shortened URL above!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Shortened URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {urls.map((url) => (
            <div
              key={url.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {url.url}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    {window.location.origin}/{url.shortenedUrl}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>👆 {url.clicks} clicks</span>
                    <span>📅 {new Date(url.dateCreated).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button size="sm" onClick={() => copyToClipboard(url.shortenedUrl)}>
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
