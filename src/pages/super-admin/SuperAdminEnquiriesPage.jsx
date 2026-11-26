import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';
import { SUPER_ADMIN_NAV_LINKS } from './SuperAdminDashboardPage';

export default function SuperAdminEnquiriesPage() {
  return (
    <PortalLayout
      portalTitle="Super Admin Navigation"
      roleLabel="Super Admin"
      navLinks={SUPER_ADMIN_NAV_LINKS}
    >
      <PortalPlaceholder
        title="All Customer Enquiries"
        description="Company-wide customer enquiry ledger with search, filtering, DSA assignment, and downloadable data export."
        plannedFeatures={[
          'Full customer enquiry records table across all submissions',
          'Search, multi-criteria filtering, and DSA assignment controls',
          'Downloadable CSV/Excel customer enquiry export',
        ]}
        backendRequirements={[
          'GET /api/super-admin/enquiries with pagination and filter query params',
          'GET /api/super-admin/enquiries/export for authorized data downloads',
        ]}
      />
    </PortalLayout>
  );
}
