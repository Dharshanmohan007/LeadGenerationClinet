import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, FileText, Loader2 } from 'lucide-react';
import {
  ENQUIRY_SOURCE_META,
  formatRelativeTime,
} from '../../../config/dsa/enquiryConfig';

/**
 * Header Notification Bell + Dropdown Panel for DSA administrators.
 */
export default function NotificationBell({ notificationsState }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const {
    unreadCount,
    recentNotifications,
    isLoadingDropdown,
    dropdownError,
    fetchDropdownNotifications,
    markRead,
    markAllRead,
  } = notificationsState;

  useEffect(() => {
    if (!open) return undefined;
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  function handleToggle() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      fetchDropdownNotifications();
    }
  }

  async function handleNotificationClick(item) {
    setOpen(false);
    if (!item.isRead) {
      try {
        await markRead(item._id);
      } catch {
        // Still navigate to the enquiry detail view
      }
    }
    navigate(
      `/dsa/enquiries/${item.enquiryId}?source=${encodeURIComponent(item.source)}`
    );
  }

  const badgeText = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notifications (${unreadCount} unread)`}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-lf-line bg-white text-lf-navy transition-colors hover:bg-lf-bg cursor-pointer"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="tabular-nums absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-[#b42318] px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white ring-2 ring-white">
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div
          role="region"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-lf-line bg-white shadow-[0_20px_50px_rgba(16,37,65,0.16)] sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-lf-line px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-lf-navy">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-[#b42318]">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs font-bold text-lf-green hover:text-lf-green-dark cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-lf-line">
            {isLoadingDropdown && (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-lf-muted">
                <Loader2 className="h-4 w-4 animate-spin text-lf-green" aria-hidden="true" />
                Loading notifications...
              </div>
            )}

            {!isLoadingDropdown && dropdownError && (
              <p className="px-4 py-6 text-center text-xs text-[#b42318]">
                {dropdownError}
              </p>
            )}

            {!isLoadingDropdown &&
              !dropdownError &&
              recentNotifications.length === 0 && (
                <p className="px-4 py-8 text-center text-xs text-lf-muted">
                  No enquiry notifications yet.
                </p>
              )}

            {!isLoadingDropdown &&
              !dropdownError &&
              recentNotifications.map((item) => {
                const sourceMeta =
                  ENQUIRY_SOURCE_META[item.source] ||
                  ENQUIRY_SOURCE_META.website;

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-lf-bg cursor-pointer ${
                      item.isRead ? 'bg-white' : 'bg-lf-green-tint/60'
                    }`}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lf-green-soft text-lf-green">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-bold text-lf-navy">
                          {item.title || 'New Enquiry Received'}
                        </p>
                        {!item.isRead && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-lf-green"
                            title="Unread"
                          />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-lf-muted">
                        You received a new enquiry.
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="tabular-nums text-[11px] font-bold text-lf-navy">
                          {item.referenceId}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${sourceMeta.badgeClass}`}
                        >
                          {sourceMeta.label}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-lf-muted">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="border-t border-lf-line bg-lf-bg px-4 py-2.5 text-center">
            <Link
              to="/dsa/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-lf-navy hover:text-lf-green"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
