/**
 * Home Page
 *
 * ZAŠTO:
 * Sastavlja sve landing sekcije.
 * Trenutno placeholder dok ne dodamo sekcije.
 */

import Hero from "@/components/sections/Hero";
import Overview from "@/components/sections/Overview";
import Challenges from "@/components/sections/Challenges";
import CostExample from "@/components/sections/CostExample";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Overview />
      <Challenges />
      <CostExample />
    </main>
  );
}
