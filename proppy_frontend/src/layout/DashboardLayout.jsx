import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import LogoutButton from '../components/LogoutButton'; // ← DODANO
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <ThemeToggle />
          <LogoutButton /> {/* ← DODANO */}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
