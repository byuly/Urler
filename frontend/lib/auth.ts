// Token management utilities for client-side

const TOKEN_KEY = 'urler_token';

export const authUtils = {
  // Save token to localStorage
  saveToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Get Authorization header
  getAuthHeader: (): Record<string, string> => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
