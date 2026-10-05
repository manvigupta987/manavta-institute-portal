"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Target, 
  HeartHandshake, 
  ArrowRight, 
  Briefcase, 
  Languages, 
  Compass,
  Check,
  Users,
  Image as ImageIcon
} from 'lucide-react';

export default function AboutPage() {
  const timelineMilestones = [
    {
      year: '1998',
      title: 'Foundation of Institute',
      desc: 'Established under "All India Manavta Computer Education and Welfare Society" (Regd. Govt. of India, July 2001) to impart quality computer education and spread IT literacy.',
      badge: 'Establishment'
    },
    {
      year: '2003',
      title: 'Hardware Engineering Addition',
      desc: 'Added hardware engineering courses to software diploma curricula, equipping students with essential system assembly and repair skills.',
      badge: 'Curriculum Growth'
    },
    {
      year: '2007',
      title: 'Permanent Building at Sahu Kunj',
      desc: 'Shifted into its own dedicated campus building at Sahu Kunj, Hukumat Nagar, Bilari to provide spacious, well-ventilated classrooms and independent labs.',
      badge: 'Campus Milestone'
    },
    {
      year: '2008',
      title: 'SITD Knowledge Center (ISO 9001-2000)',
      desc: 'Became an authorized certified knowledge center of Society for Information Technology Development (SITD), Lucknow — an ISO 9001-2000 certified organisation.',
      badge: 'ISO Quality Seal'
    },
    {
      year: '2009',
      title: 'British School of Languages Franchise',
      desc: 'Added franchisee branch of British School of Languages (MBD) TM in May 2009 to provide mandatory English communication and personality development training.',
      badge: 'Communication Skills'
    },
    {
      year: 'Present',
      title: 'Manavta Institute of Tech. & Management (MITM)',
      desc: 'Renamed and expanded as MITM, offering comprehensive Diplomas, IT, Management programs, and NIELIT courses with 27+ years of institutional trust.',
      badge: 'Institutional Legacy'
    }
  ];

  const corePillars = [
    {
      title: 'Bridge Skilled Manpower Deficiency',
      desc: 'Training manpower to overcome the shortage of skilled workforce in India through hands-on technical software and accounting education.',
      icon: Briefcase
    },
    {
      title: 'Character & Personality Building',
      desc: 'Equal importance given to character building, personality development, and communication skills to excel in career and become worthy citizens.',
      icon: HeartHandshake
    },
    {
      title: 'Dedicated Placement Cell',
      desc: 'Salient feature assisting eligible students to be placed in various fields and sectors throughout India.',
      icon: Target
    },
    {
      title: 'Bilingual & Accessible Learning',
      desc: 'Mandatory emphasis on English communication skills alongside explanations in simple Hindi for students from all backgrounds.',
      icon: Languages
    }
  ];

  const campusPhotos = [
    {
      title: 'Main Campus Building',
      subtitle: 'Sahu Kunj, Hukumat Nagar, Bilari Head HQ',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
      badge: 'Permanent Campus'
    },
    {
      title: 'High-Tech Computer Labs',
      subtitle: '1:1 Computer allocation for male and female students',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
      badge: 'Separate Labs'
    },
    {
      title: 'Spacious & Airy Classrooms',
      subtitle: 'Distraction-free, ergonomic academic environment',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
      badge: 'Physical Offline Classes'
    },
    {
      title: 'Annual Certification Ceremony',
      subtitle: 'Recognizing student achievements & government credentials',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
      badge: '10,000+ Alumni'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D221C] font-sans selection:bg-[#C29B72]/20">
      
      {/* HEADER SECTION WITH SLATE-200 BACKGROUND */}
      <div className="relative bg-[#2D221C] text-[#FAF7F2] py-14 sm:py-20 px-4 text-center relative overflow-hidden border-b-4 border-[#C29B72]" >
        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-[#C29B72]/20 text-[#D8B38A] border border-[#C29B72]/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition hover:scale-105 duration-300">
            <Sparkles className="w-4 h-4 text-[#D8B38A]" />
            Manavta Institute of Technology & Management (MITM)
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            About Our <span className="text-white">Institute & 27+ Years Legacy</span>
          </h1>

          <p className="text-[#E2D8CD] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium italic">
            &quot;An Organization is a union of ordinary people doing extra-ordinary work.&quot;
          </p>

          {/* QUICK BADGES */}
          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-300 text-black shadow-sm transition hover:-translate-y-0.5 duration-300">
              <Calendar className="w-4 h-4 text-[#C29B72]" /> Established 1998 (27+ Years)
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-300 text-black shadow-sm transition hover:-translate-y-0.5 duration-300">
              <ShieldCheck className="w-4 h-4 text-[#C29B72]" /> ISO 9001-2000 Certified
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-300 text-black shadow-sm transition hover:-translate-y-0.5 duration-300">
              <Building2 className="w-4 h-4 text-[#C29B72]" /> Govt. Regd. Society (July 2001)
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-300 text-black shadow-sm transition hover:-translate-y-0.5 duration-300">
              <MapPin className="w-4 h-4 text-[#C29B72]" /> Sahu Kunj, Bilari Head Campus
            </span>
          </div>

        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* SECTION 1: EMERSON'S INSPIRATION & ABOUT STORY WITH LARGE LANDSCAPE PHOTO */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E8DFC8] space-y-8 transition hover:shadow-md duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#FAF5EF] text-[#8C6B42] border border-[#E2D6C5] text-xs font-bold px-3 py-1 rounded-full">
                <Compass className="w-4 h-4 text-[#C29B72]" /> Institutional Vision & Quality
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D221C]">
                Delivering Superior Value, Cost Utility & Quality
              </h2>

              <div className="p-4 bg-[#FAF7F2] rounded-2xl border-l-4 border-[#C29B72] text-xs sm:text-sm text-[#5C4D43] italic leading-relaxed shadow-inner">
                &quot;If a man writes a better book, preaches a better sermon, or makes a better mouse trap than his neighbour though his house in the woods, the world will make a beaten path to his door.&quot; — <span className="font-bold text-[#2D221C] not-italic">Emerson</span>
              </div>

              <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed">
                Proving this, the ringing bells of <strong className="text-[#2D221C]">Manavta</strong> are being heard in every nook and corner of the area as the institute performs better than others in terms of value, cost utility, and quality. Founded in <strong className="text-[#2D221C]">1998</strong> under <strong className="text-[#2D221C]">All India Manavta Computer Education and Welfare Society</strong> (registered by Govt. of India in July 2001), the institute has grown from strength to strength.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3.5 bg-[#FAF5EF] rounded-2xl border border-[#E8DFC8] transition hover:bg-[#F5EFE6] duration-300">
                  <Check className="w-4 h-4 text-[#C29B72] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D221C]">100% Practical & Offline Focus</h4>
                    <p className="text-[11px] text-[#7A6B62]">Daily hands-on practical skills in dedicated labs with 1:1 computer ratio.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-[#FAF5EF] rounded-2xl border border-[#E8DFC8] transition hover:bg-[#F5EFE6] duration-300">
                  <Check className="w-4 h-4 text-[#C29B72] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D221C]">English & Personality Development</h4>
                    <p className="text-[11px] text-[#7A6B62]">Franchisee of British School of Languages (MBD) TM for effective communication.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LARGE HERO PHOTO CARD */}
            <div className="lg:col-span-5 relative group overflow-hidden rounded-3xl border border-[#E8DFC8] shadow-md">
              <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200" 
                  alt="MITM Bilari Head Campus" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur text-[#2D221C] text-[11px] font-extrabold px-3 py-1 rounded-full border border-white/40 shadow-sm flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#C29B72]" /> MITM Bilari Head HQ
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <h3 className="text-lg font-black tracking-tight text-white">Sahu Kunj Permanent Campus</h3>
                  <p className="text-xs text-slate-200 font-medium leading-snug">
                    Spacious non-AC classrooms, separate labs for boys & girls, and dedicated on-campus parking.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 2: LARGE MITM CAMPUS PHOTO GALLERY */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E8DFC8] pb-4">
            <div>
              <span className="bg-[#F5EFE6] text-[#8C6B42] border border-[#E2D6C5] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#C29B72]" /> Campus Visual Tour
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D221C]">Life at MITM Campus & Facilities</h2>
            </div>
            <p className="text-xs text-[#7A6B62] max-w-md">
              State-of-the-art infrastructure designed to foster a disciplined, comfortable, and career-oriented learning environment.
            </p>
          </div>

          {/* LARGE PHOTO GRID WITH ANIMATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campusPhotos.map((photo, idx) => (
              <div 
                key={idx}
                className="group bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                  <img 
                    src={photo.image} 
                    alt={photo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur text-[#2D221C] text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/50 shadow-sm">
                      {photo.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-base font-extrabold text-white group-hover:text-[#F5EFE6] transition-colors">{photo.title}</h3>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">{photo.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: MILESTONE TIMELINE (1998 TO PRESENT) */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="bg-[#F5EFE6] text-[#8C6B42] border border-[#E2D6C5] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D221C]">27+ Years Timeline & Key Milestones</h2>
            <p className="text-xs sm:text-sm text-[#7A6B62]">
              From a pioneer computer education society in 1998 to an ISO certified institute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timelineMilestones.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#C29B72]/40 group-hover:bg-[#C29B72] transition-colors"></div>
                
                <div className="flex items-center justify-between pt-1">
                  <span className="text-2xl font-black text-[#C29B72]">{item.year}</span>
                  <span className="bg-[#FAF5EF] text-[#3D2E26] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#E2D6C5]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-[#2D221C] text-base group-hover:text-[#8C6B42] transition-colors">{item.title}</h3>
                <p className="text-xs text-[#6B5A4E] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CORE PILLARS OF MITM */}
        <div className="bg-[#F5EFE6] rounded-3xl p-8 sm:p-10 border border-[#E2D6C5] space-y-8 shadow-inner">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D221C]">Our Core Institutional Pillars</h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E]">
              What sets Manavta Institute apart as the most trusted computer learning center in Bilari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {corePillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-5 border border-[#E8DFC8] space-y-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="p-3 bg-[#FAF5EF] text-[#C29B72] w-fit rounded-xl border border-[#E2D6C5] group-hover:bg-[#C29B72] group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-[#2D221C] text-sm group-hover:text-[#8C6B42] transition-colors">{pillar.title}</h3>
                  <p className="text-xs text-[#6B5A4E] leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: CALL TO ACTION BANNER */}
        <div className="bg-[#2D221C] rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 bg-[#C29B72]/40 text-[#D8B38A] border border-[#C29B72]/40 border border-slate-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-[#D8B38A]" /> Join The MITM Family
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Build Your Career in IT & Computers?
          </h2>
          
          <p className="text-[#E2D8CD] text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Visit our Bilari Head Campus, meet our expert faculty, and enroll in government-recognized diploma and computer courses today.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/enroll-now"
              className="px-6 py-3 bg-[#8C6B42] text-white font-black rounded-2xl text-xs shadow transition flex items-center gap-2"
            >
              Enroll Online Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/coordinator-message"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-xs border border-slate-300 transition flex items-center gap-2"
            >
              Director & Coordinator Message
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
