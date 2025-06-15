import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import { User, LogOut } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-light dark:bg-[#0e1625] text-primary dark:bg-gray-950 dark:text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Topbar */}
        <div className="flex justify-end items-center gap-4 mb-6">
          {/* USER DROPDOWN */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="hover:text-primary text-grayText dark:text-gray-300 dark:hover:text-primary cursor-pointer"
            >
              <User className="w-5 h-5" />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow rounded-box w-40 mt-1
                         bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            >
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-navy dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>

          {/* THEME TOGGLE */}
          <ThemeToggle />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
