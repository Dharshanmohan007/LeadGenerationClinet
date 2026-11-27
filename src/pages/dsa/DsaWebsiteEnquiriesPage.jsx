import DsaLayout from '../../components/dsa/layout/DsaLayout';
import EnquiryTableModule from '../../components/dsa/enquiries/EnquiryTableModule';
import { ENQUIRY_STATUS_OPTIONS } from '../../config/dsa/enquiryConfig';
import { formatINR } from '../../utils/formatters';

export default function DsaWebsiteEnquiriesPage() {
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
    { key: 'employment', label: 'Employment' },
    {
      key: 'income',
      label: 'Monthly Income',
      sortKey: 'income',
      render: (item) => (
        <span className="tabular-nums font-medium">{formatINR(item.income)}</span>
      ),
    },
    { key: 'company', label: 'Company / Business' },
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
    { key: 'purpose', label: 'Purpose' },
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
      label: 'Submitted Date',
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
      pageTitle="Website Enquiries"
      pageSubtitle="Customer leads submitted through the MUKTIVA personal loan form"
    >
      <EnquiryTableModule
        source="website"
        title="Website Enquiries"
        description="Review, filter, update status, and record follow-up notes on enquiries submitted from the MUKTIVA website."
        emptyTitle="No Website Enquiries Yet"
        emptyDescription="New personal loan enquiries submitted at /apply will appear here automatically."
        columns={columns}
      />
    </DsaLayout>
  );
}
