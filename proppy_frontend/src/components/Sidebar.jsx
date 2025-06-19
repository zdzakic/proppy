import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Building2, Users, LayoutList,
  ShieldCheck, Banknote, Hammer, Newspaper
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const commonLinks = [
    { to: '/', label: 'Back to Home', icon: <Home className="w-4 h-4" /> },
    { to: '/dashboard', label: 'Dashboard', icon: <Building2 className="w-4 h-4" /> },
  ];

  const ownerLinks = [
    { to: '/dashboard/health-safety', label: 'Health & Safety', icon: <ShieldCheck className="w-4 h-4" /> },
    { to: '/dashboard/insurances', label: 'Insurances', icon: <Banknote className="w-4 h-4" /> },
    { to: '/dashboard/finances', label: 'Finances', icon: <Banknote className="w-4 h-4" /> },
    { to: '/dashboard/works', label: 'Works in Progress', icon: <Hammer className="w-4 h-4" /> },
    { to: '/dashboard/news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
  ];

  const adminLinks = [
    { to: '/dashboard/owners', label: 'Owners', icon: <Users className="w-4 h-4" /> },
    { to: '/dashboard/properties', label: 'Properties', icon: <LayoutList className="w-4 h-4" /> },
    { to: '/dashboard/ownerships', label: 'Ownerships', icon: <LayoutList className="w-4 h-4" /> },
  ];

  const tenantLinks = [
    // Tenant-specific links in the future
  ];

  // Determine links to render based on role
  let roleLinks = [];
  if (user?.role === 'owner') roleLinks = ownerLinks;
  else if (user?.role === 'admin') roleLinks = adminLinks;
  else if (user?.role === 'tenant') roleLinks = tenantLinks;

  const allLinks = [...commonLinks, ...roleLinks];

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-white px-4 py-6 space-y-2">
      <div className="text-2xl text-center font-bold tracking-tight mb-8">Proppy</div>
      <nav className="flex flex-col space-y-1">
        {allLinks.map((link) => {
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
