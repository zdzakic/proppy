import heroImage from "../assets/hero2-bg.png";

const LandingHero = () => {
  return (
    <section className="bg-light dark:bg-[#0e1625] py-8 px-6 mb-0">
     <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 px-4">
        {/* Tekst lijevo */}
        <div className="max-w-xl text-left">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Simplify Your <span className="text-primary">Property Management</span>
          </h1>
          <p className="font-sans text-lg text-grayText dark:text-gray-300 mb-8 max-w-md">
            Proppy gives you a smarter, faster way to manage real estate — from ownership structure to daily operations.
          </p>
          <a href="/login" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Get Started
          </a>
        </div>

        {/* Slika desno */}
        <div className="flex justify-center w-full md:w-auto">
          <img
            src={heroImage}
            alt="Proppy hero illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
