export default function Header() {
  return (
    <header className="sticky top-0 z-50 text-white bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <span className="font-display text-xl tracking-wide">
            ProppyCO
          </span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex gap-10 text-sm">
          {["Home", "About Us", "Our Services", "Properties"].map((t) => (
            <a
              key={t}
              href="#"
              className="opacity-75 hover:opacity-100 transition"
            >
              {t}
            </a>
          ))}
        </nav>

        {/* Contact button */}
        <button className="px-6 py-2 rounded-full bg-brand-accent text-brand-primary text-sm font-medium
          shadow-[0_10px_30px_rgba(184,155,94,0.25)] hover:opacity-95 transition border border-black/10">
          Contact
        </button>

      </div>
    </header>
  );
}