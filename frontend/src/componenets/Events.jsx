import React from 'react';
import { motion } from 'framer-motion';

const EVENTS = [
  {
    id: 1,
    date: '24 OCT',
    status: 'UPCOMING',
    title: 'THE PROVING GROUNDS',
    location: 'MAIN AUDITORIUM',
    description: 'The ultimate test of wits. Open to all years. Cash prize pool.',
  },
  {
    id: 2,
    date: '15 NOV',
    status: 'REGISTRATION OPEN',
    title: 'TECH TRIVIA NIGHT',
    location: 'CS BLOCK',
    description: 'A deep dive into tech history, silicon valley lore, and coding trivia.',
  },
  {
    id: 3,
    date: '02 DEC',
    status: 'ANNOUNCED',
    title: 'THE ARENA FINALS',
    location: 'MAIN STAGE',
    description: 'The year-end championship. Only the top 10 qualifiers advance.',
  },
];

const Events = () => {
  return (
    <section id="events" className="relative w-full bg-[#050505] py-24 md:py-32 border-t border-white/5">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <p className="text-[#5A45FF] text-[0.7rem] md:text-sm tracking-[0.3em] font-bold uppercase font-mono mb-6">
            02 — CALENDAR
          </p>
          <h2 className="text-white text-5xl md:text-8xl font-black tracking-tighter uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Events
          </h2>
        </div>

        {/* Events List */}
        <div className="flex flex-col border-t border-white/10">
          {EVENTS.map((evt) => (
            <div 
              key={evt.id} 
              className="group relative flex flex-col lg:flex-row lg:items-center py-12 md:py-16 border-b border-white/10 hover:bg-[#5A45FF]/5 transition-colors duration-500 cursor-pointer -mx-6 px-6 md:-mx-12 md:px-12"
            >
              
              {/* Date Block */}
              <div className="w-full lg:w-1/3 flex flex-col mb-8 lg:mb-0">
                <span className="text-[#5A45FF] text-xs tracking-[0.2em] font-bold font-mono mb-4 uppercase">
                  {evt.status}
                </span>
                <span className="text-white text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  {evt.date.split(' ')[0]}<br/>
                  <span className="text-white/40">{evt.date.split(' ')[1]}</span>
                </span>
              </div>

              {/* Details Block */}
              <div className="w-full lg:w-2/3 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col flex-1">
                  <h3 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-4 uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
                    {evt.title}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed font-sans max-w-md mb-6">
                    {evt.description}
                  </p>
                  <span className="text-white/30 text-xs tracking-[0.2em] font-mono uppercase">
                    📍 {evt.location}
                  </span>
                </div>

                {/* Arrow CTA */}
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#5A45FF] group-hover:border-[#5A45FF] transition-all duration-500">
                  <svg 
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" 
                    className="text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
