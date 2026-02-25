/**
 * Footer – Premium version
 *
 * ZAŠTO:
 * - Vizuelno zatvara stranicu sa dubinom (ne flat navy)
 * - Koristi postojeće brand tokene
 * - Mobile first
 * - Suptilni gold radial glow za premium osjećaj
 */

import Link from "next/link";
import { navigationLinks } from "@/constants/links";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">

      {/* Background Layer */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-b
          from-brand-primary
          via-[#0c1726]
          to-brand-primary
        "
      />

      {/* Gold Radial Glow */}
      <div
        className="
          absolute -top-32 left-1/2 -translate-x-1/2
          w-[600px] h-[600px]
          bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.15)_0%,transparent_70%)]
          pointer-events-none
        "
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-white">

        {/* Brand */}
        <div>
          <h2 className="font-display text-2xl text-brand-accent mb-4">
            ROOKerys
          </h2>
          <p className="text-white/70 leading-relaxed max-w-xs">
            Modern property management platform designed for owners,
            directors and tenants.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-medium mb-4 text-white">
            Navigation
          </h3>
          <ul className="space-y-3 text-white/60">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-brand-accent transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h3 className="font-medium mb-4 text-white">
            Platform
          </h3>
          <ul className="space-y-3 text-white/60">
            <li>
              <Link
                href="/login"
                className="hover:text-brand-accent transition-colors duration-300"
              >
                Owner Login
              </Link>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-brand-accent transition-colors duration-300"
              >
                Features
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-medium mb-4 text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-white/60">
            <li>
              <a
                href="mailto:hello@proppy.co"
                className="hover:text-brand-accent transition-colors duration-300"
              >
                hello@proppy.co
              </a>
            </li>
            <li className="text-white/40">
              Switzerland
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>
            ©{new Date().getFullYear()} ROOKerys. All rights reserved.
          </span>

          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-brand-accent transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}