import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import muktivaEmblem from '../../assets/muktiva-emblem.png';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth';

export default function PortalLayout({
  portalTitle,
  roleLabel,
  navLinks = [],
  children,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-lf-bg text-lf-ink">
      <header className="border-b border-lf-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={muktivaEmblem}
                alt="MUKTIVA"
                className="h-9 w-9 rounded-xl object-cover shadow-xs"
              />
              <span className="text-lg font-extrabold tracking-wide text-lf-navy">
                MUKTIVA
              </span>
            </Link>
            <span className="rounded-full bg-lf-green-soft px-2.5 py-0.5 text-xs font-bold text-lf-green-dark ring-1 ring-lf-green-border">
              {roleLabel}
            </span>
          </div>

          <nav aria-label={portalTitle} className="flex flex-wrap items-center gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-[9px] px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-lf-navy text-white'
                      : 'text-lf-muted hover:bg-lf-bg hover:text-lf-navy'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user?.name && (
              <span className="hidden text-sm font-medium text-lf-muted sm:inline">
                {user.name}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
