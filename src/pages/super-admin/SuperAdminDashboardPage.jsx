import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';

export const SUPER_ADMIN_NAV_LINKS = [
  { label: 'Dashboard', to: '/super-admin/dashboard' },
  { label: 'All Enquiries', to: '/super-admin/enquiries' },
  { label: 'DSA / Admins', to: '/super-admin/admins' },
  { label: 'Profile', to: '/super-admin/profile' },
];

export default function SuperAdminDashboardPage() {
  return (
    <PortalLayout
      portalTitle="Super Admin Navigation"
      roleLabel="Super Admin"
      navLinks={SUPER_ADMIN_NAV_LINKS}
    >
      <PortalPlaceholder
        title="Super Admin Dashboard"
        description="Company-wide overview for MUKTIVA administrators. Live metrics and audit logs will populate once backend Super Admin APIs are connected."
        plannedFeatures={[
          'Aggregate personal loan enquiry volume and status breakdown',
          'Active DSA partner account summary',
          'Quick links to enquiry exports and account management',
        ]}
        backendRequirements={[
          'GET /api/super-admin/dashboard protected by role === "super_admin"',
        ]}
      />
    </PortalLayout>
  );
}
