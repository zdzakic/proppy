// // app/layout.tsx

/**
 * RootLayout
 *
 * ZAŠTO:
 * Root layout mora ostati minimalan i globalan.
 * Njegova odgovornost je samo:
 * - učitavanje globalnih stilova
 * - definisanje osnovne HTML strukture
 * - dijeljenje metadata postavki
 *
 * Header, Footer i ostali vizuelni wrapperi ne stoje ovdje,
 * jer različiti dijelovi aplikacije trebaju različite layout-e
 * (public, auth, dashboard).
 */

import "./globals.css";

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
      <body className="relative">{children}</body>
    </html>
  );
}

// import "./globals.css";
// import  Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";


// export const metadata = {
//   title: "Rookerys",
//   description: "Property Management Software",
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="relative">
//         <div className="hero-bg-layer" />
//             <Header />
//             {children}
//         <Footer />
//       </body>
//     </html>
//   );
// }
