import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';
import { SUPER_ADMIN_NAV_LINKS } from './SuperAdminDashboardPage';

export default function SuperAdminProfilePage() {
  return (
    <PortalLayout
      portalTitle="Super Admin Navigation"
      roleLabel="Super Admin"
      navLinks={SUPER_ADMIN_NAV_LINKS}
    >
      <PortalPlaceholder
        title="Super Admin Profile"
        description="Manage Super Admin account details and security settings."
        plannedFeatures={[
          'Administrator identity and role verification details',
          'Credential and session security management',
        ]}
        backendRequirements={[
          'GET /api/super-admin/profile and PATCH /api/super-admin/profile',
        ]}
      />
    </PortalLayout>
  );
}
