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
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-extrabold gradient-text hover:scale-105 transition-transform duration-300">
            Urler
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-all duration-300">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="hover:scale-105 transition-all duration-300">
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hover:scale-105 transition-all duration-300">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
