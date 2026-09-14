"use client"; // Interactive marquee scroll ke liye Next.js client component

import React from 'react';

export default function InfiniteMarquee() {
  // 📸 Apni images ke path yahan daliye (Jaise public/boy.jpeg)
  const images = [
    "/06.png",
    "/07.jpeg",
    "/08.jpg",
    "/images.png",
    "/12.jpg",
    "/13.jpeg",
    "/15.jpeg",
    "/16.jpeg",
  ];

  return (
    <div className="w-full py-6 mt-6 md:mt-10 bg-white overflow-hidden relative ">
      
      {/* 🔮 FADING SHADOWS: Left aur Right side par smooth dark blur taaki images corner par katen nahi */}
      <div className="absolute top-0 left-0 w-12 md:w-24 h-full pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-12 md:w-24 h-full pointer-events-none"></div>

      {/* 🚀 SMOOTH KEYFRAME ANIMATION */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 22s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused; /* Mouse le jane par ribbon ruk jayegi */
        }
      `}} />

      {/* 🏃‍♂️ INFINITE RUNNING ROW */}
      <div className="relative w-full flex overflow-hidden">
        <div className="marquee-track gap-2 md:gap-4 py-2">
          
          {/* ================= COPY 1: FIRST SET ================= */}
          {images.map((src, index) => (
            <div 
              key={`marquee-set1-${index}`} 
              // ⚡ STRIKT PYARAMETERS: Mobile par [180px] aur Desktop par [260px] par strict lock hai!
              className="w-[180px] min-w-[180px] max-w-[180px] h-[110px] md:w-[260px] md:min-w-[260px] md:max-w-[260px] md:h-[160px] rounded-xl overflow-hidden flex-shrink-0 relative group cursor-pointer"
            >
              <img 
                src={src} 
                alt={`Campus Gallery ${index + 1}`} 
                // object-cover bina stretch kiye image ko fit rakhega
                className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 ease-out" 
              />
              {/* Image Hover Card Effect */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              </div>
            </div>
          ))}

          {/* ================= COPY 2: DUPLICATED SET (Seamless Loop ke liye) ================= */}
          {images.map((src, index) => (
            <div 
              key={`marquee-set2-${index}`} 
              // Dimensions exact 1:1 match hone chahiye copy 1 se taaki glitch na aaye
              className="w-[180px] min-w-[180px] max-w-[180px] h-[110px] md:w-[260px] md:min-w-[260px] md:max-w-[260px] md:h-[160px] rounded-xl overflow-hidden flex-shrink-0 relative group cursor-pointer"
            >
              <img 
                src={src} 
                alt={`Campus Gallery Dup ${index + 1}`} 
                className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 ease-out" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}