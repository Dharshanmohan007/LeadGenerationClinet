import apiClient, { toApiError } from '../apiClient';

const SOURCE_ENDPOINT_MAP = {
  website: '/dsa/enquiries/website',
  cibil: '/dsa/enquiries/cibil',
  bank_rejected: '/dsa/enquiries/bank-rejected',
};

export async function getDsaDashboardStats(period = 'daily') {
  try {
    const response = await apiClient.get('/dsa/dashboard/stats', {
      params: { period },
    });
    return response.data?.data;
  } catch (error) {
    throw toApiError(error, 'Unable to load dashboard analytics.');
  }
}

export async function getRecentDsaEnquiries(limit = 8) {
  try {
    const response = await apiClient.get('/dsa/dashboard/recent-enquiries', {
      params: { limit },
    });
    return response.data?.data?.items || [];
  } catch (error) {
    throw toApiError(error, 'Unable to load recent enquiries.');
  }
}

export async function listDsaEnquiries(source, params = {}) {
  const endpoint = SOURCE_ENDPOINT_MAP[source] || '/dsa/enquiries/website';
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data?.data;
  } catch (error) {
    throw toApiError(error, 'Unable to load enquiry records.');
  }
}

export async function getDsaEnquiryDetail(id, source = '') {
  const basePath =
    source && SOURCE_ENDPOINT_MAP[source]
      ? `${SOURCE_ENDPOINT_MAP[source]}/${id}`
      : `/dsa/enquiries/${id}`;

  try {
    const response = await apiClient.get(basePath, {
      params: source ? { source } : undefined,
    });
    return response.data?.data?.enquiry;
  } catch (error) {
    throw toApiError(error, 'Unable to load enquiry details.');
  }
}

export async function updateDsaEnquiry(id, payload, source = '') {
  const basePath =
    source && SOURCE_ENDPOINT_MAP[source]
      ? `${SOURCE_ENDPOINT_MAP[source]}/${id}`
      : `/dsa/enquiries/${id}`;

  try {
    const response = await apiClient.patch(basePath, payload, {
      params: source ? { source } : undefined,
    });
    return {
      enquiry: response.data?.data?.enquiry,
      message: response.data?.message || 'Enquiry updated successfully.',
    };
  } catch (error) {
    throw toApiError(error, 'Unable to update enquiry.');
  }
}

export async function getDsaProfile() {
  try {
    const response = await apiClient.get('/dsa/profile');
    return response.data?.data?.user;
  } catch (error) {
    throw toApiError(error, 'Unable to load your DSA profile.');
  }
}

export async function updateDsaProfile(payload) {
  try {
    const response = await apiClient.patch('/dsa/profile', payload);
    return {
      user: response.data?.data?.user,
      message: response.data?.message || 'Profile updated successfully.',
    };
  } catch (error) {
    throw toApiError(error, 'Unable to update your DSA profile.');
  }
}

export async function getDsaNotifications(params = {}) {
  try {
    const response = await apiClient.get('/dsa/notifications', { params });
    return response.data?.data;
  } catch (error) {
    throw toApiError(error, 'Unable to load notifications.');
  }
}

export async function getDsaUnreadCount() {
  try {
    const response = await apiClient.get('/dsa/notifications/unread-count');
    return response.data?.data?.unreadCount ?? 0;
  } catch (error) {
    throw toApiError(error, 'Unable to load unread notification count.');
  }
}

export async function markDsaNotificationRead(notificationId) {
  try {
    const response = await apiClient.patch(
      `/dsa/notifications/${notificationId}/read`
    );
    return response.data?.data;
  } catch (error) {
    throw toApiError(error, 'Unable to mark notification as read.');
  }
}

export async function markAllDsaNotificationsRead() {
  try {
    const response = await apiClient.patch('/dsa/notifications/read-all');
    return response.data?.data;
  } catch (error) {
    throw toApiError(error, 'Unable to mark all notifications as read.');
  }
}
