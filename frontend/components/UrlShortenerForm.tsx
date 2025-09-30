'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { urlAPI } from '@/lib/api';
import { UrlDto } from '@/lib/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface UrlShortenerFormProps {
  onUrlShortened?: (url: UrlDto) => void;
}

export function UrlShortenerForm({ onUrlShortened }: UrlShortenerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<UrlDto | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setShortenedUrl(null);

    try {
      const result = await urlAPI.shortenUrl({ url: data.url });

      if (result.success) {
        setShortenedUrl(result.data);
        toast.success('URL shortened successfully!');
        reset();
        onUrlShortened?.(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      const fullUrl = `${window.location.origin}/${shortenedUrl.shortenedUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shorten Your URL</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Enter your long URL"
            placeholder="https://example.com/very/long/url"
            {...register('url', {
              required: 'URL is required',
              pattern: {
                value: /^https?:\/\/.+/i,
                message: 'Please enter a valid URL starting with http:// or https://',
              },
            })}
            error={errors.url?.message as string}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </form>

        {shortenedUrl && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
              Shortened URL:
            </h4>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${window.location.origin}/${shortenedUrl.shortenedUrl}`}
                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <Button size="sm" onClick={copyToClipboard}>
                Copy
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <p>Clicks: {shortenedUrl.clicks}</p>
              <p>Created: {new Date(shortenedUrl.dateCreated).toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
