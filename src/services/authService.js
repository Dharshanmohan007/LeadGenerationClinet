import apiClient, { extractApiErrorMessage } from './apiClient';

export const USER_ROLES = {
  DSA: 'dsa',
  SUPER_ADMIN: 'super_admin',
};

function extractAuthenticatedUser(responsePayload) {
  const user = responsePayload?.user || responsePayload?.data?.user || null;
  if (!user || typeof user.role !== 'string') {
    throw new Error(
      'Invalid authentication response from server: user role information is missing.'
    );
  }
  return user;
}

export async function signupDsa(payload) {
  try {
    const response = await apiClient.post('/auth/dsa/signup', payload);
    return {
      message: response.data?.message,
      user: response.data?.data?.user || null,
    };
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to submit DSA registration right now. Please try again.'
      )
    );
  }
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
        'Unable to sign in to the DSA portal. Verify your credentials and try again.'
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
        'Unable to sign in to the Super Admin portal. Verify your credentials and try again.'
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

export async function forgotPassword(email) {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return {
      message:
        response.data?.message ||
        'If a matching active account exists, password reset instructions have been processed.',
    };
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to process forgot password request right now.'
      )
    );
  }
}

export async function resetPassword({ token, password, confirmPassword }) {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return {
      message:
        response.data?.message || 'Your password has been reset successfully.',
    };
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to reset your password. Your link may have expired.'
      )
    );
  }
}

export async function changePassword({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  try {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return {
      message:
        response.data?.message || 'Password updated successfully.',
    };
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to update your password right now.'
      )
    );
  }
}
