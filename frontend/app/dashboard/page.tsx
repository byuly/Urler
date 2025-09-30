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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  const handleUrlShortened = () => {
    // Trigger refresh of URL list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        <div className="space-y-8">
          {/* URL Shortener Form */}
          <UrlShortenerForm onUrlShortened={handleUrlShortened} />

          {/* URL List */}
          <UrlList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
