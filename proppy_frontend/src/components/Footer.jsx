import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

        {/* Logo i opis */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-2">Proppy</h2>
          <p className="text-gray-400">
            Modern property management platform.
          </p>
        </div>

        {/* Navigacija */}
        <div>
          <h3 className="font-semibold mb-2">Navigation</h3>
          <ul className="space-y-1 text-gray-400">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-2">Resources</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-white">Documentation</a></li>
            <li><a href="#" className="hover:text-white">Help Center</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="mailto:hello@proppy.com" className="hover:text-white">hello@proppy.com</a></li>
            <li><span className="text-gray-500">Switzerland, EU</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Proppy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
