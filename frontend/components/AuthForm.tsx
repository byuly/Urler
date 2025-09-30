'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import { authUtils } from '@/lib/auth';
import { LoginRequest, RegisterRequest } from '@/lib/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

type FormMode = 'login' | 'register';

export function AuthForm() {
  const [mode, setMode] = useState<FormMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const loginData: LoginRequest = {
          username: data.username,
          password: data.password,
        };

        const result = await authAPI.login(loginData);

        if (result.success) {
          authUtils.saveToken(result.data.token);
          toast.success('Login successful!');
          router.push('/dashboard');
        } else {
          toast.error(result.error);
        }
      } else {
        const registerData: RegisterRequest = {
          username: data.username,
          email: data.email,
          password: data.password,
        };

        const result = await authAPI.register(registerData);

        if (result.success) {
          toast.success('Registration successful! Please login.');
          setMode('login');
          reset();
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    reset();
  };

  return (
    <Card className="w-full max-w-md animate-scale-in shadow-2xl hover:shadow-3xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-3xl text-center">
          {mode === 'login' ? '🔐 Welcome Back' : '✨ Create Account'}
        </CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
          {mode === 'login' ? 'Login to your account' : 'Sign up to get started'}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="animate-fade-in">
            <Input
              label="Username"
              placeholder="Enter your username"
              {...registerField('username', { required: 'Username is required' })}
              error={errors.username?.message as string}
              className="transition-all duration-300 focus:scale-105"
            />
          </div>

          {mode === 'register' && (
            <div className="animate-scale-in">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...registerField('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message as string}
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
          )}

          <div className="animate-fade-in">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...registerField('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message as string}
              className="transition-all duration-300 focus:scale-105"
            />
          </div>

          <Button
            type="submit"
            className={`w-full ${isLoading ? 'animate-pulse' : 'hover:scale-105'} transition-all duration-300 shadow-lg hover:shadow-xl text-lg py-6`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚡</span>
                {mode === 'login' ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : mode === 'login' ? (
              '🚀 Login'
            ) : (
              '🎉 Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:scale-105 transition-all duration-300 inline-block"
          >
            {mode === 'login'
              ? "Don't have an account? Register here →"
              : '← Already have an account? Login here'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
