import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-16 px-6 mt-24 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary mb-3">Proppy</h2>
          <p className="text-gray-300 max-w-xs">
            Modern property management platform built for owners and tenants.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-base font-accent font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-base font-accent font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-white transition">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-accent font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="mailto:hello@proppy.com" className="hover:text-white transition">hello@proppy.com</a></li>
            <li><span className="text-gray-500">Switzerland, EU</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Proppy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
