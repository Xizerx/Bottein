"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-cream)] pt-16 pb-10">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <p
              className="text-3xl font-bold tracking-tight mb-3 text-[var(--color-cream)]"
              style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
            >
              BOTTEIN
            </p>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Science-backed nutrition engineered for your life. Real ingredients,
              real results.
            </p>
            <a
              href="https://instagram.com/bottein.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--color-amber)] hover:text-white transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @bottein.ca
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="section-label mb-4 text-white/40">Explore</p>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/quiz", label: "Take the Quiz" },
                { href: "/builder", label: "Formula Builder" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Waitlist */}
          <div>
            <p className="section-label mb-4 text-white/40">Stay in the loop</p>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Be first to know when we launch. No spam, ever.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
                if (email) {
                  const stored = JSON.parse(localStorage.getItem("bottein_waitlist") || "[]");
                  stored.push({ email, ts: new Date().toISOString() });
                  localStorage.setItem("bottein_waitlist", JSON.stringify(stored));
                  alert("You're on the list! We'll be in touch soon.");
                  form.reset();
                }
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-amber)] transition-colors"
              />
              <button type="submit" className="btn-amber text-xs px-4 py-2.5 whitespace-nowrap">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} BOTTEIN Inc. All rights reserved.</p>
          <p>Founded by Yushu Wang.</p>
        </div>
      </div>
    </footer>
  );
}
