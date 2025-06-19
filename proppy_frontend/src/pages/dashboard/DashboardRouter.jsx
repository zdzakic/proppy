import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * DashboardRouter
 *
 * Redirects user to the appropriate dashboard page based on their role.
 * Uses AuthContext to determine the currently logged-in user.
 */

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'owner':
      return <Navigate to="/dashboard/owner" />;
    case 'tenant':
      return <Navigate to="/dashboard/tenant" />;
    case 'admin':
      return <Navigate to="/dashboard/owner" />;
    default:
      return <Navigate to="/" />;
  }
};

export default DashboardRouter;
