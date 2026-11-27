import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Ban,
  Bell,
  FileSpreadsheet,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCircle,
  X,
} from 'lucide-react';
import BrandLogo from '../../common/BrandLogo';
import { useAuth } from '../../../hooks/useAuth';
import { useDsaNotifications } from '../../../hooks/dsa/useDsaNotifications';
import NotificationBell from '../notifications/NotificationBell';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/dsa/dashboard', icon: LayoutDashboard },
  { label: 'Website Enquiries', to: '/dsa/enquiries/website', icon: Globe },
  { label: 'CIBIL Enquiries', to: '/dsa/enquiries/cibil', icon: FileSpreadsheet },
  {
    label: 'Bank Rejected',
    to: '/dsa/enquiries/bank-rejected',
    icon: Ban,
  },
  {
    label: 'Notifications',
    to: '/dsa/notifications',
    icon: Bell,
    showUnreadBadge: true,
  },
  { label: 'Profile', to: '/dsa/profile', icon: UserCircle },
];

export default function DsaLayout({
  pageTitle = 'DSA Workspace',
  pageSubtitle = '',
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const notificationsState = useDsaNotifications({ enabled: Boolean(user) });
  const { unreadCount } = notificationsState;

  const initials = (user?.name || 'DSA')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  async function handleLogout() {
    await logout();
    navigate('/dsa/login', { replace: true });
  }

  function renderNavLinks() {
    return (
      <nav aria-label="DSA Sidebar Navigation" className="space-y-1 px-3 py-4">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-lf-green text-white shadow-sm'
                    : 'text-[#d6e0ea] hover:bg-lf-navy-2 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </span>
              {item.showUnreadBadge && unreadCount > 0 && (
                <span className="tabular-nums rounded-full bg-[#b42318] px-2 py-0.5 text-[11px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-lf-bg text-lf-ink">
      {/* Fixed Desktop Sidebar — stays pinned while right pane scrolls */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:justify-between bg-lf-navy text-white">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-white/10 px-4 py-4">
            <Link to="/dsa/dashboard" className="block">
              <BrandLogo size="sm" />
            </Link>
            <span className="mt-2.5 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lf-mint">
              DSA Partner CRM
            </span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {renderNavLinks()}
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lf-green text-xs font-extrabold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user?.name || 'DSA Partner'}
              </p>
              <p className="truncate text-xs text-[#aebdcb]">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/15 cursor-pointer"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-lf-navy/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col justify-between bg-lf-navy text-white shadow-2xl">
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
                <BrandLogo size="sm" />
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  className="rounded-lg p-1.5 text-[#cfdae5] hover:bg-lf-navy-2 hover:text-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {renderNavLinks()}
              </div>
            </div>
            <div className="shrink-0 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area — scrolls independently alongside fixed sidebar */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-lf-line bg-white">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-lf-line bg-white text-lf-navy hover:bg-lf-bg lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-lf-navy sm:text-xl">
                  {pageTitle}
                </h1>
                {pageSubtitle && (
                  <p className="hidden truncate text-xs text-lf-muted sm:block">
                    {pageSubtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell notificationsState={notificationsState} />

              <Link
                to="/dsa/profile"
                className="flex items-center gap-2.5 rounded-xl border border-lf-line bg-white px-2.5 py-1.5 transition-colors hover:bg-lf-bg"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lf-navy text-xs font-extrabold text-white">
                  {initials}
                </span>
                <span className="hidden text-xs font-bold text-lf-navy sm:inline">
                  {user?.name || 'Profile'}
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {typeof children === 'function'
            ? children({ notificationsState })
            : children}
        </main>
      </div>
    </div>
  );
}
