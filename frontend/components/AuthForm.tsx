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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Login' : 'Register'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter your username"
            {...registerField('username', { required: 'Username is required' })}
            error={errors.username?.message as string}
          />

          {mode === 'register' && (
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
            />
          )}

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
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
