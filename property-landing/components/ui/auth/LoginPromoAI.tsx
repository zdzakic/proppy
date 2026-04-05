"use client";

/**
 * LoginPromoAI
 *
 * ZAŠTO:
 * - pozicionira zdzdigital kao AI/ML partnera
 * - fokus na data, modele i realnu primjenu
 *
 * ŠTA RJEŠAVA:
 * - diferencijacija od običnih web agencija
 * - jasno komunicira vrijednost (data → odluke)
 *
 * KISS:
 * - ista struktura kao ostali promo
 */

import { Brain, Database, LineChart } from "lucide-react";

export default function LoginPromoAI() {
  return (
    <div className="max-w-xl px-10 space-y-14">

      {/* BRAND */}
      <div className="space-y-6 text-center">
        {/* <h2 className="text-5xl font-bold text-brand-accent">
          zdzdigital
        </h2> */}
        <a className="text-5xl font-bold text-brand-accent" href="https://zdzdigital.ch" target="_blank" rel="noopener noreferrer noreferrer">
          zdzdigital.ch
        </a>

        <p className="text-2xl font-semibold leading-relaxed text-white/90 mt-4">
          Turn your data into decisions with AI-powered systems
        </p>
      </div>

      {/* FEATURES */}
      <div className="space-y-8">

        {/* ML MODELS */}
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <Brain className="h-6 w-6 text-brand-accent" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Machine Learning Models
            </h3>

            <p className="text-white/70 leading-relaxed">
              Build and integrate predictive models that support pricing,
              scoring and smarter business decisions.
            </p>
          </div>
        </div>

        {/* DATA */}
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <Database className="h-6 w-6 text-brand-accent" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Data Engineering & Pipelines
            </h3>

            <p className="text-white/70 leading-relaxed">
              Collect, clean and structure your data so it becomes reliable,
              usable and ready for analysis.
            </p>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <LineChart className="h-6 w-6 text-brand-accent" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Analytics & Insights
            </h3>

            <p className="text-white/70 leading-relaxed">
              Understand trends, detect inefficiencies and uncover opportunities
              hidden in your data.
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <p className="text-sm text-white/60 text-center">
        AI & data systems built for real-world use
      </p>

    </div>
  );
}