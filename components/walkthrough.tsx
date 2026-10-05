"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Monitor, 
  Users, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Maximize2,
  X,
  Volume2
} from 'lucide-react';

export default function HomeWalkthroughSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Slideshow data with YouTube Shorts Walkthrough integration
  const slides = [
    {
      id: 'building',
      badge: 'Campus Building',
      title: 'MITM Sahu Kunj Permanent Campus',
      subtitle: 'Bilari Head Campus HQ • 27+ Years Legacy',
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop',
      desc: 'Spacious, independent campus building with separate labs, airy classrooms, and full security.'
    },
    {
      id: 'office',
      badge: 'Front Office',
      title: 'Administrative & Admission Desk',
      subtitle: 'Inquiry, Student Counseling & Verification Desk',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
      desc: 'Dedicated staff for course guidance, direct admission, and instant document verification.'
    },
    {
      id: 'boys-lab',
      badge: 'Boys IT Lab',
      title: 'Dedicated Practical Computer Lab (Boys)',
      subtitle: '1:1 Computer Ratio for Software & Coding',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
      desc: 'High-speed systems for Python, O Level, Web Designing, DCA & Tally Prime practicals.'
    },
    {
      id: 'girls-lab',
      badge: 'Girls IT Lab',
      title: 'Dedicated Practical Computer Lab (Girls)',
      subtitle: 'Safe, Independent & Distraction-Free Learning Space',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
      desc: 'Separate lab setup ensuring complete comfort, security, and focused guidance for female students.'
    },
    {
      id: 'classroom',
      badge: 'Theory Classes',
      title: 'Spacious Offline Lecture Rooms',
      subtitle: 'Interactive Physical Campus Classes (Hindi & English)',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
      desc: 'Well-ventilated theory rooms with personal attention and bilingual explanations.'
    },
    {
      id: 'accounting',
      badge: 'Tally & Accounting',
      title: 'CPAC & Financial Accounting Workstation',
      subtitle: 'Tally Prime, GST & MS Excel MIS Reporting',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      desc: 'Hands-on practical training on real business vouchers, GST filing, and financial ledgers.'
    }
  ];

  // Auto-play slideshow timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 3000); // 3 seconds per slide
    }
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="bg-[#FAF7F2] py-10 sm:py-14 border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER BADGE & TITLE */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#2D221C] text-[#FAF7F2] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-[#C29B72]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C29B72]" />
            MITM Bilari Head Campus Walkthrough
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black text-[#2D221C] tracking-tight">
            Explore Our Campus <span className="text-[#C29B72] font-extrabold">& Facilities</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed font-medium">
            Watch our official short walkthrough video or auto-slide through our modern computer laboratories, classrooms, and administrative setup.
          </p>
        </div>

        {/* MAIN SLIDESHOW & VIDEO CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: AUTO MOTION SLIDESHOW (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#2D221C] rounded-3xl overflow-hidden shadow-xl border-2 border-[#C29B72]/40 relative group flex flex-col justify-between min-h-[380px] sm:min-h-[440px]">
            
            {/* BACKGROUND SLIDE IMAGE WITH FADE TRANSITION */}
            <div className="absolute inset-0">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D221C] via-[#2D221C]/50 to-transparent"></div>
                </div>
              ))}
            </div>

            {/* SLIDE TOP BAR: CONTROLS & BADGE */}
            <div className="relative z-20 p-5 sm:p-6 flex items-center justify-between">
              <span className="bg-[#C29B72] text-[#2D221C] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                {slides[activeSlide].badge}
              </span>

              <div className="flex items-center gap-2 bg-[#2D221C]/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 text-white hover:text-[#C29B72] transition"
                  title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <span className="text-[11px] font-bold text-[#D8B38A] border-l border-white/20 pl-2">
                  0{activeSlide + 1} / 0{slides.length}
                </span>
              </div>
            </div>

            {/* SLIDE BOTTOM CONTENT & CAPTION */}
            <div className="relative z-20 p-5 sm:p-8 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#C29B72] uppercase tracking-wider">
                  {slides[activeSlide].subtitle}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {slides[activeSlide].title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#D8B38A] max-w-xl leading-relaxed">
                {slides[activeSlide].desc}
              </p>

              {/* SLIDE PROGRESS DOTS & NAV ARROWS */}
              <div className="pt-3 flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeSlide ? 'w-8 bg-[#C29B72]' : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 bg-white/10 hover:bg-[#C29B72] text-white hover:text-[#2D221C] rounded-xl transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 bg-white/10 hover:bg-[#C29B72] text-white hover:text-[#2D221C] rounded-xl transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: LIVE EMBEDDED YOUTUBE SHORTS PLAYER (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8DFC8] shadow-md flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                  <span className="text-xs font-extrabold uppercase text-[#2D221C] tracking-wider">
                    Official Video Tour
                  </span>
                </div>
                <span className="bg-[#FAF5EF] text-[#8C6B42] text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-[#E2D6C5]">
                  YouTube Shorts
                </span>
              </div>

              {/* EMBEDDED SHORTS IFRAME PLAYER */}
              <div className="relative w-full aspect-[9/16] max-h-[360px] sm:max-h-[380px] rounded-2xl overflow-hidden bg-black shadow-inner border border-[#E2D6C5] mx-auto group/v">
                <iframe
                  src="https://www.youtube.com/embed/rAazwG1dyJg?autoplay=0&rel=0&modestbranding=1"
                  title="MITM Campus Walkthrough Short"
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* PLAYER BOTTOM INFO & EXPAND BUTTON */}
            <div className="space-y-3 pt-2 border-t border-[#F2E8D8]">
              <div className="flex items-center justify-between text-xs text-[#6B5A4E]">
                <span className="font-semibold text-[#2D221C]">Manavta Institute (MITM)</span>
                <span className="text-[#8C6B42] font-bold">Bilari HQ</span>
              </div>

              <button
                onClick={() => setShowVideoModal(true)}
                className="w-full py-2.5 bg-[#2D221C] hover:bg-[#8C6B42] text-[#FAF7F2] font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#C29B72]" />
                <span>Watch Fullscreen Walkthrough</span>
              </button>
            </div>

          </div>

        </div>

        {/* QUICK CAMPUS HIGHLIGHT BADGES STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8] flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-[#FAF5EF] text-[#C29B72] rounded-xl border border-[#E2D6C5]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-[#2D221C]">Permanent Campus</p>
              <p className="text-[10px] text-[#7A6B62]">Sahu Kunj, Bilari HQ</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8] flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-[#FAF5EF] text-[#C29B72] rounded-xl border border-[#E2D6C5]">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-[#2D221C]">Separate IT Labs</p>
              <p className="text-[10px] text-[#7A6B62]">1:1 Boys & Girls Setup</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8] flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-[#FAF5EF] text-[#C29B72] rounded-xl border border-[#E2D6C5]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-[#2D221C]">ISO 9001:2015</p>
              <p className="text-[10px] text-[#7A6B62]">Govt. Recognized</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8] flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-[#FAF5EF] text-[#C29B72] rounded-xl border border-[#E2D6C5]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-[#2D221C]">Offline Guidance</p>
              <p className="text-[10px] text-[#7A6B62]">100% Practical Focus</p>
            </div>
          </div>
        </div>

      </div>

      {/* FULLSCREEN YOUTUBE MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-[#2D221C]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#2D221C] rounded-3xl overflow-hidden border-2 border-[#C29B72] max-w-lg w-full shadow-2xl relative">
            <div className="p-4 bg-[#3D2E26] border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#FAF7F2]">MITM Bilari Walkthrough Tour</span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-[9/16] w-full max-h-[70vh] bg-black">
              <iframe
                src="https://www.youtube.com/embed/rAazwG1dyJg?autoplay=1&rel=0"
                title="Full Walkthrough"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
