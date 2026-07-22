import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ children, direction = 'left', speed = 20, className = '' }) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex items-center"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          x: { repeat: Infinity, repeatType: 'loop', duration: speed, ease: 'linear' },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

const BandContent = ({ items }) => (
  <>
    {items.map((text, i) => (
      <span
        key={i}
        className="inline-flex items-center shrink-0 px-2 md:px-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span className="font-black tracking-tight uppercase italic">{text}</span>
      </span>
    ))}
  </>
);

const BAND = [
  'THE WORLD TOUR OF INTELLECT •', 'QUIZZINGA',
  'THE WORLD TOUR OF INTELLECT •', 'QUIZZINGA',
  'THE WORLD TOUR OF INTELLECT •', 'QUIZZINGA',
];

const SOCIALS = [
  { label: 'X', href: '#' },
  { label: 'IN', href: '#' },
  { label: 'IG', href: '#' },
];

const WHAT_WE_DO = [
  { label: 'QUIZZES', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m0 5h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /> },
  { label: 'COMPETITIONS', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 4h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16m-10-7.34V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22m4-7.34V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /> },
  { label: 'COMMUNITY', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-14a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /> },
  { label: 'KNOWLEDGE', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /> },
];

const Footer = () => {
  const bandFontSize = 'clamp(2rem, 5.5vw, 5.5rem)';

  return (
    <footer className="relative w-full bg-[#050505] overflow-hidden select-none pt-24 md:pt-32">
      
      {/* ── THE OLD MARQUEE (CRISSCROSS BANDS) ── */}
      <div className="relative overflow-hidden w-full mb-24 md:mb-40">
        <div
          className="relative"
          style={{ height: 'clamp(120px, 18vw, 240px)' }}
        >
          <div className="absolute inset-0 bg-[#050505]" />
          
          {/* Band 1 — behind, rotated clockwise */}
          <div
            className="absolute z-10"
            style={{ width: '150%', left: '-25%', top: '5%', transform: 'rotate(2.5deg)' }}
          >
            <div
              className="bg-white w-full py-1 md:py-2"
              style={{ fontSize: bandFontSize, lineHeight: 1.1 }}
            >
              <Marquee direction="left" speed={25} className="text-[#050505]">
                <BandContent items={BAND} />
              </Marquee>
            </div>
          </div>

          {/* Band 2 — in front, rotated counter-clockwise */}
          <div
            className="absolute z-20"
            style={{ width: '150%', left: '-25%', top: '0%', transform: 'rotate(-2.5deg)' }}
          >
            <div
              className="bg-[#5A45FF] w-full py-1 md:py-2"
              style={{
                fontSize: bandFontSize,
                lineHeight: 1.1,
                boxShadow: '0 4px 30px rgba(90, 69, 255, 0.4)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Marquee direction="right" speed={30} className="text-white">
                <BandContent items={BAND} />
              </Marquee>
            </div>
          </div>
        </div>
      </div>

      {/* ── THE IN-BETWEEN (PREMIUM EDITORIAL GRID) ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 pb-20 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-20 lg:gap-x-12 lg:gap-y-0">
          
          {/* Column 1: Logo & Tagline */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-transparent">
                <span className="text-white text-xl md:text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Q</span>
              </div>
              <h2 className="text-white text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                QUIZZINGA
              </h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 font-sans">
              Pushing minds.<br/>
              One question at a time.
            </p>
            <p className="text-[#5A45FF] text-[0.65rem] tracking-[0.2em] font-bold uppercase font-mono mt-auto">
              THE QUIZ CLUB OF KIET
            </p>
          </div>

          {/* Column 2: About Us */}
          <div className="flex flex-col">
            <p className="text-white/30 text-[0.65rem] tracking-[0.2em] uppercase font-bold font-mono mb-8">
              ABOUT US
            </p>
            <h4 className="text-white text-xl font-bold tracking-tight mb-4 uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
              QUIZZINGA KIET
            </h4>
            <p className="text-white/50 text-sm leading-relaxed mb-12 font-sans">
              The official quiz club of KIET Group of Institutions. We are dedicated to fostering a community of intellectual growth and fierce competition.
            </p>
            <p className="text-[#5A45FF] text-[0.65rem] tracking-[0.2em] uppercase font-bold font-mono mt-auto">
              EST. 20XX
            </p>
          </div>

          {/* Column 3: What We Do */}
          <div className="flex flex-col">
            <p className="text-white/30 text-[0.65rem] tracking-[0.2em] uppercase font-bold font-mono mb-8">
              WHAT WE DO
            </p>
            <ul className="space-y-5">
              {WHAT_WE_DO.map((item, idx) => (
                <li key={idx} className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-[#050505] transition-all duration-300 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      {item.icon}
                    </svg>
                  </div>
                  <span className="text-white/70 text-[0.75rem] font-bold tracking-[0.15em] uppercase group-hover:text-white transition-colors duration-300" style={{ fontFamily: 'var(--font-sans)' }}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Join The Arena */}
          <div className="flex flex-col">
            <p className="text-white/30 text-[0.65rem] tracking-[0.2em] uppercase font-bold font-mono mb-8">
              JOIN THE ARENA
            </p>
            <h4 className="text-white text-xl font-bold tracking-tight mb-4 uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
              Membership
            </h4>
            <p className="text-white/50 text-sm leading-relaxed mb-10 font-sans">
              Step into the arena. Become a part of something bigger.
            </p>
            
            <a href="#join" className="w-fit border-b border-white pb-1 text-white text-[0.7rem] font-bold tracking-[0.2em] uppercase hover:text-[#5A45FF] hover:border-[#5A45FF] transition-all duration-300 mb-12">
              Enter Arena
            </a>
            
            <div className="flex items-center gap-4 mt-auto">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[0.65rem] font-bold tracking-[0.2em] text-white/50 hover:bg-white hover:text-[#050505] transition-all duration-300 font-mono shrink-0"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BIG QUIZZINGA TEXT ── */}
      <div className="w-full overflow-hidden flex justify-center pb-12 relative z-0 pointer-events-none opacity-20">
        <h1 
          className="text-[20vw] font-black leading-none tracking-tighter text-white whitespace-nowrap select-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          QUIZZINGA
        </h1>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-20 border-t border-white/[0.05] bg-[#050505]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[0.6rem] tracking-[0.15em] uppercase text-white/30 font-bold font-mono">
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies Preferences</a>
          </div>
          <span className="text-white/20">© 2024 QUIZZINGA</span>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
