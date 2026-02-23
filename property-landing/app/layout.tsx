// app/layout.tsx

import "./globals.css";
import  Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <div className="hero-bg-layer" />
            <Header />
            {children}
        <Footer />
      </body>
    </html>
  );
}
