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
    <Card className="animate-scale-in hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl"> shorten url </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
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
              className="focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className={`${isLoading ? 'animate-pulse' : 'hover:scale-105'} transition-all duration-300 shadow-lg hover:shadow-xl px-8`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Shortening...
                </span>
              ) : (
                '🔗 Shorten URL'
              )}
            </Button>
          </div>
        </form>

        {shortenedUrl && (
          <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-300 dark:border-green-700 animate-scale-in shadow-lg">
            <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
              <span className="text-lg">✅</span>
              Shortened URL:
            </h4>
            <div className="flex items-center gap-2 mb-3">
              <input
                readOnly
                value={`${window.location.origin}/${shortenedUrl.shortenedUrl}`}
                className="flex-1 px-4 py-3 text-sm font-mono bg-white dark:bg-gray-800 border-2 border-green-300 dark:border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              />
              <Button size="sm" onClick={copyToClipboard} className="hover:scale-110 transition-transform duration-300 shadow-md">
                📋 Copy
              </Button>
            </div>
            <div className="flex gap-4 text-xs text-gray-700 dark:text-gray-300 font-medium">
              <span className="flex items-center gap-1">
                <span className="text-base">👆</span>
                {shortenedUrl.clicks} clicks
              </span>
              <span className="flex items-center gap-1">
                <span className="text-base">📅</span>
                {new Date(shortenedUrl.dateCreated).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
