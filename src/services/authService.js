import apiClient, { extractApiErrorMessage } from './apiClient';

export const USER_ROLES = {
  DSA: 'dsa',
  SUPER_ADMIN: 'super_admin',
};

/**
 * Authentication API service layer for DSA and Super Admin portals.
 *
 * FUTURE BACKEND INTEGRATION POINTS:
 * - POST /api/auth/dsa/login         -> Authenticates a DSA account (HTTP-only session cookie)
 * - POST /api/auth/super-admin/login -> Authenticates a Super Admin account (HTTP-only session cookie)
 * - GET  /api/auth/me                -> Validates current session and returns { user: { id, name, email, role } }
 * - POST /api/auth/logout            -> Clears backend session cookie / token
 */

function extractAuthenticatedUser(responsePayload) {
  const user = responsePayload?.user || responsePayload?.data?.user || null;
  if (!user || typeof user.role !== 'string') {
    throw new Error(
      'Invalid authentication response from server: user role information is missing.'
    );
  }
  return user;
}

export async function loginDsa(credentials) {
  try {
    const response = await apiClient.post('/auth/dsa/login', credentials);
    const user = extractAuthenticatedUser(response.data);

    if (user.role !== USER_ROLES.DSA) {
      throw new Error('This account does not have DSA portal permissions.');
    }

    return user;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to sign in to the DSA portal. Verify the backend auth service is available.'
      )
    );
  }
}

export async function loginSuperAdmin(credentials) {
  try {
    const response = await apiClient.post('/auth/super-admin/login', credentials);
    const user = extractAuthenticatedUser(response.data);

    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      throw new Error(
        'This account does not have Super Admin portal permissions.'
      );
    }

    return user;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to sign in to the Super Admin portal. Verify the backend auth service is available.'
      )
    );
  }
}

export async function getCurrentSession() {
  const response = await apiClient.get('/auth/me');
  return extractAuthenticatedUser(response.data);
}

export async function logoutSession() {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Clearing local in-memory auth state remains safe even if logout endpoint is unavailable.
  }
}
