"use client";

/**
Header

Top navigation dashboarda.

Dizajn:
- navy background
- tanak border
- clean SaaS stil
*/

export default function Header() {
  return (
    <header className="h-16 bg-brand-primary border-b border-brand-border flex items-center px-6">

      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

        {/* Logo */}
        <div className="font-semibold text-white text-lg">
          Rookerys
        </div>

        {/* User */}
        <div className="text-sm text-white/80">
          Account
        </div>

      </div>

    </header>
  );
}