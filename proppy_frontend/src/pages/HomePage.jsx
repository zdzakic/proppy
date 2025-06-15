import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/LandingFeatures";


const HomePage = () => {
  return (
    <>
      <LandingHero />
      {/* Kasnije možeš dodati: <Features />, <Testimonials />, itd. */}
      <LandingFeatures />
    </>
  );
};

export default HomePage;
