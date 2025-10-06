import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { hasRole } from '../../utils/TokenUtils';

const ProtectedRoute = ({allowedRoles}) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;

  if (!user){
    return <Navigate to="/AdminLogin" replace />;
  } 

  if (!hasRole(user, allowedRoles)){
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
