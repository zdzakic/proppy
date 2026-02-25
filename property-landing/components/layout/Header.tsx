"use client";
import { useState, useEffect } from "react";
import { navigationLinks } from "@/constants/links";
import { User } from "lucide-react";
import Link from "next/link";

export default function Header() {

const [open, setOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


return (
    <header
        className={`
            fixed top-0 left-0 w-full h-24 z-[9999]
            transition-colot duration-200
            ${open
            ? "bg-transparent"
            : scrolled
                ? "bg-primary/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-white/5"
                : "bg-transparent"
            }
        `}
        >
    <div className="max-w-6xl mx-auto px-6 py-5 md:py-8 flex items-center justify-between">

        {/* Logo */}
        <span
            className={`
                font-display text-[1.65rem] tracking-[0.04em]
                transition-colors duration-300
                text-brand-hero
                ${scrolled ? "text-brand-primary" : "text-brand-hero"}
            `}
            >
            ROOKerys
            </span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12 text-[0.95rem]">
        {navigationLinks.map((t) => (
            <a
                key={t.href}
                href={t.href}
                className={`
                    relative
                    transition duration-300
                    ${
                    scrolled
                        ? "text-brand-primary hover:text-brand-accent"
                        : "text-white/70 hover:text-white"
                    }
                    after:absolute after:left-0 after:-bottom-1
                    after:h-[1px] after:w-0
                    after:bg-brand-accent
                    after:transition-all after:duration-300
                    hover:after:w-full
                `}
                >
                {t.label}
                </a>
        ))}   
        </nav>

        {/* Desktop Button */}
        {/* <div className="hidden md:block"> */}
        {/* <button className="px-6 py-2.5 rounded-full bg-brand-accent text-brand-primary text-sm font-medium
            shadow-[0_15px_35px_rgba(184,155,94,0.35)] hover:scale-[1.03] transition-transform duration-300 hover:opacity-95 transition">
            Contact
        </button>
        </div> */}
        {/* Desktop User Icon */}
        <div className="hidden md:flex items-center">
        <Link
            href="/login"
            className={`
            transition-colors duration-300
            ${
                scrolled
                ? "text-brand-primary hover:text-brand-accent"
                : "text-white/70 hover:text-white"
            }
            `}
        >
            <User size={22} strokeWidth={1.5} />
        </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
        onClick={() => setOpen(!open)}
        className={`md:hidden transition-colors duration-300 ${
            scrolled ? "text-brand-primary" : "text-brand-hero"
        }`}
        >
        <div className="space-y-1.5">
            <span
                className={`block w-6 h-[2px] transition-colors duration-300 ${
                    scrolled ? "bg-brand-primary" : "bg-brand-hero"
                }`}
            ></span>
            <span
                className={`block w-6 h-[2px] transition-colors duration-300 ${
                    scrolled ? "bg-brand-primary" : "bg-brand-hero"
                }`}
                ></span>
            <span
                className={`block w-6 h-[2px] transition-colors duration-300 ${
                    scrolled ? "bg-brand-primary" : "bg-brand-hero"
                }`}
                ></span>
        </div>
        </button>
    </div>

    {/* Mobile Menu */}
    <div
        className={`
            fixed inset-0 z-[9999]
            bg-primary/90 backdrop-blur-xl
            transition-all duration-300
            ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        >

            {/* CLOSE BUTTON */}
            <button
                onClick={() => setOpen(false)}
                className={`
                    absolute top-6 right-6
                    text-2xl
                    transition-all duration-300
                    hover:rotate-90 hover:scale-110
                    active:scale-95
                    ${scrolled ? "text-brand-primary" : "text-brand-hero"}
                `}
                >
                ✕
                </button>

            <div className="pt-24 px-8 space-y-8 text-xl">
            {navigationLinks.map((t) => (
                <a
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    // className="block text-white/80 hover:text-white transition duration-300"
                    className={`
                        block transition duration-300
                        ${
                            scrolled
                            ? "text-brand-primary hover:text-brand-accent"
                            : "text-white/80 hover:text-white"
                        }
                        `}
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
                        {t.label}
                    </span>
                    </a>
            ))}

            {/* <button className="mt-6 w-full px-6 py-3 rounded-full bg-brand-accent text-brand-primary font-medium">
                Contact
            </button> */}
            <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={`
                    flex items-center gap-3 mt-8
                    transition duration-300
                    ${
                    scrolled
                        ? "text-brand-primary hover:text-brand-accent"
                        : "text-white/80 hover:text-white"
                    }
                `}
                >
                <User size={22} strokeWidth={1.5} />
                <span>Login</span>
                </Link>
            </div>
        </div>
    </header>
);
}

