import DsaLayout from '../../components/dsa/layout/DsaLayout';
import EnquiryTableModule from '../../components/dsa/enquiries/EnquiryTableModule';
import { ENQUIRY_STATUS_OPTIONS } from '../../config/dsa/enquiryConfig';
import { formatINR } from '../../utils/formatters';

export default function DsaBankRejectedEnquiriesPage() {
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
    {
      key: 'bankName',
      label: 'Bank Name',
      render: (item) => item.bankName || '—',
    },
    {
      key: 'rejectionReason',
      label: 'Rejection Reason',
      render: (item) => (
        <span className="line-clamp-1 max-w-[200px]" title={item.rejectionReason || ''}>
          {item.rejectionReason || '—'}
        </span>
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
        new Date(item.enquiryDate || item.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
  ];

  return (
    <DsaLayout
      pageTitle="Bank Rejected Enquiries"
      pageSubtitle="Leads referred from bank rejection workflows for alternative partner matching"
    >
      <EnquiryTableModule
        source="bank_rejected"
        title="Bank Rejected Enquiries"
        description="Manage leads redirected after bank rejections. Connected to GET/PATCH /api/dsa/enquiries/bank-rejected and ready for external integration."
        emptyTitle="No Bank Rejected Enquiries Recorded"
        emptyDescription="No bank-rejected enquiry records exist in MongoDB yet. Once your bank-rejection pipeline writes to the BankRejectedEnquiry collection, records will display here."
        columns={columns}
      />
    </DsaLayout>
  );
}
