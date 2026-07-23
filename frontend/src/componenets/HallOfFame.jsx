import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHAMPIONS = [
  {
    id: 1,
    name: "ALEX MERCER",
    title: "THE ARCHITECT",
    year: "2023",
    image:
      "https://i.pinimg.com/736x/6b/c1/9c/6bc19ccc6970927c6f64cb629b063bea.jpg",
    stats: "WINNER — NEO-TOKYO REGIONALS",
  },
  {
    id: 2,
    name: "SARAH CHEN",
    title: "THE ORACLE",
    year: "2023",
    image:
      "https://i.pinimg.com/736x/e5/d2/44/e5d2447d699dddb52d12f974ff43e0a1.jpg",
    stats: "CHAMPION — BERLIN SUMMIT",
  },
  {
    id: 3,
    name: "MARCUS VANCE",
    title: "THE TACTICIAN",
    year: "2024",
    image:
      "https://i.pinimg.com/736x/52/da/35/52da35ddfb867f62f07eb942a64056aa.jpg",
    stats: "WINNER — NYC GRID FINALS",
  },
];

export default function HallOfFame() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeMobile, setActiveMobile] = useState(0);

  return (
    <section
      id="hall-of-fame"
      className="relative overflow-hidden bg-[#050505] py-24 md:py-48"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* ================= HEADER ================= */}

        <div className="mb-16 md:mb-32">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.35em] text-[#5A45FF]">
            01 — LEGENDS
          </p>

          <h2
            className="text-5xl font-black uppercase tracking-tight text-white md:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hall of Fame
          </h2>
        </div>

        {/* =======================================================
            DESKTOP
        ======================================================= */}

        <div className="hidden md:block">
          <div className="border-t border-white/10">
            {CHAMPIONS.map((champ, index) => (
              <div
                key={champ.id}
                className="group relative flex cursor-pointer items-center justify-between border-b border-white/10 py-16"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                        rotate: -5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.85,
                        rotate: 5,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-1/2 top-1/2 z-0 h-[300px] w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm"
                    >
                      <img
                        src={champ.image}
                        alt={champ.name}
                        className="h-full w-full object-cover grayscale opacity-80"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  <h3
                    className="text-6xl font-black uppercase tracking-tight text-white transition-colors duration-500 group-hover:text-[#5A45FF]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {champ.name}
                  </h3>

                  <p className="mt-3 font-mono text-sm uppercase tracking-[0.22em] text-white/45">
                    {champ.title}
                  </p>
                </div>

                <div className="relative z-10 text-right">
                  <p className="font-mono text-sm uppercase tracking-[0.18em] text-white/60">
                    {champ.stats}
                  </p>

                  <p
                    className="mt-4 text-5xl font-black text-white/20 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    '{champ.year.slice(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =======================================================
            MOBILE
        ======================================================= */}

        <div className="md:hidden">
          {/* Sticky Exhibition */}

          <div className="sticky top-20 z-30">
            <div className="relative overflow-hidden border-y border-white/10 bg-black">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeMobile}
                  src={CHAMPIONS[activeMobile].image}
                  initial={{
                    opacity: 0,
                    scale: 1.08,
                  }}
                  animate={{
                    opacity: 0.8,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.55,
                  }}
                  className="h-[42vh] w-full object-cover grayscale"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/10 to-transparent" />

              <motion.div
                key={activeMobile + "year"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 top-2 text-[8rem] font-black leading-none text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {CHAMPIONS[activeMobile].year}
              </motion.div>

              <div className="absolute bottom-6 left-6">
                <motion.p
                  key={activeMobile + "title"}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: .3 }}
                  className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#5A45FF]"
                >
                  {CHAMPIONS[activeMobile].title}
                </motion.p>

                <motion.h3
                  key={activeMobile + "name"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: .35 }}
                  className="mt-2 text-4xl font-black uppercase leading-none text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {CHAMPIONS[activeMobile].name}
                </motion.h3>
              </div>
            </div>
          </div>

          {/* Exhibition List */}

          <div className="pt-12">
            {CHAMPIONS.map((champ, index) => (
              <button
                key={champ.id}
                onClick={() => setActiveMobile(index)}
                className="group relative block w-full border-b border-white/10 py-10 text-left"
              >
                <motion.div
                  animate={{
                    opacity: activeMobile === index ? 1 : 0.22,
                    x: activeMobile === index ? 14 : 0,
                  }}
                  transition={{
                    duration: .35,
                  }}
                >
                  <div
                    className="text-[16vw] font-black uppercase leading-[0.82] tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {champ.name.split(" ").map((word) => (
                      <div key={word}>{word}</div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {activeMobile === index && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        transition={{
                          duration: .3,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 flex items-end justify-between">
                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
                              {champ.stats}
                            </p>                            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#5A45FF]">
                              {champ.title}
                            </p>
                          </div>

                          <div
                            className="text-5xl font-black text-white/10"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            '{champ.year.slice(2)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
            ))}
          </div>

          {/* Footer Indicator */}

          <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">
              TAP A LEGEND
            </p>

            <div className="flex gap-2">
              {CHAMPIONS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: activeMobile === i ? 36 : 12,
                    opacity: activeMobile === i ? 1 : 0.25,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="h-[2px] bg-[#5A45FF]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}