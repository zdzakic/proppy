"use client";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import HeaderLink from "@/components/ui/HeaderLink";
import {
    landingAccountLinks,
    landingNavigationLinks,
} from "@/config/navigation";

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
                ${scrolled ? "text-brand-header-text" : "text-brand-hero"}
            `}
            >
            ROOKerys
            </span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12 text-[0.95rem]">
        {landingNavigationLinks.map((t) => (
            <HeaderLink
                key={t.href}
                href={t.href}
                scrolled={scrolled}
                className="
                relative
                after:absolute after:left-0 after:-bottom-1
                after:h-[1px] after:w-0
                after:bg-brand-accent
                after:transition-all after:duration-300
                hover:after:w-full
                "
            >
                {t.label}
            </HeaderLink>
            ))}
        </nav>

        {/* Desktop User Icon */}
        <div className="relative hidden md:flex items-center group">
        <button
            onClick={() => setOpen(false)}
            className={`
            transition-colors duration-300
            ${
                scrolled
                ? "text-brand-header-muted hover:text-brand-accent"
                : "text-white/70 hover:text-white"
            }
            `}
        >
            <User size={22} strokeWidth={1.5} />
        </button>
        {/* Account Dropdown */}
            <div
                className="
                    absolute right-0 top-8 w-64
                    rounded-xl p-4

                    bg-brand-surface dark:bg-brand-surface
                    border border-brand-border

                    shadow-[0_10px_40px_rgba(0,0,0,0.12)]
                    dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]

                    transition-all duration-200 ease-out

                    opacity-0 invisible translate-y-2
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0
                "
                >
            <div className="space-y-2 text-sm">

                {landingAccountLinks.slice(0, 2).map((link) => (
                    <Link
                    key={link.label}
                    href={link.href}
                    className="
                    block px-3 py-2 rounded-lg
                    text-brand-text dark:text-brand-text
                    hover:bg-black/5 dark:hover:bg-white/5
                    hover:text-brand-accent
                    transition-colors duration-200
                "
                    >
                    {link.label}
                    </Link>
                ))}

                <div className="h-px bg-brand-border my-2"></div>

                <Link
                href={landingAccountLinks[2].href}
                className="
                    block px-3 py-2 rounded-lg
                    text-brand-text dark:text-brand-text
                    hover:bg-black/5 dark:hover:bg-white/5
                    hover:text-brand-accent
                    transition-colors duration-200
                "
                >
                {landingAccountLinks[2].label}
                </Link>

            </div>
            </div>
        </div>

        {/* Mobile Hamburger */}
        <button
        onClick={() => setOpen(!open)}
        className={`md:hidden transition-colors duration-300 ${
            scrolled ? "text-brand-header-text" : "text-brand-hero"
        }`}
        >
        <div className="space-y-1.5">
            <span
                className={`block w-6 h-[2px] transition-colors duration-300 ${
                    scrolled ? "bg-brand-header-text" : "bg-brand-hero"
                }`}
            ></span>
            <span
                className={`block w-6 h-[2px] transition-colors duration-300 ${
                    scrolled ? "bg-brand-header-text" : "bg-brand-hero"
                }`}
                ></span>
            <span
                className={`block w-6 h-[2px] transition-colors duration-300 ${
                    scrolled ? "bg-brand-header-text" : "bg-brand-hero"
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
                {landingNavigationLinks.map((t) => (
               <HeaderLink
                key={t.href}
                href={t.href}
                scrolled={scrolled}
                onClick={() => setOpen(false)}
                className="block"
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
                </HeaderLink>
            ))}
            <div className="mt-12 space-y-6">

                <div className="h-px bg-white/20"></div>

                {landingAccountLinks.slice(0, 2).map((link) => (
                    <HeaderLink
                    key={link.label}
                    href={link.href}
                    scrolled={scrolled}
                    onClick={() => setOpen(false)}
                    className="block"
                    >
                    {link.label}
                    </HeaderLink>
                ))}

               <HeaderLink
                href={landingAccountLinks[2].href}
                scrolled={scrolled}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
                >
                <User size={20} strokeWidth={1.5} />
                {landingAccountLinks[2].label}
                </HeaderLink>

            </div>
            
            </div>
        </div>
    </header>
);
}

