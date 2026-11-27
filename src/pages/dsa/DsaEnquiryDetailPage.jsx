import { useCallback, useEffect, useState } from 'react';
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Clock,
  Edit3,
  MessageSquarePlus,
} from 'lucide-react';
import Button from '../../components/common/Button';
import EnquiryEditModal from '../../components/dsa/enquiries/EnquiryEditModal';
import {
  EnquirySourceBadge,
  EnquiryStatusBadge,
} from '../../components/dsa/enquiries/EnquiryStatusBadge';
import DsaLayout from '../../components/dsa/layout/DsaLayout';
import {
  ENQUIRY_SOURCE_META,
  ENQUIRY_STATUS_OPTIONS,
  formatDateTime,
} from '../../config/dsa/enquiryConfig';
import {
  getDsaEnquiryDetail,
  updateDsaEnquiry,
} from '../../services/dsa/dsaService';
import { formatINR } from '../../utils/formatters';

export default function DsaEnquiryDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sourceHint = searchParams.get('source') || '';

  const [enquiry, setEnquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusDraft, setStatusDraft] = useState('new');
  const [noteDraft, setNoteDraft] = useState('');
  const [isSavingAction, setIsSavingAction] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const record = await getDsaEnquiryDetail(id, sourceHint);
      setEnquiry(record);
      setStatusDraft(record.status || 'new');
    } catch (err) {
      setError(err?.message || 'Unable to load enquiry details.');
    } finally {
      setIsLoading(false);
    }
  }, [id, sourceHint]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  function handleBackToEnquiries() {
    if (window.history.length > 2) {
      navigate(-1);
      return;
    }
    const meta =
      ENQUIRY_SOURCE_META[enquiry?.source || sourceHint] ||
      ENQUIRY_SOURCE_META.website;
    navigate(meta.route);
  }

  async function handleStatusAndNoteSubmit(event) {
    event.preventDefault();
    if (isSavingAction || !enquiry) return;

    const payload = {};
    if (statusDraft && statusDraft !== enquiry.status) {
      payload.status = statusDraft;
    }
    if (noteDraft.trim()) {
      payload.note = noteDraft.trim();
    }

    if (Object.keys(payload).length === 0) {
      setFeedback({
        type: 'error',
        message: 'Select a new status or enter a follow-up note to save.',
      });
      return;
    }

    setIsSavingAction(true);
    setFeedback(null);
    try {
      const res = await updateDsaEnquiry(
        enquiry._id,
        payload,
        enquiry.source
      );
      setEnquiry(res.enquiry);
      setNoteDraft('');
      setFeedback({
        type: 'success',
        message: res.message || 'Enquiry updated.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Unable to update enquiry.',
      });
    } finally {
      setIsSavingAction(false);
    }
  }

  async function handleArchiveToggle() {
    if (isSavingAction || !enquiry) return;
    setIsSavingAction(true);
    setFeedback(null);
    try {
      const res = await updateDsaEnquiry(
        enquiry._id,
        { isArchived: !enquiry.isArchived },
        enquiry.source
      );
      setEnquiry(res.enquiry);
      setFeedback({
        type: 'success',
        message: res.enquiry.isArchived
          ? 'Enquiry archived.'
          : 'Enquiry restored from archive.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Unable to change archive status.',
      });
    } finally {
      setIsSavingAction(false);
    }
  }

  return (
    <DsaLayout
      pageTitle={enquiry ? `Enquiry ${enquiry.referenceId}` : 'Enquiry Details'}
      pageSubtitle="Complete customer requirement, status controls, and activity history"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToEnquiries}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Enquiries
          </Button>

          {enquiry && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditModal(true)}
              >
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                Edit Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleArchiveToggle}
                disabled={isSavingAction}
              >
                {enquiry.isArchived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" aria-hidden="true" />
                    Archive
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-10 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-[#b42318]" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-lf-navy">{error}</p>
            <Button size="sm" variant="outline" onClick={loadDetail} className="mt-4">
              Retry
            </Button>
          </div>
        ) : isLoading || !enquiry ? (
          <div className="space-y-4">
            <div className="h-36 animate-pulse rounded-2xl border border-lf-line bg-white" />
            <div className="h-60 animate-pulse rounded-2xl border border-lf-line bg-white" />
          </div>
        ) : (
          <>
            {feedback && (
              <div
                role="status"
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  feedback.type === 'error'
                    ? 'border-rose-200 bg-rose-50 text-[#b42318]'
                    : 'border-lf-green-border bg-lf-green-tint text-lf-green-dark'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Top Info Strip */}
            <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="tabular-nums text-xl font-extrabold text-lf-navy">
                      {enquiry.referenceId}
                    </h2>
                    <EnquirySourceBadge source={enquiry.source} />
                    <EnquiryStatusBadge status={enquiry.status} />
                    {enquiry.isArchived && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-lf-muted">
                    Created: {formatDateTime(enquiry.createdAt)} &bull; Last
                    Updated: {formatDateTime(enquiry.updatedAt)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-medium text-lf-muted">
                    Requested Loan Amount
                  </p>
                  <p className="tabular-nums text-2xl font-extrabold text-lf-navy">
                    {formatINR(enquiry.amount)}
                  </p>
                </div>
              </div>
            </section>

            {/* Customer + Loan Details Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs">
                <h3 className="border-b border-lf-line pb-3 text-sm font-bold uppercase tracking-wider text-lf-navy">
                  Customer Information
                </h3>
                <dl className="mt-4 divide-y divide-lf-line text-sm">
                  {[
                    ['Customer Name', enquiry.name],
                    ['Mobile Number', enquiry.mobile],
                    ['City', enquiry.city || '—'],
                    ['Employment Type', enquiry.employment || '—'],
                    ['Company / Business', enquiry.company || '—'],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <dt className="text-lf-muted">{label}</dt>
                      <dd className="text-right font-bold text-lf-navy">{val}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs">
                <h3 className="border-b border-lf-line pb-3 text-sm font-bold uppercase tracking-wider text-lf-navy">
                  Loan Requirement
                </h3>
                <dl className="mt-4 divide-y divide-lf-line text-sm">
                  {[
                    ['Loan Amount', formatINR(enquiry.amount)],
                    ['Monthly Income', formatINR(enquiry.income)],
                    ['Existing EMI', formatINR(enquiry.emi)],
                    ['Loan Purpose', enquiry.purpose || '—'],
                    ['Work Experience', enquiry.experience || '—'],
                    ...(enquiry.cibilScore
                      ? [['CIBIL Score', enquiry.cibilScore]]
                      : []),
                    ...(enquiry.bankName
                      ? [['Bank Name', enquiry.bankName]]
                      : []),
                    ...(enquiry.rejectionReason
                      ? [['Rejection Reason', enquiry.rejectionReason]]
                      : []),
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <dt className="text-lf-muted">{label}</dt>
                      <dd className="tabular-nums text-right font-bold text-lf-navy">
                        {val}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            {/* Update Status + Add Follow-up Note & Activity Log */}
            <div className="grid gap-6 lg:grid-cols-12">
              <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs lg:col-span-5">
                <h3 className="flex items-center gap-2 text-base font-bold text-lf-navy">
                  <MessageSquarePlus className="h-4 w-4 text-lf-green" aria-hidden="true" />
                  Update Status &amp; Add Note
                </h3>
                <form
                  onSubmit={handleStatusAndNoteSubmit}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="detail-status"
                      className="block text-xs font-bold text-[#34475d]"
                    >
                      Enquiry Status
                    </label>
                    <select
                      id="detail-status"
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                      className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                    >
                      {ENQUIRY_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="detail-note"
                      className="block text-xs font-bold text-[#34475d]"
                    >
                      Follow-up Note
                    </label>
                    <textarea
                      id="detail-note"
                      rows={4}
                      placeholder="Add call summary, eligibility notes, or follow-up reminder..."
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isSavingAction}
                    disabled={isSavingAction}
                  >
                    {isSavingAction ? 'Saving Update...' : 'Save Status & Note'}
                  </Button>
                </form>
              </section>

              <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs lg:col-span-7">
                <h3 className="flex items-center gap-2 text-base font-bold text-lf-navy">
                  <Clock className="h-4 w-4 text-lf-green" aria-hidden="true" />
                  Activity &amp; Follow-up History
                </h3>

                <div className="mt-4 space-y-4">
                  {(!enquiry.notes || enquiry.notes.length === 0) &&
                  (!enquiry.statusHistory ||
                    enquiry.statusHistory.length === 0) ? (
                    <p className="rounded-xl border border-lf-line bg-lf-bg px-4 py-6 text-center text-xs text-lf-muted">
                      No follow-up notes or status changes recorded yet.
                    </p>
                  ) : (
                    <>
                      {enquiry.statusHistory?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-lf-muted">
                            Status Changes
                          </p>
                          {[...enquiry.statusHistory]
                            .reverse()
                            .map((entry, idx) => (
                              <div
                                key={entry._id || idx}
                                className="rounded-xl border border-lf-line bg-lf-bg/60 px-4 py-3 text-xs"
                              >
                                <p className="font-bold text-lf-navy">
                                  {entry.fromStatus || '—'} &rarr;{' '}
                                  {entry.toStatus}
                                </p>
                                <p className="mt-0.5 text-lf-muted">
                                  By {entry.changedByName || 'DSA'} &bull;{' '}
                                  {formatDateTime(entry.changedAt)}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}

                      {enquiry.notes?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-lf-muted">
                            Follow-up Notes
                          </p>
                          {[...enquiry.notes].reverse().map((note, idx) => (
                            <div
                              key={note._id || idx}
                              className="rounded-xl border border-lf-green-border bg-lf-green-tint/70 px-4 py-3 text-xs"
                            >
                              <p className="text-sm text-lf-ink">{note.text}</p>
                              <p className="mt-1.5 text-lf-muted">
                                {note.authorName || 'DSA'} &bull;{' '}
                                {formatDateTime(note.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>

      {showEditModal && enquiry && (
        <EnquiryEditModal
          enquiry={enquiry}
          onClose={() => setShowEditModal(false)}
          onSave={async (payload) => {
            const res = await updateDsaEnquiry(
              enquiry._id,
              payload,
              enquiry.source
            );
            setEnquiry(res.enquiry);
            setStatusDraft(res.enquiry.status);
            setFeedback({
              type: 'success',
              message: res.message || 'Enquiry updated successfully.',
            });
          }}
        />
      )}
    </DsaLayout>
  );
}
