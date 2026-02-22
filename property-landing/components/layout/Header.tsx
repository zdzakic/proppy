"use client";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = ["Home", "About Us", "Our Services", "Properties"];

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <span className="font-display text-[1.65rem] tracking-[0.04em] text-brand-hero">
          ProppyCO
        </span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12 text-[0.95rem]">
          {links.map((t) => (
            <a
              key={t}
              href="#"
              className="relative text-white/70 hover:text-white transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {t}
            </a>
          ))}   
        </nav>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <button className="px-6 py-2.5 rounded-full bg-brand-accent text-brand-primary text-sm font-medium
            shadow-[0_15px_35px_rgba(184,155,94,0.35)] hover:scale-[1.03] transition-transform duration-300 hover:opacity-95 transition">
            Contact
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-brand-hero"
        >
          <div className="space-y-1.5">
            <span className="block w-6 h-[2px] bg-brand-hero"></span>
            <span className="block w-6 h-[2px] bg-brand-hero"></span>
            <span className="block w-6 h-[2px] bg-brand-hero"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
       <div
        className={`
            fixed inset-0 z-[60]
            bg-primary/95 backdrop-blur-xl
            transition-all duration-300
            ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
        >

            {/* CLOSE BUTTON */}
            <button
                onClick={() => setOpen(false)}
                className="
                    absolute top-6 right-6
                    text-brand-hero
                    text-2xl
                    transition-all duration-300
                    hover:rotate-90 hover:scale-110
                    active:scale-95
                "
                >
                ✕
                </button>

            <div className="pt-24 px-8 space-y-8 text-xl">
            {links.map((t) => (
                <a
                    key={t}
                    href="#"
                    onClick={() => setOpen(false)}
                    className="block text-white/80 hover:text-white transition duration-300"
                    >
                    <span
                        className="
                        relative
                        inline-block
                        after:absolute
                        after:left-0
                        after:-bottom-1
                        after:h-[1px]
                        after:w-0
                        after:bg-brand-accent
                        after:transition-all
                        after:duration-300
                        hover:after:w-full
                        "
                    >
                        {t}
                    </span>
                    </a>
            ))}

            <button className="mt-6 w-full px-6 py-3 rounded-full bg-brand-accent text-brand-primary font-medium">
                Contact
            </button>
            </div>
        </div>
    </header>
  );
}

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-50 text-white bg-transparent">
//       <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        
//         {/* Logo + Name */}
//         <div className="flex items-center gap-3">
//           <span className="font-display text-xl tracking-wide text-brand-">
//             ProppyCO
//           </span>
//         </div>

//         {/* Links */}
//         <nav className="hidden md:flex gap-10 text-sm">
//           {["Home", "About Us", "Our Services", "Properties"].map((t) => (
//             <a
//               key={t}
//               href="#"
//               className="opacity-75 hover:opacity-100 transition"
//             >
//               {t}
//             </a>
//           ))}
//         </nav>

//         {/* Contact button */}
//         <button className="px-6 py-2 rounded-full bg-brand-accent text-brand-primary text-sm font-medium
//           shadow-[0_10px_30px_rgba(184,155,94,0.25)] hover:opacity-95 transition border border-black/10">
//           Contact
//         </button>

//       </div>
//     </header>
//   );
// }