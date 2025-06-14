import LandingHeader from "../components/LandingHeader";
import LandingHero from "../components/LandingHero";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-light text-navy">
      <LandingHeader />
      <LandingHero />
      {/* Sljedeće sekcije npr. <LandingFeatures /> itd. */}
    </div>
  );
};

export default LandingPage;
