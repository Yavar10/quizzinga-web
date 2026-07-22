import React from 'react';

const CREW = [
  {
    name: 'ELIAS THORN',
    role: 'FOUNDER & PRESIDENT',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'MAYA LIN',
    role: 'HEAD OF RESEARCH',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'JULIAN REED',
    role: 'CHIEF QUIZMASTER',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'SOFIA VEGA',
    role: 'OPERATIONS LEAD',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  },
];

const Crew = () => {
  return (
    <section id="crew" className="relative w-full bg-[#050505] py-24 md:py-32 border-t border-white/5 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-[#5A45FF] text-[0.7rem] md:text-sm tracking-[0.3em] font-bold uppercase font-mono mb-6">
              03 — THE MINDS
            </p>
            <h2 className="text-white text-5xl md:text-8xl font-black tracking-tighter uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Crew
            </h2>
          </div>
          <p className="text-white/40 text-sm md:text-base font-sans max-w-sm leading-relaxed">
            The architects behind the arena. We design the questions that break minds and build champions.
          </p>
        </div>

        {/* Crew Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {CREW.map((member, i) => (
            <div key={i} className="group relative flex flex-col cursor-pointer">
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden mb-6 bg-white/5 rounded-sm">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                />
                
                {/* Hover overlay border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#5A45FF] transition-colors duration-500 z-10 pointer-events-none"></div>
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight uppercase group-hover:text-[#5A45FF] transition-colors duration-500" style={{ fontFamily: 'var(--font-sans)' }}>
                  {member.name}
                </h3>
                <p className="text-white/40 text-[0.65rem] md:text-xs tracking-[0.2em] uppercase font-mono mt-2">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Crew;
