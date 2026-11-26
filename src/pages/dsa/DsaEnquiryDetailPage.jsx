import { useParams } from 'react-router-dom';
import PortalLayout from '../../components/common/PortalLayout';
import PortalPlaceholder from '../../components/common/PortalPlaceholder';
import { DSA_NAV_LINKS } from './DsaDashboardPage';

export default function DsaEnquiryDetailPage() {
  const { id } = useParams();

  return (
    <PortalLayout
      portalTitle="DSA Portal Navigation"
      roleLabel="DSA Partner"
      navLinks={DSA_NAV_LINKS}
    >
      <PortalPlaceholder
        title={`Enquiry Detail (${id})`}
        description="Detailed view for an individual assigned enquiry, including personal requirements, consent timestamp, and status history."
        plannedFeatures={[
          'Full customer enquiry breakdown for the selected record',
          'Enquiry status display and authorized status workflow updates',
        ]}
        backendRequirements={[
          `GET /api/dsa/enquiries/${id} verifying ownership by authenticated DSA`,
        ]}
      />
    </PortalLayout>
  );
}
