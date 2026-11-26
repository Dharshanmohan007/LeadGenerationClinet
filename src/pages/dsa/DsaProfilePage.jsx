import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';
import { DSA_NAV_LINKS } from './DsaDashboardPage';

export default function DsaProfilePage() {
  return (
    <PortalLayout
      portalTitle="DSA Portal Navigation"
      roleLabel="DSA Partner"
      navLinks={DSA_NAV_LINKS}
    >
      <PortalPlaceholder
        title="DSA Account Profile"
        description="View your DSA partner profile details, assigned territory metadata, and account status."
        plannedFeatures={[
          'DSA partner contact information and organization details',
          'Password update and session controls',
        ]}
        backendRequirements={[
          'GET /api/dsa/profile and PATCH /api/dsa/profile',
        ]}
      />
    </PortalLayout>
  );
}
