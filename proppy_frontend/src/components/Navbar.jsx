import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="navbar bg-base-100 shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">Proppy</Link>
        </div>
        <div className="navbar-end flex items-center space-x-2">
          {token ? (
            <>
              <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
              <button onClick={logout} className="btn btn-outline btn-error">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline">Login</Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
