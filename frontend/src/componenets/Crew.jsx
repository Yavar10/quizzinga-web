import {
  ArrowUpRight,
  Globe,
  Sparkles
} from "lucide-react";

const TEAM = {
  head: {
    name: "Keshav Gopalka",
    role: "Quizzing Head",
    image:
      "https://res.cloudinary.com/etel6ymb/image/upload/v1784746116/file_0000000088b471faa3a3f011dbb64d00_rm318q.png",
  },

  tech: {
    name: "Mohd Yavar",
    role: "Technical Head",
    image: "/yav.jpeg",
  },

  admin: {
    name: "Nitin Pandey",
    role: "Administrative Head",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
  },

  graphics: {
    name: "Yuvraj Patel",
    role: "Graphics Lead",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=1200&auto=format&fit=crop",
  },

  pr: [
    {
      name: "Arush Gupta",
      role: "PR Lead",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Shorya Mittal",
      role: "PR Lead",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  events: [
    {
      name: "Aditya Upadhyay",
      role: "Events Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Suryansh Dwivedi",
      role: "Events Lead",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  operations: [
    {
      name: "Adarsh Singh",
      role: "Operations Lead",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Akhil Yadav",
      role: "Operations Lead",
      image: "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};

export default function Crew() {
  return (
    <section
      id="crew"
      className="relative bg-black py-32 border-t border-white/10 overflow-hidden"
    >
      {/* Background */}

      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
        <div className="absolute top-1/2 left-0 h-px w-full bg-white" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">

          <div>

            <p className="text-[#5A45FF] text-xs uppercase tracking-[0.35em] mb-5">
              03 — THE CREW
            </p>

            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tight">
              Crew
            </h2>

          </div>

          <p className="text-white/45 max-w-sm leading-relaxed">
            Every quiz begins with this team. Strategy, creativity,
            logistics and technology working together.
          </p>

        </div>

        {/* ========================= */}

        <div className="grid grid-cols-12 auto-rows-[140px] gap-5">

          {/* Row 1 */}
          {/* HEAD */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 relative group">
            <img
              src={TEAM.head.image}
              alt={TEAM.head.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
              <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                {TEAM.head.role}
              </p>
              <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                {TEAM.head.name}
              </h3>
            </div>
          </div>

          {/* Quote */}
          <div className="col-span-12 lg:col-span-6 row-span-3 rounded-[30px] border border-white/10 bg-white/5 p-10 flex flex-col justify-between">
            <span className="uppercase tracking-[0.3em] text-xs text-white/40">
              Editorial Note
            </span>
            <blockquote className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight">
              Not just a quiz club.
              <br />
              A culture of
              <span className="text-[#5A45FF]"> curiosity.</span>
            </blockquote>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/35">
              <span>Quizzinga</span>
              <span>Knowledge First</span>
            </div>
          </div>

          {/* Manifesto */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] bg-[#5A45FF] p-8 flex flex-col justify-between">
            <Sparkles size={26} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">
                Philosophy
              </p>
              <h3 className="text-3xl font-black uppercase leading-tight">
                Curiosity
                <br />
                Wins.
              </h3>
            </div>
          </div>

          {/* Row 2 */}
          {/* EVENTS */}
          <div className="col-span-12 lg:col-span-6 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 flex flex-col md:flex-row relative">
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
              <img
                src={TEAM.events[0].image}
                alt={TEAM.events[0].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                  {TEAM.events[0].role}
                </p>
                <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                  {TEAM.events[0].name}
                </h3>
              </div>
            </div>
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden">
              <img
                src={TEAM.events[1].image}
                alt={TEAM.events[1].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                  {TEAM.events[1].role}
                </p>
                <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                  {TEAM.events[1].name}
                </h3>
              </div>
            </div>
          </div>

          {/* TECH */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 relative group">
            <img
              src={TEAM.tech.image}
              alt={TEAM.tech.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
              <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                {TEAM.tech.role}
              </p>
              <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                {TEAM.tech.name}
              </h3>
            </div>
          </div>

          {/* Decorative */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] border border-white/10 bg-white/5 p-8 flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                QZ
              </span>
              <ArrowUpRight />
            </div>
            <div className="flex justify-center flex-grow items-center">
              <Globe
                size={110}
                className="text-[#5A45FF]"
                strokeWidth={1}
              />
            </div>
          </div>

          {/* Row 3 */}
          {/* Bottom Left */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] bg-[#5A45FF] p-8 flex flex-col justify-between">
            <span className="uppercase tracking-[0.3em] text-xs opacity-80">
              Since 2024
            </span>
            <div>
              <h2 className="text-7xl lg:text-8xl font-black leading-none">
                Q.
              </h2>
              <p className="mt-4 uppercase tracking-[0.3em] text-xs">
                Knowledge • Curiosity • Community
              </p>
            </div>
          </div>

          {/* PR */}
          <div className="col-span-12 lg:col-span-6 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 flex flex-col md:flex-row relative">
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
              <img
                src={TEAM.pr[0].image}
                alt={TEAM.pr[0].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                  {TEAM.pr[0].role}
                </p>
                <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                  {TEAM.pr[0].name}
                </h3>
              </div>
            </div>
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden">
              <img
                src={TEAM.pr[1].image}
                alt={TEAM.pr[1].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                  {TEAM.pr[1].role}
                </p>
                <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                  {TEAM.pr[1].name}
                </h3>
              </div>
            </div>
          </div>

          {/* ADMIN */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 relative group">
            <img
              src={TEAM.admin.image}
              alt={TEAM.admin.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
              <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                {TEAM.admin.role}
              </p>
              <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                {TEAM.admin.name}
              </h3>
            </div>
          </div>

          {/* Row 4 */}
          {/* Decorative 2 */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute h-52 w-52 rounded-full border border-[#5A45FF]/30" />
              <div className="absolute h-40 w-40 rounded-full border border-white/10" />
              <div className="absolute h-28 w-28 rounded-full border border-[#5A45FF]/20" />
              <Globe
                size={72}
                strokeWidth={1}
                className="text-[#5A45FF]"
              />
            </div>
            <div className="absolute left-8 top-8 text-xs uppercase tracking-[0.3em] text-white/40">
              Archive
            </div>
            <div className="absolute bottom-8 right-8 text-5xl font-black text-white/10">
              24
            </div>
          </div>

          {/* OPERATIONS */}
          <div className="col-span-12 lg:col-span-6 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 flex flex-col md:flex-row relative">
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
              <img
                src={TEAM.operations[0].image}
                alt={TEAM.operations[0].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                  {TEAM.operations[0].role}
                </p>
                <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                  {TEAM.operations[0].name}
                </h3>
              </div>
            </div>
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden">
              <img
                src={TEAM.operations[1].image}
                alt={TEAM.operations[1].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                  {TEAM.operations[1].role}
                </p>
                <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                  {TEAM.operations[1].name}
                </h3>
              </div>
            </div>
          </div>

          {/* GRAPHICS */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-3 rounded-[30px] overflow-hidden border border-white/10 bg-white/5 relative group">
            <img
              src={TEAM.graphics.image}
              alt={TEAM.graphics.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
              <p className="text-[#5A45FF] uppercase text-xs tracking-[0.3em] mb-2 drop-shadow-md">
                {TEAM.graphics.role}
              </p>
              <h3 className="text-3xl font-black uppercase leading-none drop-shadow-lg">
                {TEAM.graphics.name}
              </h3>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}