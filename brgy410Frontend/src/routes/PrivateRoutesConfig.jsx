import AdminDashboard from '../pages/adminPage/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import ResidentLayout from '../components/layout/ResidentLayout';
import ResidentDashboard from '../pages/userPages/ResidentDashboard';
import ResidentProfilePage from '../pages/userPages/ResidentProfilePage';
import DocumentRequestPage from '../pages/userPages/DocumentRequestPage';
import ResidentRequestList from '../pages/userPages/ResidentRequestList';

import AdminRequestList from '../pages/adminPage/AdminRequestList';
import ManageOfficial from '../pages/adminPage/AdminManageOfficial';
import ResidentListPage from '../pages/adminPage/ResidentListPage';
import AdminRegisterResident from '../pages/adminPage/AdminRegisterResident';

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

        ]
      }
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['Resident']} />,
    children: [
      {
        element: <ResidentLayout />,
        children: [
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
