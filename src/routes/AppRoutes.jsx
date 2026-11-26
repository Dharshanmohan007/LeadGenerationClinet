import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../components/common/PublicLayout';
import NotFound from '../components/common/NotFound';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { USER_ROLES } from '../services/authService';

// Customer Pages (Public, no authentication required)
import HomePage from '../pages/customer/HomePage';
import ApplyPage from '../pages/customer/ApplyPage';
import ApplicationSuccessPage from '../pages/customer/ApplicationSuccessPage';
import PrivacyPolicyPage from '../pages/customer/PrivacyPolicyPage';
import TermsPage from '../pages/customer/TermsPage';

// DSA Portal Pages
import DsaLoginPage from '../pages/dsa/DsaLoginPage';
import DsaDashboardPage from '../pages/dsa/DsaDashboardPage';
import DsaEnquiriesPage from '../pages/dsa/DsaEnquiriesPage';
import DsaEnquiryDetailPage from '../pages/dsa/DsaEnquiryDetailPage';
import DsaProfilePage from '../pages/dsa/DsaProfilePage';

// Super Admin Portal Pages
import SuperAdminLoginPage from '../pages/super-admin/SuperAdminLoginPage';
import SuperAdminDashboardPage from '../pages/super-admin/SuperAdminDashboardPage';
import SuperAdminEnquiriesPage from '../pages/super-admin/SuperAdminEnquiriesPage';
import SuperAdminAdminsPage from '../pages/super-admin/SuperAdminAdminsPage';
import SuperAdminProfilePage from '../pages/super-admin/SuperAdminProfilePage';

/**
 * Central route configuration for MUKTIVA across all three user roles:
 * 1. Customer (public routes)
 * 2. DSA Admin (protected, role === 'dsa')
 * 3. Super Admin (protected, role === 'super_admin')
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/application-success" element={<ApplicationSuccessPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
      </Route>

      {/* Portal Login Routes (accessible only when unauthenticated) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/dsa/login" element={<DsaLoginPage />} />
        <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
      </Route>

      {/* Protected DSA Portal Routes */}
      <Route element={<ProtectedRoute loginPath="/dsa/login" />}>
        <Route
          element={
            <RoleBasedRoute
              allowedRoles={[USER_ROLES.DSA]}
              loginPath="/dsa/login"
            />
          }
        >
          <Route path="/dsa/dashboard" element={<DsaDashboardPage />} />
          <Route path="/dsa/enquiries" element={<DsaEnquiriesPage />} />
          <Route path="/dsa/enquiries/:id" element={<DsaEnquiryDetailPage />} />
          <Route path="/dsa/profile" element={<DsaProfilePage />} />
        </Route>
      </Route>

      {/* Protected Super Admin Portal Routes */}
      <Route element={<ProtectedRoute loginPath="/super-admin/login" />}>
        <Route
          element={
            <RoleBasedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN]}
              loginPath="/super-admin/login"
            />
          }
        >
          <Route
            path="/super-admin/dashboard"
            element={<SuperAdminDashboardPage />}
          />
          <Route
            path="/super-admin/enquiries"
            element={<SuperAdminEnquiriesPage />}
          />
          <Route path="/super-admin/admins" element={<SuperAdminAdminsPage />} />
          <Route
            path="/super-admin/profile"
            element={<SuperAdminProfilePage />}
          />
        </Route>
      </Route>

      {/* 404 Fallback Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
