import apiClient, { extractApiErrorMessage } from './apiClient';

/**
 * Telegram Notification Settings API service for authenticated DSA and Super Admins.
 * Uses the shared Axios apiClient (withCredentials: true and 401 session handling).
 * Never handles or stores Telegram bot tokens on the frontend.
 */

export async function getTelegramStatus() {
  try {
    const response = await apiClient.get('/telegram/status');
    return response.data?.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to load Telegram notification settings.'
      )
    );
  }
}

export async function requestTelegramLink() {
  try {
    const response = await apiClient.post('/telegram/link');
    return response.data?.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to generate a Telegram linking URL.'
      )
    );
  }
}

export async function updateTelegramNotifications(enabled) {
  try {
    const response = await apiClient.patch('/telegram/notifications', {
      enabled: Boolean(enabled),
    });
    return response.data?.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to update Telegram notification preference.'
      )
    );
  }
}

export async function disconnectTelegram() {
  try {
    const response = await apiClient.delete('/telegram/disconnect');
    return response.data?.data;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        'Unable to disconnect your Telegram account.'
      )
    );
  }
}
