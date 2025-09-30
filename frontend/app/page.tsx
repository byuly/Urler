import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Shorten Your URLs
            <span className="block text-blue-600">Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create short, memorable links for your long URLs. Track clicks and manage all your links in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Shorten URLs in seconds with our optimized platform
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Track Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor clicks and track performance of your links
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Secure & Reliable
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your links are safe and always accessible
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-blue-600 dark:bg-blue-700 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-6">
            Create an account and start shortening URLs today!
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
