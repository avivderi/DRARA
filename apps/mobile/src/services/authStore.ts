import { deleteSecureItem, getSecureItem, setSecureItem } from './secureStore';

const ACCESS_TOKEN_KEY = 'drara_access_token';
const REFRESH_TOKEN_KEY = 'drara_refresh_token';

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  cachedAccessToken = accessToken;
  cachedRefreshToken = refreshToken;
  await setSecureItem(ACCESS_TOKEN_KEY, accessToken);
  await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  if (cachedAccessToken) return cachedAccessToken;
  cachedAccessToken = await getSecureItem(ACCESS_TOKEN_KEY);
  return cachedAccessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  if (cachedRefreshToken) return cachedRefreshToken;
  cachedRefreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
  return cachedRefreshToken;
}

export async function clearTokens(): Promise<void> {
  cachedAccessToken = null;
  cachedRefreshToken = null;
  await deleteSecureItem(ACCESS_TOKEN_KEY);
  await deleteSecureItem(REFRESH_TOKEN_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return Boolean(token);
}
