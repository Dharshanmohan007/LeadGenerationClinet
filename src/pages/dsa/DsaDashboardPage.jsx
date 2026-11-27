import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Globe,
  Layers,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/common/Button';
import DsaDashboardCharts from '../../components/dsa/dashboard/DsaDashboardCharts';
import {
  EnquirySourceBadge,
  EnquiryStatusBadge,
} from '../../components/dsa/enquiries/EnquiryStatusBadge';
import DsaLayout from '../../components/dsa/layout/DsaLayout';
import { useAuth } from '../../hooks/useAuth';
import {
  getDsaDashboardStats,
  getRecentDsaEnquiries,
} from '../../services/dsa/dsaService';
import { formatINR } from '../../utils/formatters';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DsaDashboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('daily');
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (selectedPeriod = period) => {
    setIsLoading(true);
    setError('');
    try {
      const [statsRes, recentRes] = await Promise.all([
        getDsaDashboardStats(selectedPeriod),
        getRecentDsaEnquiries(8),
      ]);
      setStats(statsRes);
      setRecentEnquiries(recentRes);
    } catch (err) {
      setError(err?.message || 'Unable to load DSA dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadDashboard(period);
  }, [loadDashboard, period]);

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const kpis = stats?.kpis || {
    totalEnquiries: 0,
    websiteEnquiries: 0,
    cibilEnquiries: 0,
    bankRejectedEnquiries: 0,
    newEnquiries: 0,
    convertedEnquiries: 0,
  };

  const kpiCards = [
    {
      label: 'Total Enquiries',
      value: kpis.totalEnquiries,
      icon: Layers,
      to: '/dsa/enquiries/website',
    },
    {
      label: 'Website Enquiries',
      value: kpis.websiteEnquiries,
      icon: Globe,
      to: '/dsa/enquiries/website',
    },
    {
      label: 'CIBIL Enquiries',
      value: kpis.cibilEnquiries,
      icon: FileSpreadsheet,
      to: '/dsa/enquiries/cibil',
    },
    {
      label: 'Bank Rejected Enquiries',
      value: kpis.bankRejectedEnquiries,
      icon: Ban,
      to: '/dsa/enquiries/bank-rejected',
    },
    {
      label: 'New Enquiries',
      value: kpis.newEnquiries,
      icon: Sparkles,
      to: '/dsa/enquiries/website?status=new',
    },
    {
      label: 'Converted Enquiries',
      value: kpis.convertedEnquiries,
      icon: CheckCircle2,
      to: '/dsa/enquiries/website?status=converted',
    },
  ];

  return (
    <DsaLayout
      pageTitle="DSA Dashboard"
      pageSubtitle="Overview of enquiries, trends, and recent customer leads"
    >
      <div className="min-w-0 space-y-5 sm:space-y-6">
        {/* Welcome Banner */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-lf-line bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-lf-green">
              {todayFormatted}
            </p>
            <h2 className="mt-1 text-xl font-bold text-lf-navy sm:text-2xl">
              {getTimeGreeting()}, {user?.name || 'DSA Partner'}
            </h2>
            <p className="mt-1 text-xs text-lf-muted sm:text-sm">
              Here&apos;s an overview of your enquiry activity and lead
              management.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDashboard(period)}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
            <Button to="/dsa/enquiries/website" size="sm">
              View Website Enquiries
            </Button>
          </div>
        </section>

        {error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-white p-8 text-center sm:p-10">
            <AlertCircle className="h-10 w-10 text-[#b42318]" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-lf-navy">
              Unable to load dashboard metrics
            </p>
            <p className="mt-1 text-xs text-lf-muted">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDashboard(period)}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : isLoading && !stats ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-24 animate-pulse rounded-2xl border border-lf-line bg-white sm:h-28"
              />
            ))}
          </div>
        ) : (
          <>
            {/* 6 KPI Cards */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {kpiCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    to={card.to}
                    className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-lf-line bg-white p-4 shadow-2xs transition-all hover:border-lf-green/50 hover:shadow-md sm:p-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-lf-muted">
                        {card.label}
                      </p>
                      <p className="tabular-nums mt-1.5 text-2xl font-extrabold text-lf-navy sm:mt-2 sm:text-3xl">
                        {card.value}
                      </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lf-green-soft text-lf-green transition-colors group-hover:bg-lf-green group-hover:text-white sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </section>

            {/* Analytics Charts */}
            <DsaDashboardCharts
              sourceDistribution={stats?.sourceDistribution || []}
              statusOverview={stats?.statusOverview || []}
              trend={stats?.trend || []}
              period={period}
              onPeriodChange={setPeriod}
            />

            {/* Recent Enquiries */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-lf-line bg-white shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lf-line px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-lf-navy">
                    Recent Enquiries
                  </h2>
                  <p className="mt-0.5 text-xs text-lf-muted">
                    Latest enquiries across Website, CIBIL, and Bank Rejected
                    channels.
                  </p>
                </div>
                <Link
                  to="/dsa/enquiries/website"
                  className="shrink-0 whitespace-nowrap text-xs font-bold text-lf-green hover:underline"
                >
                  Open Enquiries
                </Link>
              </div>

              {recentEnquiries.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-lf-muted">
                  No enquiries recorded yet.
                </p>
              ) : (
                <>
                  {/* Mobile Recent Enquiry Cards */}
                  <div className="divide-y divide-lf-line md:hidden">
                    {recentEnquiries.map((item) => (
                      <div
                        key={`${item.source}-${item._id}-mobile`}
                        className="space-y-2.5 p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-lf-ink">
                              {item.name}
                            </p>
                            <p className="tabular-nums text-xs font-semibold text-lf-navy">
                              {item.referenceId}
                            </p>
                          </div>
                          <EnquiryStatusBadge status={item.status} />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-lf-muted">
                          <div className="flex flex-wrap items-center gap-2">
                            <EnquirySourceBadge source={item.source} />
                            <span className="tabular-nums">{item.mobile}</span>
                          </div>
                          <span className="tabular-nums font-bold text-lf-navy">
                            {formatINR(item.amount)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-lf-muted">
                            {new Date(item.createdAt).toLocaleDateString('en-IN')}
                          </span>
                          <Link
                            to={`/dsa/enquiries/${item._id}?source=${item.source}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-lf-line bg-lf-bg px-3 py-1.5 text-xs font-bold text-lf-navy hover:bg-lf-line/40"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tablet & Desktop Recent Enquiries Table (Customer Name & Action pinned) */}
                  <div className="hidden overflow-x-auto no-scrollbar md:block">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-lf-bg text-xs font-bold uppercase tracking-wider text-lf-muted">
                        <tr className="border-b border-lf-line">
                          <th className="sticky left-0 z-20 border-r border-lf-line/80 bg-lf-bg px-4 py-3 whitespace-nowrap">
                            Customer Name
                          </th>
                          <th className="px-4 py-3 whitespace-nowrap">Reference ID</th>
                          <th className="px-4 py-3 whitespace-nowrap">Source</th>
                          <th className="px-4 py-3 whitespace-nowrap">Mobile</th>
                          <th className="px-4 py-3 whitespace-nowrap">Loan Amount</th>
                          <th className="px-4 py-3 whitespace-nowrap">Status</th>
                          <th className="px-4 py-3 whitespace-nowrap">Submitted Date</th>
                          <th className="sticky right-0 z-20 border-l border-lf-line/80 bg-lf-bg px-4 py-3 text-right whitespace-nowrap">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-lf-line text-xs">
                        {recentEnquiries.map((item) => (
                          <tr
                            key={`${item.source}-${item._id}`}
                            className="group transition-colors hover:bg-[#f4f7fa]"
                          >
                            <td className="sticky left-0 z-10 border-r border-lf-line/80 bg-white px-4 py-3 font-semibold text-lf-ink whitespace-nowrap group-hover:bg-[#f4f7fa]">
                              {item.name}
                            </td>
                            <td className="tabular-nums px-4 py-3 font-bold text-lf-navy whitespace-nowrap">
                              {item.referenceId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <EnquirySourceBadge source={item.source} />
                            </td>
                            <td className="tabular-nums px-4 py-3 text-lf-muted whitespace-nowrap">
                              {item.mobile}
                            </td>
                            <td className="tabular-nums px-4 py-3 font-bold text-lf-navy whitespace-nowrap">
                              {formatINR(item.amount)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <EnquiryStatusBadge status={item.status} />
                            </td>
                            <td className="px-4 py-3 text-lf-muted whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className="sticky right-0 z-10 border-l border-lf-line/80 bg-white px-4 py-3 text-right whitespace-nowrap group-hover:bg-[#f4f7fa]">
                              <Link
                                to={`/dsa/enquiries/${item._id}?source=${item.source}`}
                                className="inline-flex items-center gap-1 rounded-lg border border-lf-line bg-white px-2.5 py-1.5 font-bold text-lf-navy hover:bg-lf-bg"
                              >
                                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          </>
        )}
      </div>
    </DsaLayout>
  );
}
