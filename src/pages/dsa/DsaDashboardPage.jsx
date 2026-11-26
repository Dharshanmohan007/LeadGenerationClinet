import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';

export const DSA_NAV_LINKS = [
  { label: 'Dashboard', to: '/dsa/dashboard' },
  { label: 'Enquiries', to: '/dsa/enquiries' },
  { label: 'Profile', to: '/dsa/profile' },
];

export default function DsaDashboardPage() {
  return (
    <PortalLayout
      portalTitle="DSA Portal Navigation"
      roleLabel="DSA Partner"
      navLinks={DSA_NAV_LINKS}
    >
      <PortalPlaceholder
        title="DSA Dashboard"
        description="This protected workspace is reserved for authenticated DSA partners. Real enquiry summaries will appear here once backend DSA APIs are connected."
        plannedFeatures={[
          'Summary of enquiries assigned to this DSA account',
          'Status breakdown across assigned customer leads',
          'Quick navigation to recent assigned enquiries',
        ]}
        backendRequirements={[
          'Protected GET /api/dsa/dashboard metrics scoped strictly to authenticated DSA user ID',
          'Server-side JWT/session cookie authentication with role === "dsa"',
        ]}
      />
    </PortalLayout>
  );
}
