"use client"; // Interactive actions (click, slides change) ke liye

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import InfiniteMarquee from '@/components/infinitegallery';
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{count}</span>;

  
}

export default function HomePage() {
  // 1. Aapki photos ki list (Abhi ke liye hamare paas /boy.jpeg hai, aap isme aur images add kar sakti hain)
  const images = [
    "/boy.jpeg", // Photo 1
    "/boy.jpeg", // Photo 2 (Jab aap public folder mein nayi photo dalein, toh uska naam yahan likhein)
    "/boy.jpeg", // Photo 3
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Agli (Next) photo par jaane ka function
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Pichli (Prev) photo par jaane ka function
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* 📸 SECTION 1: PURE PHOTO SLIDER (No Text Overlays, Just Images) */}
      <div className="relative w-full h-[300px] md:h-[500px] bg-slate-100 overflow-hidden group border-b border-slate-150">
        
        {/* Main Sliding Image */}
        <img 
          src={images[currentIndex]} 
          alt={`Manavta Slide ${currentIndex + 1}`} 
          className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        />

        {/* ◀️ LEFT ARROW BUTTON */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-sky-600 hover:scale-110 text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-200 cursor-pointer z-10 text-sm font-bold shadow-md"
        >
          ❮
        </button>

        {/* ▶️ RIGHT ARROW BUTTON */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-sky-600 hover:scale-110 text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-200 cursor-pointer z-10 text-sm font-bold shadow-md"
        >
          ❯
        </button>

        {/* ⚪ BOTTOM INDICATOR DOTS ( photo chal rahi Kiskihai batane ke liye) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-sky-600 w-6" : "bg-white/60 hover:bg-white"
              }`}
            ></button>
          ))}
        </div>


      </div>

      <div className="w-full mt-8 mb-8 text-center">
         {/* no of students banner*/ }
         <div className="w-full bg-slate-800 text-white py-6 md:py-8 border-y border-slate-900">
          <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            
            {/* Stat 1: Students trained */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                <AnimatedCounter target={20} />
                <span>K+</span>
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-widest mt-3">
                Students Trained
              </p>
            </div>

            {/* Stat 2: Courses */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                <AnimatedCounter target={50} />
                <span>+</span>
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-widest mt-3">
                Professional Courses
              </p>
            </div>

            {/* Stat 3: Years Experience */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                <AnimatedCounter target={28} />
                <span>+</span>
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-widest mt-3">
                Years of Excellence
              </p>
            </div>

            {/* Stat 4: Success Rate / Job Placement */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                <AnimatedCounter target={70} />
                <span>%+</span>
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-widest mt-3">
                Job Assistance
              </p>
            </div>

           </div>
         </div>
       </div>
        
        {/* 1. Live Announcement Badge */}
        <div className="flex flex-col md:flex-row justify-center items-center  p-6 md:p-12 min-h-[300px] md:min-h-[400px]  w-full gap-20 bg-white">
        
        {/* Left Side: Dynamic Text Column */}
        <div className="w-full md:w-2/5 flex flex-col justify-center items-start px-8 mt-2 mb-2">
        
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
            We are the Service Provider in the field of IT
          </h1>
          <p className="text-slate-600 font-semibold text-sm md:text-base mt-3 leading-relaxed justify-center">
          Manavta Institute offers a comprehensive range of Government-approved and certified Private computer courses. From foundational digital literacy to advanced professional tracks, we empower students with industry-recognized certifications and career-ready skills.
          </p>
          <div className="mt-6 flex w-full flex-wrap gap-4 justify-center items-center">
          {/* Primary Button: Explore Courses */}
          <Link 
            href="/courses" 
            className="bg-orange-300 hover:bg-amber-400 text-white font-semibold py-3 px-6 rounded-xl transition duration-150 text-sm md:text-base justify-center">
            Read More
          </Link>
          </div>
        </div>
        
        {/* Right Side: Image Column (No overflow, beautiful circular corners) */}
        <div className="w-10/12 md:w-2/5 aspect-[4/3] md:aspect-[16/10] md:h-[400px] overflow-hidden flex justify-center items-center">
          <img 
            src="/image.jpeg" 
            alt="Announcement" 
            className="h-full w-8/12 md:h-full md:w-8/12" 
          />
        </div>

      </div>
        {/* 5. Features Grid (Why Manavta Institute?) */}
        <div className='mt-10 mx-auto justify-center items-center'>
          <h1 className='font-bold text-3xl md:text-4xl text-black'>Courses We Offer 📜</h1></div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left hover:shadow-md transition duration-200">
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-2xl">
              📚
            </div>
            <h3 className="text-lg font-bold text-slate-800 mt-4">Modern Curriculum</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Carefully designed courses matching modern professional industry standards [3, 4].
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left hover:shadow-md transition duration-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">
              🔐
            </div>
            <h3 className="text-lg font-bold text-slate-800 mt-4">Secure Student Zone</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Interactive portal with robust safety features for student marksheet verification [2].
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left hover:shadow-md transition duration-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="text-lg font-bold text-slate-800 mt-4">Active Mentorship</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Dedicated doubt-clearing sessions and physical-digital hybrid learning models.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left hover:shadow-md transition duration-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="text-lg font-bold text-slate-800 mt-4">Active Mentorship</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Dedicated doubt-clearing sessions and physical-digital hybrid learning models.
            </p>
          </div>
        </div>
        <div className='mt-12 mb-12 mx-auto justify-center items-center'>
          <h1 className='font-bold text-3xl md:text-4xl text-black'>We are Acrredidated In ✅</h1></div>
        <InfiniteMarquee />
      </div>

    </main>
  );
}