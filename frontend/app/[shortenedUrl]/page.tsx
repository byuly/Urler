'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function RedirectPage() {
  const params = useParams();
  const shortenedUrl = params.shortenedUrl as string;

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
