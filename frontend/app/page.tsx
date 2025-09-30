import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-in">
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
            <span className="text-gray-900 dark:text-white">Shorten Your URLs</span>
            <span className="block gradient-text mt-2">Instantly</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Create short, memorable links for your long URLs. Track clicks in real-time and manage all your links in one beautiful dashboard.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-slide-up">
            <Link href="/login">
              <Button size="lg" className="shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 mb-20">
          <div className="stagger-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-6 inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">⚡</div>
            <h3 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
              Shorten URLs in milliseconds with our optimized platform and modern infrastructure
            </p>
          </div>

          <div className="stagger-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-6 inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">📊</div>
            <h3 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight">
              Real-Time Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
              Monitor clicks instantly with WebSocket updates and track performance of your links
            </p>
          </div>

          <div className="stagger-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-6 inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">🔒</div>
            <h3 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight">
              Secure & Reliable
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
              Your links are protected with JWT authentication and always accessible 24/7
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 rounded-3xl p-14 shadow-2xl animate-scale-in relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
              Join thousands of users shortening URLs and tracking analytics in real-time
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6 font-bold">
                Sign Up Now - It's Free!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
