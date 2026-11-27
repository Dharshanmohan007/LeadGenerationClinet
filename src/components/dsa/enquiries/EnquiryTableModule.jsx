import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  Inbox,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { ENQUIRY_STATUS_OPTIONS } from '../../../config/dsa/enquiryConfig';
import {
  listDsaEnquiries,
  updateDsaEnquiry,
} from '../../../services/dsa/dsaService';
import {
  EMPLOYMENT_TYPES,
  LOAN_PURPOSE_OPTIONS,
} from '../../../utils/enquiryValidation';
import { formatINR } from '../../../utils/formatters';
import Button from '../../common/Button';
import EnquiryEditModal from './EnquiryEditModal';
import { EnquiryStatusBadge } from './EnquiryStatusBadge';

/**
 * Reusable enquiry management table module shared across Website Enquiries,
 * CIBIL Enquiries, and Bank Rejected Enquiries while preserving independent
 * URL search, filter, sort, and pagination states per module.
 */
export default function EnquiryTableModule({
  source,
  title,
  description,
  emptyTitle,
  emptyDescription,
  columns,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchDraft, setSearchDraft] = useState(
    searchParams.get('search') || ''
  );
  const [showFilters, setShowFilters] = useState(false);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [busyRowId, setBusyRowId] = useState(null);

  const tableScrollRef = useRef(null);
  const [scrollBounds, setScrollBounds] = useState({ left: false, right: false });

  const syncScrollBounds = useCallback(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    setScrollBounds({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  const queryState = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || 'all',
      employment: searchParams.get('employment') || 'all',
      city: searchParams.get('city') || '',
      purpose: searchParams.get('purpose') || 'all',
      minAmount: searchParams.get('minAmount') || '',
      maxAmount: searchParams.get('maxAmount') || '',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      archived: searchParams.get('archived') || 'false',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
    }),
    [searchParams]
  );

  const updateParams = useCallback(
    (patch, { resetPage = true } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, val]) => {
            if (
              val === '' ||
              val === null ||
              val === undefined ||
              (key === 'status' && val === 'all') ||
              (key === 'employment' && val === 'all') ||
              (key === 'purpose' && val === 'all') ||
              (key === 'archived' && val === 'false')
            ) {
              next.delete(key);
            } else {
              next.set(key, String(val));
            }
          });
          if (resetPage && patch.page === undefined) {
            next.set('page', '1');
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Debounce search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDraft !== queryState.search) {
        updateParams({ search: searchDraft.trim() });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchDraft, queryState.search, updateParams]);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await listDsaEnquiries(source, queryState);
      setData(result);
    } catch (err) {
      setError(err?.message || 'Unable to load enquiry records.');
    } finally {
      setIsLoading(false);
    }
  }, [source, queryState]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSort(field) {
    const nextOrder =
      queryState.sortBy === field && queryState.sortOrder === 'desc'
        ? 'asc'
        : 'desc';
    updateParams({ sortBy: field, sortOrder: nextOrder });
  }

  function clearAllFilters() {
    setSearchDraft('');
    setSearchParams({}, { replace: true });
  }

  useEffect(() => {
    syncScrollBounds();
    window.addEventListener('resize', syncScrollBounds);
    return () => window.removeEventListener('resize', syncScrollBounds);
  }, [data, syncScrollBounds]);

  function scrollColumnsBy(deltaX) {
    tableScrollRef.current?.scrollBy({ left: deltaX, behavior: 'smooth' });
  }

  function handleTableMouseDown(event) {
    if (event.button !== 0) return;
    if (event.target.closest('button, a, select, input, option, textarea, label')) {
      return;
    }
    const container = tableScrollRef.current;
    if (!container) return;

    const startX = event.clientX;
    const startScrollLeft = container.scrollLeft;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      if (Math.abs(dx) > 4) {
        container.scrollLeft = startScrollLeft - dx;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  async function handleArchiveToggle(item) {
    if (busyRowId) return;
    setBusyRowId(item._id);
    try {
      const nextArchived = !item.isArchived;
      await updateDsaEnquiry(
        item._id,
        { isArchived: nextArchived },
        source
      );
      showToast(
        'success',
        nextArchived
          ? `Archived enquiry ${item.referenceId}.`
          : `Restored enquiry ${item.referenceId} from archive.`
      );
      await fetchRecords();
    } catch (err) {
      showToast('error', err?.message || 'Failed to update archive state.');
    } finally {
      setBusyRowId(null);
    }
  }

  async function handleQuickStatusChange(item, nextStatus) {
    if (busyRowId || item.status === nextStatus) return;
    setBusyRowId(item._id);
    try {
      await updateDsaEnquiry(item._id, { status: nextStatus }, source);
      showToast('success', `Updated ${item.referenceId} status.`);
      await fetchRecords();
    } catch (err) {
      showToast('error', err?.message || 'Failed to update status.');
    } finally {
      setBusyRowId(null);
    }
  }

  const activeChips = useMemo(() => {
    const chips = [];
    if (queryState.search)
      chips.push({ key: 'search', label: `Search: "${queryState.search}"` });
    if (queryState.status !== 'all')
      chips.push({ key: 'status', label: `Status: ${queryState.status}` });
    if (queryState.employment !== 'all')
      chips.push({ key: 'employment', label: `Employment: ${queryState.employment}` });
    if (queryState.city)
      chips.push({ key: 'city', label: `City: ${queryState.city}` });
    if (queryState.purpose !== 'all')
      chips.push({ key: 'purpose', label: `Purpose: ${queryState.purpose}` });
    if (queryState.minAmount || queryState.maxAmount)
      chips.push({
        key: 'amountRange',
        label: `Amount: ${queryState.minAmount || '0'} – ${queryState.maxAmount || 'Max'}`,
      });
    if (queryState.dateFrom || queryState.dateTo)
      chips.push({
        key: 'dateRange',
        label: `Date: ${queryState.dateFrom || '...'} to ${queryState.dateTo || '...'}`,
      });
    if (queryState.archived !== 'false')
      chips.push({
        key: 'archived',
        label:
          queryState.archived === 'true' ? 'Showing: Archived' : 'Showing: All',
      });
    return chips;
  }, [queryState]);

  function removeChip(chipKey) {
    if (chipKey === 'search') {
      setSearchDraft('');
      updateParams({ search: '' });
    } else if (chipKey === 'amountRange') {
      updateParams({ minAmount: '', maxAmount: '' });
    } else if (chipKey === 'dateRange') {
      updateParams({ dateFrom: '', dateTo: '' });
    } else if (chipKey === 'archived') {
      updateParams({ archived: 'false' });
    } else {
      updateParams({ [chipKey]: '' });
    }
  }

  const items = data?.items || [];
  const summary = data?.summary || {
    totalActive: 0,
    newCount: 0,
    inProgressCount: 0,
    convertedCount: 0,
    archivedCount: 0,
  };
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="space-y-5">
      {/* Header + Summary Strip */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-lf-navy">{title}</h2>
          <p className="mt-0.5 text-sm text-lf-muted">{description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecords}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          Refresh
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Active Leads', value: summary.totalActive },
          { label: 'New', value: summary.newCount },
          { label: 'In Progress', value: summary.inProgressCount },
          { label: 'Converted', value: summary.convertedCount },
          { label: 'Archived', value: summary.archivedCount },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-lf-line bg-white px-4 py-3 shadow-2xs"
          >
            <p className="text-xs font-medium text-lf-muted">{card.label}</p>
            <p className="tabular-nums mt-1 text-xl font-extrabold text-lf-navy">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            toast.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-[#b42318]'
              : 'border-lf-green-border bg-lf-green-tint text-lf-green-dark'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-lf-line bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lf-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by Reference ID, name, mobile, or city..."
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              className="w-full rounded-[9px] border border-[#d8e0e8] py-2 pl-10 pr-3.5 text-sm text-lf-ink placeholder:text-lf-muted focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by status"
              value={queryState.status}
              onChange={(e) => updateParams({ status: e.target.value })}
              className="rounded-[9px] border border-[#d8e0e8] bg-white px-3 py-2 text-xs font-semibold text-lf-navy focus:border-lf-green focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {ENQUIRY_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              Filters
            </Button>

            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#b42318] hover:underline cursor-pointer px-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filter Panel */}
        {showFilters && (
          <div className="grid gap-3 border-t border-lf-line pt-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                Employment Type
              </label>
              <select
                value={queryState.employment}
                onChange={(e) => updateParams({ employment: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              >
                <option value="all">All</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                City
              </label>
              <input
                type="text"
                placeholder="Filter by city"
                value={queryState.city}
                onChange={(e) => updateParams({ city: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                Loan Purpose
              </label>
              <select
                value={queryState.purpose}
                onChange={(e) => updateParams({ purpose: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              >
                <option value="all">All Purposes</option>
                {LOAN_PURPOSE_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                Archive View
              </label>
              <select
                value={queryState.archived}
                onChange={(e) => updateParams({ archived: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              >
                <option value="false">Active Enquiries</option>
                <option value="true">Archived Only</option>
                <option value="all">All Records</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                Min Loan Amount (₹)
              </label>
              <input
                type="number"
                placeholder="100000"
                value={queryState.minAmount}
                onChange={(e) => updateParams({ minAmount: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                Max Loan Amount (₹)
              </label>
              <input
                type="number"
                placeholder="2000000"
                value={queryState.maxAmount}
                onChange={(e) => updateParams({ maxAmount: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                From Date
              </label>
              <input
                type="date"
                value={queryState.dateFrom}
                onChange={(e) => updateParams({ dateFrom: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-lf-muted">
                To Date
              </label>
              <input
                type="date"
                value={queryState.dateTo}
                onChange={(e) => updateParams({ dateTo: e.target.value })}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-xs text-lf-ink"
              />
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 rounded-full bg-lf-green-soft px-3 py-1 text-xs font-semibold text-lf-green-dark"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={() => removeChip(chip.key)}
                  aria-label={`Remove ${chip.label}`}
                  className="hover:text-lf-navy cursor-pointer"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Data Table Card */}
      <div className="overflow-hidden rounded-2xl border border-lf-line bg-white shadow-2xs">
        {error ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <AlertCircle className="h-10 w-10 text-[#b42318]" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-lf-navy">
              Could not load enquiries
            </p>
            <p className="mt-1 text-xs text-lf-muted">{error}</p>
            <Button size="sm" variant="outline" onClick={fetchRecords} className="mt-4">
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-11 w-full animate-pulse rounded-xl bg-lf-bg"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lf-green-soft text-lf-green">
              <Inbox className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-bold text-lf-navy">
              {activeChips.length > 0 ? 'No matching enquiries' : emptyTitle}
            </h3>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-lf-muted sm:text-sm">
              {activeChips.length > 0
                ? 'Try adjusting or clearing your search and filter criteria.'
                : emptyDescription}
            </p>
            {activeChips.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={clearAllFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {(scrollBounds.left || scrollBounds.right) && (
              <div className="hidden items-center justify-between border-b border-lf-line bg-lf-bg/60 px-4 py-2 text-[11px] text-lf-muted md:flex">
                <span>
                  Customer Name and Actions stay fixed — drag or scroll horizontally for inner columns
                </span>
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollColumnsBy(-260)}
                    disabled={!scrollBounds.left}
                    aria-label="Scroll columns left"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-lf-line bg-white text-lf-navy hover:bg-lf-bg disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollColumnsBy(260)}
                    disabled={!scrollBounds.right}
                    aria-label="Scroll columns right"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-lf-line bg-white text-lf-navy hover:bg-lf-bg disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Table — Customer Name pinned left, Actions pinned right, inner columns scroll with hidden scrollbars */}
            <div
              ref={tableScrollRef}
              onScroll={syncScrollBounds}
              onMouseDown={handleTableMouseDown}
              className="hidden max-h-[60vh] overflow-auto no-scrollbar md:block"
            >
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 z-20 bg-lf-bg text-xs font-bold uppercase tracking-wider text-lf-muted">
                  <tr className="border-b border-lf-line">
                    {columns.map((col, colIndex) => {
                      const isPinnedLeft = colIndex === 0;
                      return (
                        <th
                          key={col.key}
                          className={`px-4 py-3.5 whitespace-nowrap ${
                            isPinnedLeft
                              ? 'sticky left-0 z-30 bg-lf-bg border-r border-lf-line/80 shadow-[2px_0_6px_-2px_rgba(16,37,65,0.08)]'
                              : ''
                          }`}
                        >
                          {col.sortKey ? (
                            <button
                              type="button"
                              onClick={() => handleSort(col.sortKey)}
                              className="inline-flex items-center gap-1 hover:text-lf-navy cursor-pointer"
                            >
                              {col.label}
                              <ArrowDownUp className="h-3 w-3" aria-hidden="true" />
                            </button>
                          ) : (
                            col.label
                          )}
                        </th>
                      );
                    })}
                    <th className="sticky right-0 z-30 bg-lf-bg border-l border-lf-line/80 shadow-[-2px_0_6px_-2px_rgba(16,37,65,0.08)] px-4 py-3.5 text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lf-line">
                  {items.map((item) => (
                    <tr
                      key={item._id}
                      className="group transition-colors hover:bg-[#f4f7fa]"
                    >
                      {columns.map((col, colIndex) => {
                        const isPinnedLeft = colIndex === 0;
                        return (
                          <td
                            key={col.key}
                            className={`px-4 py-3.5 text-xs text-lf-ink whitespace-nowrap ${
                              isPinnedLeft
                                ? 'sticky left-0 z-10 bg-white group-hover:bg-[#f4f7fa] border-r border-lf-line/80 shadow-[2px_0_6px_-2px_rgba(16,37,65,0.08)] transition-colors'
                                : ''
                            }`}
                          >
                            {col.render ? col.render(item, handleQuickStatusChange) : item[col.key] || '—'}
                          </td>
                        );
                      })}
                      <td className="sticky right-0 z-10 bg-white group-hover:bg-[#f4f7fa] border-l border-lf-line/80 shadow-[-2px_0_6px_-2px_rgba(16,37,65,0.08)] px-4 py-3.5 text-right whitespace-nowrap transition-colors">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Link
                            to={`/dsa/enquiries/${item._id}?source=${source}`}
                            title="View details"
                            className="inline-flex items-center gap-1 rounded-lg border border-lf-line bg-white px-2.5 py-1.5 text-xs font-bold text-lf-navy hover:bg-lf-bg"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            title="Edit enquiry"
                            className="inline-flex items-center gap-1 rounded-lg border border-lf-line bg-white px-2.5 py-1.5 text-xs font-bold text-lf-navy hover:bg-lf-bg cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleArchiveToggle(item)}
                            disabled={busyRowId === item._id}
                            title={item.isArchived ? 'Restore enquiry' : 'Archive enquiry'}
                            className="inline-flex items-center rounded-lg border border-lf-line bg-white p-1.5 text-lf-muted hover:bg-lf-bg hover:text-lf-navy cursor-pointer disabled:opacity-50"
                          >
                            {item.isArchived ? (
                              <ArchiveRestore className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="divide-y divide-lf-line md:hidden">
              {items.map((item) => (
                <div key={item._id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="tabular-nums text-xs font-extrabold text-lf-navy">
                        {item.referenceId}
                      </p>
                      <p className="text-sm font-bold text-lf-ink">{item.name}</p>
                      <p className="text-xs text-lf-muted">
                        {item.mobile} &bull; {item.city || '—'}
                      </p>
                    </div>
                    <EnquiryStatusBadge status={item.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-lf-muted">
                    <span>
                      Amount:{' '}
                      <strong className="tabular-nums text-lf-navy">
                        {formatINR(item.amount)}
                      </strong>
                    </span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/dsa/enquiries/${item._id}?source=${source}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-lf-line bg-lf-bg py-2 text-xs font-bold text-lf-navy"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-lf-line bg-white py-2 text-xs font-bold text-lf-navy"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArchiveToggle(item)}
                      className="inline-flex items-center justify-center rounded-lg border border-lf-line bg-white px-3 py-2 text-lf-muted"
                    >
                      {item.isArchived ? (
                        <ArchiveRestore className="h-4 w-4" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-lf-line bg-lf-bg/60 px-4 py-3 sm:flex-row">
              <div className="flex items-center gap-2 text-xs text-lf-muted">
                <span>Rows per page:</span>
                <select
                  aria-label="Rows per page"
                  value={queryState.limit}
                  onChange={(e) => updateParams({ limit: Number(e.target.value) })}
                  className="rounded-lg border border-[#d8e0e8] bg-white px-2 py-1 text-xs font-semibold text-lf-navy"
                >
                  {[10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="tabular-nums">
                  &bull; {pagination.total} total
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="tabular-nums text-xs font-medium text-lf-muted">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    updateParams(
                      { page: pagination.page - 1 },
                      { resetPage: false }
                    )
                  }
                  aria-label="Previous page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-lf-line bg-white text-lf-navy hover:bg-lf-bg disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    updateParams(
                      { page: pagination.page + 1 },
                      { resetPage: false }
                    )
                  }
                  aria-label="Next page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-lf-line bg-white text-lf-navy hover:bg-lf-bg disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EnquiryEditModal
          enquiry={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={async (payload) => {
            await updateDsaEnquiry(editingItem._id, payload, source);
            showToast('success', `Saved changes to ${editingItem.referenceId}.`);
            await fetchRecords();
          }}
        />
      )}
    </div>
  );
}
