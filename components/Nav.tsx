"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Quiz" },
  { href: "/builder", label: "Builder" },
];

const announcements = [
  "\u00A0\u00A0\u00A0\u00A0Real fruit. Real protein. Coming soon.\u00A0\u00A0\u00A0\u00A0",
  "\u00A0\u00A0\u00A0\u00A0Early access open — join the waitlist.\u00A0\u00A0\u00A0\u00A0",
  "\u00A0\u00A0\u00A0\u00A0Build your formula. No compromises.\u00A0\u00A0\u00A0\u00A0",
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const { totals } = useCart();

  useEffect(() => {
    const NAV_H = 96; // announcement bar (~32px) + main nav (~64px)
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Check if any [data-nav-dark] section is currently behind the nav
      const darkSections = document.querySelectorAll("[data-nav-dark]");
      let dark = false;
      darkSections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < NAV_H && rect.bottom > 0) dark = true;
      });
      setIsDark(dark);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % announcements.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Announcement bar ── */}
      {/* overflow-hidden clips the entering/exiting text outside the bar height */}
      {/* relative here is critical — it makes the absolute span position
          against this bar, not the header. overflow-hidden clips the slide. */}
      <div className="relative bg-[var(--color-ink)] py-2 overflow-hidden flex items-center justify-center h-8">
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIndex}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute text-xs font-medium tracking-wide text-[var(--color-cream)]"
          >
            {announcements[msgIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Main nav ── */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-[var(--color-ink)]/90 backdrop-blur-sm"
              : "bg-[var(--color-cream)]/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="container-site grid grid-cols-3 items-center h-16 md:h-18">
          {/* Col 1: Logo */}
          <Link
            href="/"
            className={`text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-[var(--color-amber)] ${
              isDark ? "text-white" : "text-[var(--color-ink)]"
            }`}
            style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
          >
            BOTTEIN
          </Link>

          {/* Col 2: Desktop nav */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? "text-white" : "text-[var(--color-ink)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Col 3: Cart + mobile hamburger */}
          <div className={`flex items-center justify-end gap-2 transition-colors duration-300 ${isDark ? "text-white" : "text-[var(--color-ink)]"}`}>
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
              aria-label={`Cart (${totals.itemCount} items)`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totals.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[10px] font-bold flex items-center justify-center">
                  {totals.itemCount}
                </span>
              )}
            </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 transition-all duration-200 ${isDark ? "bg-white" : "bg-[var(--color-ink)]"} ${
                menuOpen ? "w-5 translate-y-2 rotate-45" : "w-5"
              }`}
            />
            <span
              className={`block h-0.5 transition-all duration-200 ${isDark ? "bg-white" : "bg-[var(--color-ink)]"} ${
                menuOpen ? "w-0 opacity-0" : "w-4"
              }`}
            />
            <span
              className={`block h-0.5 transition-all duration-200 ${isDark ? "bg-white" : "bg-[var(--color-ink)]"} ${
                menuOpen ? "w-5 -translate-y-2 -rotate-45" : "w-5"
              }`}
            />
          </button>
          </div>
        </div>
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
          <Link
            href="/cart"
            className="py-2.5 text-sm font-medium text-[var(--color-ink-muted)] flex items-center justify-between"
          >
            <span>Cart</span>
            {totals.itemCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[10px] font-bold flex items-center justify-center">
                {totals.itemCount}
              </span>
            )}
          </Link>
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
