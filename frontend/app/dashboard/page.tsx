'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/auth';
import { UrlShortenerForm } from '@/components/UrlShortenerForm';
import { UrlList } from '@/components/UrlList';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const authenticated = authUtils.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (!authenticated) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleUrlShortened = () => {
    // Trigger refresh of URL list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-extrabold mb-3">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Manage your shortened URLs and track real-time analytics
          </p>
        </div>

        <div className="grid gap-8 lg:gap-10">
          {/* URL Shortener Form */}
          <div className="animate-slide-up">
            <UrlShortenerForm onUrlShortened={handleUrlShortened} />
          </div>

          {/* URL List */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <UrlList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}
