// app/layout.tsx

import "./globals.css";
import  Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


export const metadata = {
  title: "Rookerys",
  description: "Property Management Software",
  icons: {
    icon: "/favicon.ico",
  },
};

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
