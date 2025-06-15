const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-[#0e1625]/80 backdrop-blur-sm">
      <span className="loading loading-spinner loading-lg text-navy dark:text-primary"></span>
    </div>
  );
};

export default Loader;
