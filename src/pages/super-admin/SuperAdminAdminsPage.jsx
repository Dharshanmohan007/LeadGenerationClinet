import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';
import { SUPER_ADMIN_NAV_LINKS } from './SuperAdminDashboardPage';

export default function SuperAdminAdminsPage() {
  return (
    <PortalLayout
      portalTitle="Super Admin Navigation"
      roleLabel="Super Admin"
      navLinks={SUPER_ADMIN_NAV_LINKS}
    >
      <PortalPlaceholder
        title="DSA & Admin Account Management"
        description="Manage DSA partner accounts, review onboarding status, and export authorized DSA/admin records."
        plannedFeatures={[
          'Searchable and filterable table of DSA/admin accounts',
          'Create, activate, suspend, and manage DSA accounts',
          'Downloadable DSA/admin directory export',
        ]}
        backendRequirements={[
          'CRUD endpoints under /api/super-admin/admins',
          'GET /api/super-admin/admins/export',
        ]}
      />
    </PortalLayout>
  );
}
