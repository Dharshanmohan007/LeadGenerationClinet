import { useCallback, useEffect, useState } from 'react';
import {
  getDsaNotifications,
  getDsaUnreadCount,
  markAllDsaNotificationsRead,
  markDsaNotificationRead,
} from '../../services/dsa/dsaService';

const POLL_INTERVAL_MS = 30000;

/**
 * Manages header bell unread count, recent notification dropdown items,
 * 30-second polling, and window focus/visibility refreshes for the active DSA.
 */
export function useDsaNotifications({ enabled = true } = {}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);
  const [dropdownError, setDropdownError] = useState('');

  const refreshUnreadCount = useCallback(async () => {
    if (!enabled) return;
    try {
      const count = await getDsaUnreadCount();
      setUnreadCount(count);
    } catch {
      // Keep previous count silently during background polling
    }
  }, [enabled]);

  const fetchDropdownNotifications = useCallback(async () => {
    if (!enabled) return;
    setIsLoadingDropdown(true);
    setDropdownError('');
    try {
      const data = await getDsaNotifications({ page: 1, limit: 8 });
      setRecentNotifications(data?.items || []);
      if (typeof data?.unreadCount === 'number') {
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      setDropdownError(error?.message || 'Unable to load notifications.');
    } finally {
      setIsLoadingDropdown(false);
    }
  }, [enabled]);

  const markRead = useCallback(async (notificationId) => {
    const result = await markDsaNotificationRead(notificationId);
    setRecentNotifications((prev) =>
      prev.map((item) =>
        item._id === notificationId
          ? { ...item, isRead: true, readAt: new Date().toISOString() }
          : item
      )
    );
    if (typeof result?.unreadCount === 'number') {
      setUnreadCount(result.unreadCount);
    } else {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllDsaNotificationsRead();
    setRecentNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
        readAt: item.readAt || new Date().toISOString(),
      }))
    );
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    refreshUnreadCount();

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshUnreadCount();
      }
    }, POLL_INTERVAL_MS);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshUnreadCount();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [enabled, refreshUnreadCount]);

  return {
    unreadCount,
    setUnreadCount,
    recentNotifications,
    isLoadingDropdown,
    dropdownError,
    refreshUnreadCount,
    fetchDropdownNotifications,
    markRead,
    markAllRead,
  };
}
