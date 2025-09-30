'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function RedirectPage() {
  const params = useParams();
  const shortenedUrl = params.shortenedUrl as string;
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = () => {
      // Simply redirect to the backend which will handle the 302 redirect
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      window.location.href = `${API_URL}/${shortenedUrl}`;
    };

    // Small delay to show loading state
    const timer = setTimeout(redirect, 500);
    return () => clearTimeout(timer);
  }, [shortenedUrl]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            404 - URL Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The shortened URL you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Go back home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
