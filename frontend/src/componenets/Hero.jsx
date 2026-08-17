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
      className="relative min-h-screen flex items-center overflow-hidden bg-bg pt-20 mt-24 md:mt-28 rounded-t-3xl md:rounded-t-[3rem]"
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
            src="https://res.cloudinary.com/etel6ymb/image/upload/v1786958058/logo_v0vwfx.png"
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
      <div className="absolute inset-0 md:hidden pointer-events-none">
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img
            src="/logo.png"
            alt="Quizzinga poster"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-x-0 top-8 z-10 px-3 text-left">
            <span className="block text-[12vw] font-black uppercase leading-[0.88] tracking-tight text-white">
              QUIZZINGA
            </span>
            <span className="block text-[12vw] font-black uppercase leading-[0.88] tracking-tight text-white">
              KIET<span className="text-accent">.</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;