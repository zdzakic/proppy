/**
 * PublicLayout
 *
 * ZAŠTO:
 * Ovaj layout definiše strukturu za javni dio aplikacije
 * (landing / marketing stranice).
 *
 * Odgovornosti:
 * - renderovanje Header navigacije
 * - renderovanje Footer sekcije
 * - renderovanje hero background sloja
 *
 * Time izolujemo marketing dio aplikacije od
 * auth i dashboard dijela sistema.
 */

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* hero background layer koristi globalne stilove */}
      <div className="hero-bg-layer" />
      <Header />
      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}