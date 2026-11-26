import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Landmark, Menu, X, ArrowRight } from 'lucide-react';
import Button from './Button';

const NAV_ITEMS = [
  { label: 'Home', path: '/', sectionId: 'home' },
  { label: 'About Us', path: '/', sectionId: 'about-us' },
  { label: 'How It Works', path: '/', sectionId: 'how-it-works' },
  { label: 'Benefits', path: '/', sectionId: 'benefits' },
  { label: 'FAQ', path: '/', sectionId: 'faq' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleNavClick(event, item) {
    setMobileMenuOpen(false);

    if (item.sectionId === 'home' && location.pathname === '/') {
      event.preventDefault();
      if (location.hash) {
        navigate('/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname === '/' && item.sectionId) {
      event.preventDefault();
      const targetEl = document.getElementById(item.sectionId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (item.sectionId && item.sectionId !== 'home') {
      event.preventDefault();
      navigate(`/#${item.sectionId}`);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-lf-navy text-white">
      <nav
        aria-label="Primary Navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lf-green"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lf-green text-white shadow-xs">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white leading-none">
              LoanFlow
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#b9c9d9] leading-none">
              Personal Loan Enquiries
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.sectionId === 'home' ? '/' : `/#${item.sectionId}`}
              onClick={(event) => handleNavClick(event, item)}
              className="text-sm font-medium text-[#d6e0ea] transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Primary CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button to="/apply" size="md">
            Apply Now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[9px] border border-[#71849a] bg-transparent text-white hover:bg-lf-navy-2 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-white/10 bg-lf-navy px-4 pb-5 pt-3 shadow-lg lg:hidden"
        >
          <div className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.sectionId === 'home' ? '/' : `/#${item.sectionId}`}
                onClick={(event) => handleNavClick(event, item)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#d6e0ea] hover:bg-lf-navy-2 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <Button
              to="/apply"
              fullWidth
              size="md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apply Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
