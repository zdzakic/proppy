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
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

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
    <html lang="en" suppressHydrationWarning>
  <head>
    <script
      dangerouslySetInnerHTML={{
        __html: `
        (function () {
        try {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            }
        } catch (e) {}
        })();
                `,
            }}
            />
  </head>

  <body className="relative">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
