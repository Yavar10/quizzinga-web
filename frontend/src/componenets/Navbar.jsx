import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Hall of Fame", href: "#hall-of-fame" },
  { name: "Events", href: "#events" },
  { name: "Crew", href: "#crew" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 md:top-6 left-0 z-50 w-full px-4 md:px-6 lg:px-10"
    >
      <nav className="relative mx-auto max-w-7xl rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between px-5 md:grid md:grid-cols-[1fr_auto_1fr] md:px-7">
          {/* Logo */}
          <a
            href="/"
            className="text-sm font-bold uppercase tracking-[0.28em] md:tracking-[0.35em] text-white"
          >
            QUIZZINGA
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-self-center gap-12">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group relative text-[11px] uppercase tracking-[0.28em] text-white/75 transition hover:text-white"
              >
                {link.name}

                <span className="absolute left-1/2 -bottom-2 h-px w-0 -translate-x-1/2 bg-[#5A45FF] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:justify-self-end">
            {/* Burger */}
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* CTA */}
            <a
              href="#join"
              className="flex items-center gap-2 rounded-full border border-[#5A45FF]/30 bg-[#5A45FF]/10 px-4 md:px-5 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.22em] md:tracking-[0.28em] text-white transition-all duration-300 hover:border-[#5A45FF]/60 hover:bg-[#5A45FF]/20"
            >
              <span>Enter Arena</span>
              <ArrowUpRight size={15} strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute left-0 right-0 top-[calc(100%+12px)] md:hidden"
            >
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                {links.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.25,
                    }}
                    className="flex items-center justify-between border-b border-white/10 px-6 py-5 text-sm uppercase tracking-[0.28em] text-white/75 transition hover:bg-white/5 hover:text-white last:border-b-0"
                  >
                    {link.name}
                    <ArrowUpRight size={16} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}