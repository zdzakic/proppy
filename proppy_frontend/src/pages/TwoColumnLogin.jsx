// src/pages/TwoColumnLogin.jsx

import LoginCard from '../components/LoginCard';

const TwoColumnLogin = () => {
  return (
    // <div className="min-h-screen flex flex-col lg:flex-row">
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-navy dark:bg-[#0e1625]">
      {/* LEFT: Login area */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-light dark:bg-[#1e293b] p-6">
        <LoginCard />
      </div>

      {/* RIGHT: Feature / Branding area */}
      <div className="hidden lg:flex w-1/2 bg-navy p-10 items-center justify-center text-white dark:bg-[#1e293b]">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-primary mb-4">Welcome to Proppy</h2>
          <p className="text-lg text-white mb-6">
            Smart Property Management made simple. Track costs, manage documents, and stay in control of your buildings.
          </p>
          <ul className="list-disc pl-5 text-sm text-white space-y-2">
            <li>📊 Transparent financial overview</li>
            <li>🛠️ Maintenance reminders</li>
            <li>📁 Centralized H&S documents</li>
            <li>🤖 Future-ready with AI integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLogin;
