import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';
import { DSA_NAV_LINKS } from './DsaDashboardPage';

export default function DsaEnquiriesPage() {
  return (
    <PortalLayout
      portalTitle="DSA Portal Navigation"
      roleLabel="DSA Partner"
      navLinks={DSA_NAV_LINKS}
    >
      <PortalPlaceholder
        title="DSA Customer Enquiries"
        description="Assigned personal loan enquiries authorized for this DSA account will be displayed in a searchable, filterable table."
        plannedFeatures={[
          'Paginated table of assigned customer enquiries',
          'Search by reference ID, applicant name, or city',
          'Filter by enquiry status and link to /dsa/enquiries/:id',
        ]}
        backendRequirements={[
          'GET /api/dsa/enquiries returning only records assigned to the signed-in DSA',
          'Server-enforced tenant/ownership filtering',
        ]}
      />
    </PortalLayout>
  );
}
