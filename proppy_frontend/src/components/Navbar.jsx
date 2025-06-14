import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from 'lucide-react';
import { BsSun, BsSunFill } from "react-icons/bs";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white dark:bg-navy text-navy dark:text-white shadow-lg sticky top-0 z-50">
  <div className="container mx-auto flex justify-between items-center px-4 py-3">
    {/* Logo */}
    <div className="text-xl font-bold text-navy dark:text-white">
      <Link to="/">Proppy</Link>
    </div>

    {/* Navigacija */}
    <div className="flex items-center gap-4">
      {token ? (
        <>
          <Link
            to="/dashboard"
            className="text-sm text-grayText dark:text-gray-300 hover:text-primary dark:hover:text-primary"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500"
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="hover:text-primary text-grayText dark:text-gray-300 dark:hover:text-primary">
          <User className="w-5 h-5" />
        </Link>
      )}

      <ThemeToggle />
    </div>
  </div>
</nav>
  );
};

export default Navbar;
