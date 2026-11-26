import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { registerUnauthorizedHandler } from '../services/apiClient';
import {
  getCurrentSession,
  loginDsa as loginDsaApi,
  loginSuperAdmin as loginSuperAdminApi,
  logoutSession,
  USER_ROLES,
} from '../services/authService';

export const AuthContext = createContext(null);

/**
 * Provides authentication state and session actions across the application.
 *
 * SECURITY & INTEGRATION DESIGN:
 * - Never fakes authentication or hardcodes login success.
 * - Does not persist sensitive credentials or tokens in localStorage.
 * - Initializes in an unauthenticated state until the backend /auth/me endpoint
 *   is enabled (via VITE_ENABLE_AUTH_SESSION_CHECK=true) or a real login succeeds.
 * - Subscribes to 401 responses from apiClient to handle expired sessions cleanly.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const checkSession = useCallback(async () => {
    setIsCheckingAuth(true);

    // Future backend integration hook:
    // Set VITE_ENABLE_AUTH_SESSION_CHECK=true in .env once GET /api/auth/me is live.
    const isSessionCheckEnabled =
      import.meta.env.VITE_ENABLE_AUTH_SESSION_CHECK === 'true';

    if (!isSessionCheckEnabled) {
      // Temporary unauthenticated baseline until backend auth endpoints are implemented.
      setUser(null);
      setIsCheckingAuth(false);
      return;
    }

    try {
      const currentUser = await getCurrentSession();
      setUser(currentUser);
      setSessionExpired(false);
    } catch {
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    // Clear active user and flag expired session whenever apiClient catches a 401.
    const unregister = registerUnauthorizedHandler(() => {
      setUser((prevUser) => {
        if (prevUser !== null) {
          setSessionExpired(true);
        }
        return null;
      });
    });

    return unregister;
  }, []);

  const loginDsa = useCallback(async (credentials) => {
    setSessionExpired(false);
    const authenticatedUser = await loginDsaApi(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const loginSuperAdmin = useCallback(async (credentials) => {
    setSessionExpired(false);
    const authenticatedUser = await loginSuperAdminApi(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutSession();
    setUser(null);
    setSessionExpired(false);
  }, []);

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isCheckingAuth,
      sessionExpired,
      isDsa: user?.role === USER_ROLES.DSA,
      isSuperAdmin: user?.role === USER_ROLES.SUPER_ADMIN,
      loginDsa,
      loginSuperAdmin,
      logout,
      checkSession,
      clearSessionExpired,
    }),
    [
      user,
      isCheckingAuth,
      sessionExpired,
      loginDsa,
      loginSuperAdmin,
      logout,
      checkSession,
      clearSessionExpired,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
