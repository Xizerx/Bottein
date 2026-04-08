"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/builder", label: "Builder" },
  { href: "/quiz", label: "Quiz" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-cream)]/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)] hover:text-[var(--color-amber)] transition-colors"
        >
          BOTTEIN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-[var(--color-amber)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/quiz" className="btn-primary text-xs px-5 py-2.5">
            Build Yours
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 bg-[var(--color-ink)] transition-all duration-200 ${
              menuOpen ? "w-5 translate-y-2 rotate-45" : "w-5"
            }`}
          />
          <span
            className={`block h-0.5 bg-[var(--color-ink)] transition-all duration-200 ${
              menuOpen ? "w-0 opacity-0" : "w-4"
            }`}
          />
          <span
            className={`block h-0.5 bg-[var(--color-ink)] transition-all duration-200 ${
              menuOpen ? "w-5 -translate-y-2 -rotate-45" : "w-5"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[var(--color-cream)] border-t border-black/5 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-site flex flex-col py-4 gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`py-2.5 text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-[var(--color-amber)]"
                  : "text-[var(--color-ink-muted)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-black/5 mt-1">
            <Link href="/quiz" className="btn-primary w-full text-center text-xs py-3">
              Build Yours
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
