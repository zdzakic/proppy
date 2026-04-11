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
import {
  footerPlatformLinks,
  landingNavigationLinks,
  legalNavigationLinks,
} from "@/config/navigation";
import {
  brandInfo,
  contactInfo,
  companyInfo,
  institutionalTagline,
  complianceInfo,
} from "@/constants/footer";

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
            {brandInfo.name}
          </h2>
          <p className="text-white/70 leading-relaxed max-w-xs">
           {brandInfo.description}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">
             {institutionalTagline}
          </p>
          <p className="mt-4 text-xs text-white/30 tracking-wide">
             {complianceInfo}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-medium mb-4 text-white">
            Navigation
          </h3>
          <ul className="space-y-3 text-white/60">
            {landingNavigationLinks.map((link) => (
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
            {footerPlatformLinks.map((link) => (
                <li key={link.href}>
                <Link
                    href={link.href}
                    className="hover:text-brand-accent transition-colors duration-300"
                >
                    {link.label}
                </Link>
                </li>
            ))}
            </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-medium mb-4 text-white">
            Contact
          </h3>

            <ul className="space-y-3 text-white/60">

                {/* Email */}
                <li>
                    <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-brand-accent transition-colors duration-300"
                    >
                    {contactInfo.email}
                    </a>
                </li>

                {/* Phone */}
                <li>
                    <a
                    href={`tel:${contactInfo.phone}`}
                    className="hover:text-brand-accent transition-colors duration-300"
                    >
                    {contactInfo.phone}
                    </a>
                </li>

                {/* Location */}
                <li className="text-white/40">
                    {contactInfo.location}
                </li>

                    {/* Company Info */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-1 text-white/40 text-xs tracking-wide">
                    <p>{companyInfo.legalName}</p>
                    <p>{companyInfo.companyNumber}</p>
                    <p>{companyInfo.registration}</p>
                </div>

                </ul>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>
            ©{new Date().getFullYear()} Rookerys Ltd. All rights reserved.
          </span>

          <div className="flex gap-6">
            {legalNavigationLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-accent transition-colors"
                >
                {link.label}
                </Link>
            ))}
            </div>

        </div>
      </div>
    </footer>
  );
}