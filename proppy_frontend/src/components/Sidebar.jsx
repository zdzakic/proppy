import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/owners', label: 'Owners' },
  { to: '/dashboard/properties', label: 'Properties' },
  { to: '/dashboard/ownerships', label: 'Ownerships' },
  // You can add more routes later
];

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen w-64 bg-base-200 p-4">
      <div className="mb-8 text-lg font-bold">Proppy Dashboard</div>
      {navLinks.map(link => (
        <Link key={link.to} to={link.to} className="btn btn-ghost justify-start">
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;

