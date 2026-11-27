import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  RefreshCw,
  Send,
  Unlink,
} from 'lucide-react';
import Button from './Button';
import {
  disconnectTelegram,
  getTelegramStatus,
  requestTelegramLink,
  updateTelegramNotifications,
} from '../../services/telegramService';

/**
 * Reusable Telegram Notification Settings section for authenticated
 * DSA Partner and Super Admin profile pages.
 */
export default function TelegramNotificationSettings() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [linkingInfo, setLinkingInfo] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadStatus = useCallback(async ({ showSuccessOnConnect = false } = {}) => {
    setErrorMessage('');
    try {
      const data = await getTelegramStatus();
      setStatus(data);

      if (data?.isConnected) {
        setLinkingInfo(null);
        if (showSuccessOnConnect) {
          setNoticeMessage('Telegram connected successfully.');
        }
      }
    } catch (error) {
      setErrorMessage(
        error?.message || 'Unable to load Telegram notification status.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handleConnectTelegram() {
    if (isActionLoading) return;
    setErrorMessage('');
    setNoticeMessage('');
    setIsActionLoading(true);

    try {
      const linkData = await requestTelegramLink();
      setLinkingInfo(linkData);
    } catch (error) {
      setErrorMessage(
        error?.message || 'Could not generate a Telegram linking URL.'
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleRefreshAfterStart() {
    if (isActionLoading) return;
    setIsActionLoading(true);
    await loadStatus({ showSuccessOnConnect: true });
    setIsActionLoading(false);
  }

  async function handleToggleNotifications() {
    if (isActionLoading || !status?.isConnected) return;
    setErrorMessage('');
    setNoticeMessage('');
    setIsActionLoading(true);

    try {
      const nextEnabled = !status.notificationsEnabled;
      const updated = await updateTelegramNotifications(nextEnabled);
      setStatus((prev) => ({
        ...prev,
        ...updated,
      }));
      setNoticeMessage(
        updated.notificationsEnabled
          ? 'Telegram lead notifications enabled.'
          : 'Telegram lead notifications paused.'
      );
    } catch (error) {
      setErrorMessage(
        error?.message || 'Unable to update Telegram notification preference.'
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleDisconnect() {
    if (isActionLoading) return;
    setErrorMessage('');
    setNoticeMessage('');
    setIsActionLoading(true);

    try {
      const updated = await disconnectTelegram();
      setStatus((prev) => ({
        ...prev,
        ...updated,
        isConnected: false,
      }));
      setLinkingInfo(null);
      setNoticeMessage(
        'Telegram disconnected. You can reconnect your account anytime.'
      );
    } catch (error) {
      setErrorMessage(
        error?.message || 'Unable to disconnect your Telegram account.'
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleCopyLink() {
    if (!linkingInfo?.linkingUrl || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(linkingInfo.linkingUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard may be restricted by browser; link remains visible to copy manually
    }
  }

  const isConnected = Boolean(status?.isConnected);
  const notificationsEnabled = Boolean(status?.notificationsEnabled);

  return (
    <section
      aria-labelledby="telegram-settings-heading"
      className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-lf-line pb-5">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lf-green-soft text-lf-green">
            <Send className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="telegram-settings-heading"
              className="text-lg font-bold text-lf-navy sm:text-xl"
            >
              Telegram Notifications
            </h2>
            <p className="mt-1 text-sm text-lf-muted">
              Receive private real-time alerts on Telegram whenever a new
              customer enquiry is submitted.
            </p>
          </div>
        </div>

        {!isLoading && status && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isConnected
                ? 'bg-lf-green-soft text-lf-green-dark ring-1 ring-lf-green-border'
                : 'bg-lf-bg text-lf-muted ring-1 ring-lf-line'
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-lf-green" aria-hidden="true" />
                Telegram connected
              </>
            ) : (
              'Telegram not connected'
            )}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-3 py-8 text-sm text-lf-muted">
          <Loader2 className="h-5 w-5 animate-spin text-lf-green" aria-hidden="true" />
          <span>Checking Telegram connection status...</span>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-[#b42318]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success / Status Notice */}
      {noticeMessage && (
        <div
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-lf-green-border bg-lf-green-tint px-4 py-3 text-sm font-medium text-lf-green-dark"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lf-green" aria-hidden="true" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Connected State */}
      {!isLoading && isConnected && (
        <div className="mt-6 space-y-5">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-lf-line bg-lf-bg p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lf-navy ring-1 ring-lf-line">
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5 text-lf-green" aria-hidden="true" />
                ) : (
                  <BellOff className="h-5 w-5 text-lf-muted" aria-hidden="true" />
                )}
              </span>
              <div>
                <p className="text-sm font-bold text-lf-navy">
                  Lead Alert Notifications:{' '}
                  <span
                    className={
                      notificationsEnabled ? 'text-lf-green-dark' : 'text-lf-muted'
                    }
                  >
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-lf-muted">
                  {notificationsEnabled
                    ? 'You will receive a private Telegram message containing the enquiry Reference ID and dashboard link for each new lead.'
                    : 'Notifications are currently paused. Enable them below to resume receiving new lead alerts.'}
                </p>
                {status.linkedAt && (
                  <p className="mt-1.5 text-[11px] text-lf-muted">
                    Connected on{' '}
                    {new Date(status.linkedAt).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant={notificationsEnabled ? 'outline' : 'primary'}
                size="sm"
                onClick={handleToggleNotifications}
                isLoading={isActionLoading}
                disabled={isActionLoading}
              >
                {notificationsEnabled ? (
                  <>
                    <BellOff className="h-4 w-4" aria-hidden="true" />
                    Disable Notifications
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    Enable Notifications
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                disabled={isActionLoading}
                className="text-[#b42318] hover:bg-rose-50"
              >
                <Unlink className="h-4 w-4" aria-hidden="true" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Not Connected / Connecting States */}
      {!isLoading && !isConnected && (
        <div className="mt-6 space-y-5">
          {!linkingInfo ? (
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-lf-line bg-lf-bg p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-bold text-lf-navy">
                  Telegram not connected
                </p>
                <p className="mt-1 text-xs leading-relaxed text-lf-muted sm:text-sm">
                  Generate a secure, single-use linking URL and press{' '}
                  <strong>Start</strong> in Telegram to receive instant lead
                  notifications.
                </p>
              </div>
              <Button
                onClick={handleConnectTelegram}
                isLoading={isActionLoading}
                disabled={isActionLoading}
                className="shrink-0"
              >
                <Link2 className="h-4 w-4" aria-hidden="true" />
                Connect Telegram
              </Button>
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border border-lf-green-border bg-lf-green-tint p-5">
              <div>
                <p className="text-sm font-bold text-lf-navy">
                  Step 1: Open Telegram and press Start
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#40536a]">
                  This private deep link expires in 10 minutes and can only be
                  used once for your admin account.
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-lg border border-lf-line bg-white px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <code className="break-all text-xs font-medium text-lf-navy">
                  {linkingInfo.linkingUrl}
                </code>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-lf-line bg-lf-bg px-2.5 py-1 text-xs font-bold text-lf-navy hover:bg-white cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-lf-green" aria-hidden="true" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={linkingInfo.linkingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-lf-green px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(21,155,119,0.22)] transition-all hover:brightness-95"
                >
                  Open Telegram
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>

                <Button
                  variant="outline"
                  size="md"
                  onClick={handleRefreshAfterStart}
                  isLoading={isActionLoading}
                  disabled={isActionLoading}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  I&apos;ve Pressed Start — Refresh Status
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
