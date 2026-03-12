"use client";

/**
 * LoginPromo
 *
 * ZAŠTO:
 * Desna strana login stranice predstavlja marketing
 * prostor za zdzdigital platformu.
 *
 * Ovaj dizajn je inspirisan modernim SaaS login ekranima
 * (Stripe / Linear / Vercel) sa jasnom hijerarhijom:
 *
 * 1. Brand
 * 2. Headline
 * 3. 3 ključne vrijednosti
 */

import { Globe, Brain, Workflow } from "lucide-react";

export default function LoginPromo() {
  return (
    <div className="max-w-xl px-10 space-y-14">

      {/* BRAND */}
      <div className="space-y-6 text-center">
        <h2 className="text-5xl font-bold text-brand-accent">
          zdzdigital
        </h2>

        <p className="text-2xl font-semibold leading-relaxed text-white/90">
          Building modern web platforms and AI-powered systems
        </p>
      </div>

      {/* FEATURES */}
      <div className="space-y-8">

        {/* WEB APPS */}
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <Globe className="h-6 w-6 text-brand-accent" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Web & Mobile Applications
            </h3>

            <p className="text-white/70 leading-relaxed">
              Custom platforms and SaaS products built with modern
              technologies like React, Next.js and scalable cloud architecture.
            </p>
          </div>
        </div>

        {/* AI */}
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <Brain className="h-6 w-6 text-brand-accent" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              AI-Powered Solutions
            </h3>

            <p className="text-white/70 leading-relaxed">
              Intelligent tools that analyse data, automate workflows
              and support better decision making.
            </p>
          </div>
        </div>

        {/* AUTOMATION */}
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <Workflow className="h-6 w-6 text-brand-accent" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Automation & Smart Systems
            </h3>

            <p className="text-white/70 leading-relaxed">
              Lightweight digital systems designed to simplify operations
              and help businesses scale efficiently.
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <p className="text-sm text-white/60 text-center">
        Built by{" "}
        <a
          href="https://zdzdigital.com"
          target="_blank"
          className="underline underline-offset-4 hover:text-brand-accent transition"
        >
          zdzdigital.ch
        </a>
      </p>

    </div>
  );
}