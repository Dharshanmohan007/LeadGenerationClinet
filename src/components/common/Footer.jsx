import { Link } from 'react-router-dom';
import { Landmark, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lf-footer text-[#aebdcb]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lf-green text-white">
                <Landmark className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                LoanFlow
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#aebdcb]">
              Connecting personal loan seekers across India with relevant lending
              and distribution partners through a simple, transparent enquiry workflow.
            </p>
          </div>

          {/* Customer Navigation */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-lf-mint">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#about-us" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#benefits" className="hover:text-white transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="font-semibold text-lf-mint hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li className="border-t border-white/10 pt-2">
                <Link
                  to="/dsa/login"
                  className="text-[#aebdcb] hover:text-white transition-colors"
                >
                  DSA Partner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Placeholders */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-lf-mint">
              Contact Information
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-[#aebdcb]">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lf-mint" aria-hidden="true" />
                <span>[Support Email Placeholder — Configure Before Production]</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lf-mint" aria-hidden="true" />
                <span>[Support Phone Placeholder]</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lf-mint" aria-hidden="true" />
                <span>[Registered Office Address Placeholder]</span>
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
              <strong className="font-semibold text-white">Important Disclaimer: </strong>
              LoanFlow is an enquiry and referral platform, not a bank or lending
              institution. Loan eligibility, verification, interest rates and final
              loan approval are determined independently by the relevant lending partner.
            </p>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#8fa2b7] sm:flex-row sm:items-center">
          <p>&copy; {currentYear} LoanFlow. All rights reserved.</p>
          <p>Personal Loan Lead-Generation &amp; Enquiry Platform</p>
        </div>
      </div>
    </footer>
  );
}
