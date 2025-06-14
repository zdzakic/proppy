import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Users, LayoutList } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Back to Home', icon: <Home className="w-4 h-4" /> },
  { to: '/dashboard', label: 'Dashboard', icon: <Building2 className="w-4 h-4" /> },
  { to: '/dashboard/owners', label: 'Owners', icon: <Users className="w-4 h-4" /> },
  { to: '/dashboard/properties', label: 'Properties', icon: <LayoutList className="w-4 h-4" /> },
  { to: '/dashboard/ownerships', label: 'Ownerships', icon: <LayoutList className="w-4 h-4" /> },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-white px-4 py-6 space-y-2">
      <div className="text-2xl text-center font-bold tracking-tight mb-8">Proppy</div>
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all 
                ${isActive
                  ? 'bg-slate-800 border-l-4 border-orange-500 text-orange-400'
                  : 'text-white hover:bg-slate-700 hover:text-orange-300'
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
