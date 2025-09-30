import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  UrlDto,
  ShortenUrlRequest,
  ClicksDto,
  TotalClicksData,
  ApiResponse,
} from './types';
import { authUtils } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle error responses
      return {
        success: false,
        error: data.error || data.message || 'An error occurred',
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    return fetchAPI<RegisterResponse>('/api/auth/public/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return fetchAPI<AuthResponse>('/api/auth/public/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// URL API (requires authentication)
export const urlAPI = {
  shortenUrl: async (data: ShortenUrlRequest): Promise<ApiResponse<UrlDto>> => {
    return fetchAPI<UrlDto>('/api/urls/shorten', {
      method: 'POST',
      headers: authUtils.getAuthHeader(),
      body: JSON.stringify(data),
    });
  },

  getMyUrls: async (): Promise<ApiResponse<UrlDto[]>> => {
    return fetchAPI<UrlDto[]>('/api/urls/myurls', {
      method: 'GET',
      headers: authUtils.getAuthHeader(),
    });
  },

  getUrlAnalytics: async (
    shortenedUrl: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<ClicksDto[]>> => {
    const params = new URLSearchParams({ startDate, endDate });
    return fetchAPI<ClicksDto[]>(`/api/urls/analytics/${shortenedUrl}?${params}`, {
      method: 'GET',
      headers: authUtils.getAuthHeader(),
    });
  },

  getTotalClicks: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<TotalClicksData>> => {
    const params = new URLSearchParams({ startDate, endDate });
    return fetchAPI<TotalClicksData>(`/api/urls/totalClicks?${params}`, {
      method: 'GET',
      headers: authUtils.getAuthHeader(),
    });
  },
};
