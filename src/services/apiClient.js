import axios from 'axios';

/**
 * Normalizes VITE_API_BASE_URL by trimming whitespace/trailing slashes and
 * ensuring full origin-only URLs include the backend `/api` mount prefix.
 */
export function normalizeApiBaseUrl(rawValue) {
  const trimmed =
    typeof rawValue === 'string' ? rawValue.trim().replace(/\/+$/, '') : '';
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname === '' || parsed.pathname === '/') {
        if (import.meta.env?.DEV) {
          console.warn(
            `[API] VITE_API_BASE_URL ("${trimmed}") is missing the "/api" prefix. Normalizing to "${trimmed}/api" to match Express routes.`
          );
        }
        parsed.pathname = '/api';
      }
      return parsed.toString().replace(/\/+$/, '');
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

const rawBaseUrl = import.meta.env?.VITE_API_BASE_URL;
export const API_BASE_URL = normalizeApiBaseUrl(rawBaseUrl);

let unauthorizedHandler = null;

function resolveRequestTarget(config) {
  const base = config?.baseURL || API_BASE_URL || '';
  const path = config?.url || '';
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

function isCrossOriginUrl(targetUrl) {
  if (typeof window === 'undefined' || !targetUrl) return false;
  try {
    const resolved = new URL(targetUrl, window.location.origin);
    return resolved.origin !== window.location.origin;
  } catch {
    return false;
  }
}

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
 * Uses withCredentials so HTTP-only cookie sessions work cleanly without
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
      const configError = new Error(
        'API base URL is not configured. Set VITE_API_BASE_URL (ending with /api) in your frontend environment variables.'
      );
      configError.isApiConfigError = true;
      return Promise.reject(configError);
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
    const isSessionProbe =
      requestUrl === '/auth/me' || requestUrl.endsWith('/auth/me');

    if (!(status === 401 && isSessionProbe)) {
      console.error('[API Error]', {
        method: (error?.config?.method || 'GET').toUpperCase(),
        url: resolveRequestTarget(error?.config),
        status: status ?? null,
        code: error?.code ?? null,
        message: error?.message,
        data: error?.response?.data ?? null,
      });
    }

    // Trigger session-expiration handling only for authenticated endpoints,
    // never for failed credential submissions on login forms.
    if (status === 401 && !isAuthLoginRequest && typeof unauthorizedHandler === 'function') {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

/**
 * Extracts a safe, diagnostic-friendly error message from Axios, HTTP, CORS,
 * timeout, or network failures without hiding the underlying cause.
 */
export function extractApiErrorMessage(
  error,
  fallbackMessage = 'Something went wrong while communicating with the server. Please try again.'
) {
  if (!error) return fallbackMessage;

  if (error.isApiConfigError && typeof error.message === 'string') {
    return error.message;
  }

  if (error.response) {
    const { status, statusText, data, config } = error.response;

    if (data && typeof data === 'object') {
      const { message, error: errText, errors } = data;
      if (typeof message === 'string' && message.trim()) return message;
      if (typeof errText === 'string' && errText.trim()) return errText;
      if (Array.isArray(errors) && errors.length > 0) {
        const firstError = errors[0];
        if (typeof firstError === 'string') return firstError;
        if (typeof firstError?.message === 'string') return firstError.message;
      }
    }

    if (status === 404) {
      return `API endpoint not found (HTTP 404) at ${resolveRequestTarget(config)}. Verify VITE_API_BASE_URL includes the /api prefix.`;
    }

    if (status) {
      return `Server responded with HTTP ${status}${statusText ? ` (${statusText})` : ''}. Please check backend logs and try again.`;
    }
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'The request timed out while waiting for the MUKTIVA server. Please check your connection or backend database availability and try again.';
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return 'You appear to be offline. Please check your internet connection and try again.';
  }

  if (error.request && !error.response) {
    const targetUrl = resolveRequestTarget(error.config);
    if (isCrossOriginUrl(targetUrl)) {
      return `Unable to complete the request to ${API_BASE_URL || 'the backend server'}. No response was received (this usually indicates a CORS block, failed preflight, or backend/database outage).`;
    }
    return 'Unable to reach the MUKTIVA server right now. Please ensure the backend service is running and try again.';
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

/**
 * Normalizes any thrown API or validation error while preserving HTTP status,
 * Axios error code, response payload, failure category, and original cause.
 */
export function toApiError(error, fallbackMessage) {
  const message = extractApiErrorMessage(error, fallbackMessage);
  const normalized = new Error(message);
  normalized.status = error?.response?.status ?? error?.status ?? null;
  normalized.code = error?.code ?? null;
  normalized.responseData = error?.response?.data ?? null;
  normalized.category = error?.isApiConfigError
    ? 'config'
    : error?.response
      ? 'http'
      : error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT'
        ? 'timeout'
        : error?.request
          ? 'network_or_cors'
          : 'unknown';
  normalized.cause = error;
  return normalized;
}

export default apiClient;
