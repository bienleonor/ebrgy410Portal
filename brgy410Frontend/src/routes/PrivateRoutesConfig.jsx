import AdminDashboard from '../pages/adminPage/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import ResidentLayout from '../components/layout/ResidentLayout';
import ResidentDashboard from '../pages/userPages/ResidentDashboard';

const privateRoutesConfig = [
  {
    element: <ProtectedRoute allowedRoles={['SuperAdmin', 'Chairman/Chairwoman', 'Councilour/Kagawad', 'Secretary', 'Treasurer', 'Staff']}  />, 
    children: [
      {
        element: <AdminLayout />,
        children:[
          { path: '/admin/dashboard', element: <AdminDashboard /> },
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
        ]
      }
    ],
  }
];

export default privateRoutesConfig;
