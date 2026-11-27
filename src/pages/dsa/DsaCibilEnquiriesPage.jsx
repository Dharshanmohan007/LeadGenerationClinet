import DsaLayout from '../../components/dsa/layout/DsaLayout';
import EnquiryTableModule from '../../components/dsa/enquiries/EnquiryTableModule';
import { ENQUIRY_STATUS_OPTIONS } from '../../config/dsa/enquiryConfig';
import { formatINR } from '../../utils/formatters';

export default function DsaCibilEnquiriesPage() {
  const columns = [
    {
      key: 'name',
      label: 'Customer Name',
      sortKey: 'name',
      render: (item) => (
        <span className="block min-w-[140px] font-semibold text-lf-ink">
          {item.name}
        </span>
      ),
    },
    {
      key: 'referenceId',
      label: 'Reference ID',
      render: (item) => (
        <span className="tabular-nums font-bold text-lf-navy">
          {item.referenceId}
        </span>
      ),
    },
    {
      key: 'mobile',
      label: 'Mobile',
      render: (item) => <span className="tabular-nums">{item.mobile}</span>,
    },
    { key: 'city', label: 'City' },
    {
      key: 'cibilScore',
      label: 'CIBIL Score',
      render: (item) =>
        item.cibilScore !== null && item.cibilScore !== undefined ? (
          <span className="tabular-nums font-bold text-lf-navy">
            {item.cibilScore}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'amount',
      label: 'Loan Amount',
      sortKey: 'amount',
      render: (item) => (
        <span className="tabular-nums font-bold text-lf-navy">
          {formatINR(item.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortKey: 'status',
      render: (item, onQuickStatusChange) => (
        <select
          aria-label={`Update status for ${item.referenceId}`}
          value={item.status}
          onChange={(e) => onQuickStatusChange(item, e.target.value)}
          className="rounded-lg border border-lf-line bg-white px-2 py-1 text-xs font-bold text-lf-navy focus:border-lf-green focus:outline-none cursor-pointer"
        >
          {ENQUIRY_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'createdAt',
      label: 'Enquiry Date',
      sortKey: 'createdAt',
      render: (item) =>
        new Date(item.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
  ];

  return (
    <DsaLayout
      pageTitle="CIBIL Enquiries"
      pageSubtitle="Dedicated management workspace for CIBIL-sourced loan enquiries"
    >
      <EnquiryTableModule
        source="cibil"
        title="CIBIL Enquiries"
        description="Manage CIBIL-sourced personal loan leads. This module is connected to GET/PATCH /api/dsa/enquiries/cibil and awaits external CIBIL ingestion."
        emptyTitle="No CIBIL Enquiries Recorded"
        emptyDescription="No CIBIL enquiry records exist in MongoDB yet. Once your CIBIL enquiry ingestion pipeline writes to the CibilEnquiry collection, records will appear here automatically."
        columns={columns}
      />
    </DsaLayout>
  );
}
