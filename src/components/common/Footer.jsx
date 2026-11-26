import { Link } from 'react-router-dom';
import { Building2, Clock, Mail, ShieldCheck } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lf-footer text-[#aebdcb]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              aria-label="MUKTIVA — Freedom Begins With Financial Clarity"
              className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lf-green"
            >
              <BrandLogo size="md" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#aebdcb]">
              Connecting personal loan seekers across India with relevant lending
              and distribution partners through a simple, transparent enquiry
              workflow.
            </p>
          </div>

          {/* Customer Navigation */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-lf-mint">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#about-us"
                  className="transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/#how-it-works"
                  className="transition-colors hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/#benefits"
                  className="transition-colors hover:text-white"
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="font-semibold text-lf-mint transition-colors hover:text-white"
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Portals */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-lf-mint">
              Legal &amp; Portals
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="transition-colors hover:text-white"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li className="border-t border-white/10 pt-2">
                <Link
                  to="/dsa/login"
                  className="text-[#aebdcb] transition-colors hover:text-white"
                >
                  DSA Partner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Developer Attribution */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-lf-mint">
              Contact &amp; Developer
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-[#aebdcb]">
              <li className="flex items-start gap-2.5">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-lf-mint"
                  aria-hidden="true"
                />
                <span>
                  <strong className="block text-xs font-semibold text-white">
                    Enquiry Support Desk
                  </strong>
                  <span><a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=hunchmind.contact@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#aebdcb] transition-colors hover:text-lf-mint hover:underline"
                    >
                      hunchmind.contact@gmail.com
                    </a></span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-lf-mint"
                  aria-hidden="true"
                />
                <span>
                  <strong className="block text-xs font-semibold text-white">
                    Support Hours
                  </strong>
                  <span>Mon – Sat, 9:30 AM – 6:30 PM IST</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Building2
                  className="mt-0.5 h-4 w-4 shrink-0 text-lf-mint"
                  aria-hidden="true"
                />
                <span>
                  <strong className="block text-xs font-semibold text-white">
                    Developed by Hunchmind Groups
                  </strong>
                  <span>Digital Engineering &amp; Platform Partner</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Platform Disclaimer */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-lf-navy/80 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-lf-mint"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-[#cfdae5] sm:text-sm">
              <strong className="font-semibold text-white">
                Important Disclaimer:{' '}
              </strong>
              MUKTIVA is an enquiry and referral platform, not a bank or lending
              institution. Loan eligibility, verification, interest rates and
              final loan approval are determined independently by the relevant
              lending partner.
            </p>
          </div>
        </div>

        {/* Copyright & Developer Credit Bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#8fa2b7] sm:flex-row sm:items-center">
          <p>&copy; {currentYear} MUKTIVA. All rights reserved.</p>
          <p>
            Designed &amp; Developed by{' '}
            <span className="font-semibold text-white">Hunchmind Groups</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
