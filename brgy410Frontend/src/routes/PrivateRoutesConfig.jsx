import ProtectedRoute from '../components/common/ProtectedRoute';

import AdminDashboard from '../pages/adminPage/AdminDashboard';
import AdminLayout from '../components/layout/AdminLayout';
import ResidentLayout from '../components/layout/ResidentLayout';
import ResidentDashboard from '../pages/userPages/ResidentDashboard';
import ResidentProfilePage from '../pages/userPages/ResidentProfilePage';
import DocumentRequestPage from '../pages/userPages/DocumentRequestPage';
import ResidentRequestList from '../pages/userPages/ResidentRequestList';
import VerifiedConstituent from '../pages/userPages/VerifiedResidentForm';


import AdminRequestList from '../pages/adminPage/AdminRequestList';
import ManageOfficial from '../pages/adminPage/AdminManageOfficial';
import ResidentListPage from '../pages/adminPage/ResidentListPage';
import AdminRegisterResident from '../pages/adminPage/AdminRegisterResident';
import AdminHouseholdManagement from '../pages/adminPage/AdminHouseholdManagement';
import VerifyConsituent from '../pages/adminPage/ConstituentValidationPage';

const privateRoutesConfig = [
  {
    element: <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin',]}  />, 
    children: [
      {
        element: <AdminLayout />,
        children:[
          { path: '/admin/dashboard', element: <AdminDashboard /> },
          { path: '/admin/requests', element: <AdminRequestList /> },
          { path: '/admin/residents', element: <ResidentListPage /> },
          { path: '/admin/manage-official', element: <ManageOfficial /> },
          { path: '/admin/create-account', element: <AdminRegisterResident /> },
          { path: '/admin/households', element: <AdminHouseholdManagement /> },
          { path: '/admin/verify-resident', element: <VerifyConsituent /> },
        ]
      }
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['Resident','SuperAdmin', 'Admin',]} />,
    children: [
      {
        element: <ResidentLayout />,
        children: [
          { path: '/resident/verified-constituent', element: <VerifiedConstituent/>},
          { path: '/resident/dashboard', element: <ResidentDashboard />},
          { path: '/resident/profile', element: <ResidentProfilePage />},
          { path: '/resident/request-document', element: <DocumentRequestPage />},
          { path: '/resident/myrequests', element: <ResidentRequestList />},
        ]
      }
    ],
  }
];

export default privateRoutesConfig;
