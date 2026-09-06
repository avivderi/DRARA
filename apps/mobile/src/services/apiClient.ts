import { Platform } from 'react-native';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './authStore';

export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
}


export interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  skipAuth?: boolean;
}

async function refreshAuthTokens(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      await clearTokens();
      return null;
    }

    const data = await res.json();
    if (data.access_token && data.refresh_token) {
      await setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    }
  } catch (err) {
    console.error('Failed to refresh auth tokens:', err);
  }
  await clearTokens();
  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET',
  options: RequestOptions = {},
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${getApiBaseUrl()}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (!options.skipAuth) {
    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (options.body && method !== 'GET') {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  let response = await fetch(url, fetchOptions);

  // If 401 Unauthorized, try refreshing tokens once and retry request
  if (response.status === 401 && !options.skipAuth) {
    const newToken = await refreshAuthTokens();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      fetchOptions.headers = headers;
      response = await fetch(url, fetchOptions);
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errJson = await response.json();
      errorMessage = errJson.error || errJson.message || errorMessage;
    } catch {
      // ignore parsing error
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiGet = <T = any>(endpoint: string, options?: RequestOptions) =>
  apiRequest<T>(endpoint, 'GET', options);

export const apiPost = <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
  apiRequest<T>(endpoint, 'POST', { ...options, body });

export const apiPatch = <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
  apiRequest<T>(endpoint, 'PATCH', { ...options, body });

export const apiDelete = <T = any>(endpoint: string, options?: RequestOptions) =>
  apiRequest<T>(endpoint, 'DELETE', options);
