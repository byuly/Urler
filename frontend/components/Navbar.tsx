'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authUtils } from '@/lib/auth';
import { Button } from './ui/Button';

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status whenever the route changes
    setIsAuthenticated(authUtils.isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    authUtils.removeToken();
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Urler
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
