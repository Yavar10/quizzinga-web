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
      {/* Right Side: Big Logo Background - Now relative to the full screen edge */}
      <div className="absolute inset-0 flex items-center justify-end z-0 pointer-events-none">
        <motion.div 
          className="w-[250px] md:w-[500px] lg:w-[650px] xl:w-[750px] 2xl:w-[850px] -mr-12 md:-mr-24 lg:-mr-32 xl:-mr-48"
          style={{ y: heroY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* The image is slightly smaller and aligned to the viewport's right edge */}
          <img 
            src="/logo.png" 
            alt="Quizzinga Logo" 
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center">
        
        {/* Left Side: Heading */}
        <motion.div className="text-hero text-fg relative z-20 pointer-events-auto" style={{ y: heroY }}>
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
    </section>
  );
};

export default Hero;