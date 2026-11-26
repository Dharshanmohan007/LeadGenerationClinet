import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : '';

let unauthorizedHandler = null;

/**
 * Allows AuthContext to register a callback that runs when a non-login API call
 * receives a 401 Unauthorized response (e.g., an expired session).
 */
export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

/**
 * Shared Axios instance configured via VITE_API_BASE_URL.
 * Uses withCredentials so future HTTP-only cookie sessions work cleanly without
 * storing sensitive tokens in localStorage.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      return Promise.reject(
        new Error(
          'API base URL is not configured. Set VITE_API_BASE_URL in your frontend .env file.'
        )
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';
    const isAuthLoginRequest =
      requestUrl.includes('/auth/dsa/login') ||
      requestUrl.includes('/auth/super-admin/login');

    // Trigger session-expiration handling only for authenticated endpoints,
    // never for failed credential submissions on login forms.
    if (status === 401 && !isAuthLoginRequest && typeof unauthorizedHandler === 'function') {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

/**
 * Extracts a safe, user-friendly error message from Axios or network failures.
 */
export function extractApiErrorMessage(
  error,
  fallbackMessage = 'Something went wrong while communicating with the server. Please try again.'
) {
  if (!error) return fallbackMessage;

  if (error.response?.data) {
    const { message, error: errText, errors } = error.response.data;
    if (typeof message === 'string' && message.trim()) return message;
    if (typeof errText === 'string' && errText.trim()) return errText;
    if (Array.isArray(errors) && errors.length > 0) {
      const firstError = errors[0];
      if (typeof firstError === 'string') return firstError;
      if (typeof firstError?.message === 'string') return firstError.message;
    }
  }

  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your connection and try again.';
  }

  if (error.request && !error.response) {
    return 'Unable to reach the MUKTIVA server right now. Please ensure the backend service is running and try again.';
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export default apiClient;
