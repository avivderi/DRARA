import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { getApiBaseUrl } from './apiClient';
import { setTokens } from './authStore';

WebBrowser.maybeCompleteAuthSession();

/**
 * Checks if the current Web URL contains access_token & refresh_token from an OAuth redirect.
 * If present, saves them to authStore and cleans the browser URL.
 */
export async function initAuthFromUrl(): Promise<boolean> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const urlObj = new URL(window.location.href);
    const accessToken = urlObj.searchParams.get('access_token');
    const refreshToken = urlObj.searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      await setTokens(accessToken, refreshToken);
      // Clean up query parameters from browser address bar
      urlObj.searchParams.delete('access_token');
      urlObj.searchParams.delete('refresh_token');
      const cleanUrl = urlObj.pathname + (urlObj.searchParams.toString() ? '?' + urlObj.searchParams.toString() : '');
      window.history.replaceState({}, document.title, cleanUrl);
      return true;
    }
  }
  return false;
}

export async function loginWithOAuth(provider: 'google' | 'github'): Promise<boolean> {
  try {
    const redirectUri = makeRedirectUri({ scheme: 'drara' });
    const authUrl = `${getApiBaseUrl()}/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = authUrl;
      return true;
    }

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      const urlObj = new URL(result.url);
      const accessToken = urlObj.searchParams.get('access_token');
      const refreshToken = urlObj.searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        await setTokens(accessToken, refreshToken);
        return true;
      }
    }
  } catch {
    // OAuth error
  }
  return false;
}
