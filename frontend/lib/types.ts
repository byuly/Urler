// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

// URL types
export interface UrlDto {
  id: number;
  url: string;
  shortenedUrl: string;
  clicks: number;
  dateCreated: string; // ISO datetime string
  username: string;
}

export interface ShortenUrlRequest {
  url: string;
}

// Analytics types
export interface ClicksDto {
  clickDate: string; // ISO date string (YYYY-MM-DD)
  count: number;
}

export interface TotalClicksData {
  [date: string]: number; // date -> count mapping
}

// API response wrapper
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
