import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Hall of Fame', href: '#hall-of-fame' },
  { label: 'Events', href: '#events' },
  { label: 'Crew', href: '#crew' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-bg/70 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16 md:h-20">

          {/* Logo / Wordmark */}
          <a href="#" className="relative z-50 flex items-center gap-3 group">
            <span className="text-label text-fg tracking-[0.3em] text-sm md:text-base font-bold">
              QUIZZINGA
            </span>
            <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-meta text-muted hover:text-fg transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}

            {/* Join CTA */}
            <a
              href="#join"
              className="relative overflow-hidden px-5 py-2 border border-accent text-accent text-meta tracking-[0.15em] hover:text-bg transition-colors duration-300 group"
            >
              <span className="relative z-10">JOIN</span>
              <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-50 flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[1.5px] bg-fg transition-all duration-300 origin-center ${
                mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-fg transition-all duration-300 ${
                mobileOpen ? 'opacity-0 scale-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-fg transition-all duration-300 origin-center ${
                mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-fg text-3xl font-bold tracking-[0.1em] uppercase hover:text-accent transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Join CTA — Mobile */}
              <motion.a
                href="#join"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: NAV_LINKS.length * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mt-4 px-8 py-3 border border-accent text-accent text-xl font-bold tracking-[0.2em] uppercase hover:bg-accent hover:text-bg transition-all duration-300"
              >
                JOIN
              </motion.a>
            </nav>

            {/* Bottom decoration */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-12 w-24 h-px bg-accent origin-center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;