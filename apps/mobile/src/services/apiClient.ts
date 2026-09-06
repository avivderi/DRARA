import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './authStore';

export function getApiBaseUrl(): string {
  if (process.env['EXPO_PUBLIC_API_URL']) {
    return process.env['EXPO_PUBLIC_API_URL'];
  }
  const extraApiUrl = Constants.expoConfig?.extra?.apiUrl as string | undefined;
  if (extraApiUrl) {
    return extraApiUrl;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://127.0.0.1:3001';
}

export interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  skipAuth?: boolean;
}

interface RefreshTokenResponseBody {
  access_token?: string;
  refresh_token?: string;
}

interface ErrorResponseBody {
  error?: string;
  message?: string;
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

    const data = (await res.json()) as RefreshTokenResponseBody;
    if (data.access_token && data.refresh_token) {
      await setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    }
  } catch {
    // refresh failed silently
  }
  await clearTokens();
  return null;
}

export async function apiRequest<T = unknown>(
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
      const errJson = (await response.json()) as ErrorResponseBody;
      errorMessage = errJson.error || errJson.message || errorMessage;
    } catch {
      // ignore parsing error
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const apiGet = <T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> =>
  apiRequest<T>(endpoint, 'GET', options);

export const apiPost = <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
  apiRequest<T>(endpoint, 'POST', { ...options, body });

export const apiPatch = <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
  apiRequest<T>(endpoint, 'PATCH', { ...options, body });

export const apiDelete = <T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> =>
  apiRequest<T>(endpoint, 'DELETE', options);

export const apiClient = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> =>
    apiGet<T>(endpoint, options),
  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    apiPost<T>(endpoint, body, options),
  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    apiPatch<T>(endpoint, body, options),
  delete: <T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> =>
    apiDelete<T>(endpoint, options),
};
