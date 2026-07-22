import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-bg pt-20"
    >
      {/* ── DESKTOP LAYOUT ── */}
      <div className="absolute inset-0 hidden md:flex items-center justify-end z-0 pointer-events-none">
        <motion.div
          className="w-[500px] lg:w-[650px] xl:w-[750px] 2xl:w-[850px] -mr-24 lg:-mr-32 xl:-mr-48"
          style={{ y: heroY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img
            src="/logo.png"
            alt="Quizzinga Logo"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center md:items-center">
        {/* Desktop Heading (Hidden on Mobile) */}
        <motion.div
          className="hidden md:block text-hero text-fg relative z-30 pointer-events-auto text-left"
          style={{ y: heroY }}
        >
          <div className="overflow-hidden pb-4">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              QUIZZINGA
            </motion.span>
          </div>
          <div className="overflow-hidden pb-4">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              KIET
              <motion.span
                className="inline-block text-accent"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
              >
                .
              </motion.span>
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* ── MOBILE LAYOUT (True Overlap) ── */}
      <div className="absolute inset-0 md:hidden flex items-center justify-center pointer-events-none mt-20">
        <motion.div
          className="w-full h-full flex items-center justify-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative w-full max-w-[400px]">
            {/* Background Image */}
            <img
              src="/logo.png"
              alt="Quizzinga Logo Background"
              className="w-full h-auto object-contain opacity-70 drop-shadow-[0_0_50px_rgba(90,69,255,0.4)]"
            />
            
            {/* Text Overlay exactly on top */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <span className="text-[12vw] sm:text-[4rem] font-black uppercase text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)', lineHeight: 0.9 }}>
                QUIZZINGA
              </span>
              <span className="text-[12vw] sm:text-[4rem] font-black uppercase text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)', lineHeight: 0.9 }}>
                KIET<span className="text-accent">.</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;