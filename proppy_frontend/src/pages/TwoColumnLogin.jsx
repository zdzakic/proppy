import LoginCard from '../components/LoginCard';

const TwoColumnLogin = () => {
  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-navy dark:bg-[#0e1625] font-sans">
      {/* LEFT: Login form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-light dark:bg-[#1e293b] p-6">
        <LoginCard />
      </div>

      {/* RIGHT: Feature/branding */}
      <div className="hidden lg:flex w-1/2 bg-navy p-12 items-center justify-center text-white dark:bg-[#1e293b]">
        <div className="max-w-md">
          <h2 className="text-4xl font-heading font-bold text-primary mb-6">
            Welcome to Proppy
          </h2>
          <p className="text-base text-gray-200 mb-6 leading-relaxed">
            Smart property management made simple. Track costs, manage documents, and stay in control of your buildings.
          </p>
          <ul className="text-sm text-gray-300 space-y-3 pl-4 list-disc marker:text-primary">
            <li>Transparent financial overview</li>
            <li>Maintenance reminders</li>
            <li>Centralized H&S documents</li>
            <li>Future-ready with AI integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLogin;
