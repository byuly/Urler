import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <AuthForm />
    </div>
  );
}
