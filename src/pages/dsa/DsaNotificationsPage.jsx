import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
} from 'lucide-react';
import Button from '../../components/common/Button';
import DsaLayout from '../../components/dsa/layout/DsaLayout';
import {
  ENQUIRY_SOURCE_META,
  formatRelativeTime,
} from '../../config/dsa/enquiryConfig';
import {
  getDsaNotifications,
  markAllDsaNotificationsRead,
  markDsaNotificationRead,
} from '../../services/dsa/dsaService';

export default function DsaNotificationsPage() {
  const navigate = useNavigate();
  const [readStatus, setReadStatus] = useState('all');
  const [source, setSource] = useState('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getDsaNotifications({
        readStatus,
        source,
        page,
        limit: 15,
      });
      setData(res);
    } catch (err) {
      setError(err?.message || 'Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [readStatus, source, page]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function handleOpenNotification(item, refreshBellCount) {
    if (!item.isRead) {
      try {
        await markDsaNotificationRead(item._id);
        refreshBellCount();
      } catch {
        // Proceed to enquiry details
      }
    }
    navigate(
      `/dsa/enquiries/${item.enquiryId}?source=${encodeURIComponent(item.source)}`
    );
  }

  async function handleMarkSingleRead(item, refreshBellCount) {
    await markDsaNotificationRead(item._id);
    refreshBellCount();
    await loadNotifications();
  }

  async function handleMarkAll(refreshBellCount) {
    await markAllDsaNotificationsRead();
    refreshBellCount();
    await loadNotifications();
  }

  const items = data?.items || [];
  const unreadCount = data?.unreadCount ?? 0;
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <DsaLayout
      pageTitle="Notifications"
      pageSubtitle="Complete history of your customer enquiry alerts"
    >
      {({ notificationsState }) => (
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-lf-line bg-white p-4 shadow-2xs sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: `Unread (${unreadCount})` },
                { key: 'read', label: 'Read' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setReadStatus(tab.key);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    readStatus === tab.key
                      ? 'bg-lf-navy text-white'
                      : 'bg-lf-bg text-lf-muted hover:text-lf-navy'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <select
                aria-label="Filter notifications by source"
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-[#d8e0e8] bg-white px-3 py-1.5 text-xs font-semibold text-lf-navy"
              >
                <option value="all">All Sources</option>
                <option value="website">Website Enquiries</option>
                <option value="cibil">CIBIL Enquiries</option>
                <option value="bank_rejected">Bank Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadNotifications}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  onClick={() =>
                    handleMarkAll(notificationsState.refreshUnreadCount)
                  }
                >
                  <CheckCheck className="h-4 w-4" aria-hidden="true" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-hidden rounded-2xl border border-lf-line bg-white shadow-2xs">
            {error ? (
              <div className="p-10 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-[#b42318]" />
                <p className="mt-2 text-sm font-bold text-lf-navy">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadNotifications}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : isLoading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-16 animate-pulse rounded-xl bg-lf-bg"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Bell className="mx-auto h-10 w-10 text-lf-muted" />
                <p className="mt-3 text-sm font-bold text-lf-navy">
                  No notifications found
                </p>
                <p className="mt-1 text-xs text-lf-muted">
                  New enquiry notifications appear here automatically when leads
                  are submitted.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-lf-line">
                {items.map((item) => {
                  const sourceMeta =
                    ENQUIRY_SOURCE_META[item.source] ||
                    ENQUIRY_SOURCE_META.website;

                  return (
                    <div
                      key={item._id}
                      className={`flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center ${
                        item.isRead ? 'bg-white' : 'bg-lf-green-tint/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenNotification(
                            item,
                            notificationsState.refreshUnreadCount
                          )
                        }
                        className="flex flex-1 items-start gap-3.5 text-left cursor-pointer"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lf-green-soft text-lf-green">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-lf-navy">
                              {item.title}
                            </p>
                            {!item.isRead && (
                              <span className="rounded-full bg-lf-green px-2 py-0.5 text-[10px] font-bold text-white">
                                Unread
                              </span>
                            )}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${sourceMeta.badgeClass}`}
                            >
                              {sourceMeta.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-lf-muted">
                            {item.message} Reference ID:{' '}
                            <strong className="tabular-nums text-lf-navy">
                              {item.referenceId}
                            </strong>
                          </p>
                          <p className="mt-1 text-[11px] text-lf-muted">
                            {formatRelativeTime(item.createdAt)}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        {!item.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleMarkSingleRead(
                                item,
                                notificationsState.refreshUnreadCount
                              )
                            }
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleOpenNotification(
                              item,
                              notificationsState.refreshUnreadCount
                            )
                          }
                        >
                          Open Enquiry
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-lf-line bg-lf-bg/60 px-5 py-3 text-xs text-lf-muted">
              <span className="tabular-nums">
                {pagination.total} notifications &bull; Page {pagination.page}{' '}
                of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-lf-line bg-white text-lf-navy disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-lf-line bg-white text-lf-navy disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DsaLayout>
  );
}
