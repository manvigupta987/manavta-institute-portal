"use client"; // Interactive actions (click, slides change) ke liye

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import InfiniteMarquee from '@/components/infinitegallery';
import CourseList from './course-list/page';
import PrincipalDirectorCorner from '@/components/PrincipalDirectorCorner';
import QuizTeaser from '@/components/QuizTeaser';
import Testimonials from '@/components/Testimonials';


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
  const images = [
    "/office.jpeg",
    "/class1.jpeg",
    "/class2.jpeg",
    "/lab1.jpeg",
    "/reception.jpeg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2]">

      {/* 📸 SECTION 1: PHOTO SLIDER */}
      <div className="relative w-full h-[300px] md:h-[500px] bg-[#F2ECE1] overflow-hidden group border-b border-[#E8DFC8]">
        <img
          src={images[currentIndex]}
          alt={`Manavta Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        />

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#6B1F2A] hover:scale-110 text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-200 cursor-pointer z-10 text-sm font-bold shadow-md"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#6B1F2A] hover:scale-110 text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-200 cursor-pointer z-10 text-sm font-bold shadow-md"
        >
          ❯
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-[#B08D57] w-6" : "bg-white/60 hover:bg-white"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* 📊 SECTION 2: STAT COUNTERS (before the course flashcards / gallery) */}
      <div className="w-full mt-8 mb-8 text-center">
        <div className="w-full bg-[#2D221C] text-white py-6 md:py-8 border-y border-[#C29B72]">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">

              <div className="flex flex-col items-center justify-center p-4">
                <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                  <AnimatedCounter target={20} />
                  <span>K+</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-[#D8BD8E] uppercase tracking-widest mt-3">
                  Students Trained
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4">
                <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                  <AnimatedCounter target={50} />
                  <span>+</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-[#D8BD8E] uppercase tracking-widest mt-3">
                  Professional Courses
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4">
                <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                  <AnimatedCounter target={28} />
                  <span>+</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-[#D8BD8E] uppercase tracking-widest mt-3">
                  Years of Excellence
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4">
                <div className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center">
                  <AnimatedCounter target={70} />
                  <span>%+</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-[#D8BD8E] uppercase tracking-widest mt-3">
                  Job Assistance
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 📝 SECTION 3: INTRO TEXT + IMAGE */}
      <div className="flex flex-col md:flex-row justify-center items-center p-6 md:p-12 min-h-[300px] md:min-h-[400px] w-full gap-20 bg-white">
        <div className="w-full md:w-2/5 flex flex-col justify-center items-start px-8 mt-2 mb-2">
          <h1 className="text-2xl md:text-4xl font-black text-[#2B211D] leading-tight">
            We are the Service Provider in the field of IT
          </h1>
          <p className="text-[#52443C] font-semibold text-sm md:text-base mt-3 leading-relaxed">
            Manavta Institute offers a comprehensive range of Government-approved and certified Private computer courses. From foundational digital literacy to advanced professional tracks, we empower students with industry-recognized certifications and career-ready skills.
          </p>
          <div className="mt-6 flex w-full flex-wrap gap-4 justify-center items-center">
            <Link
              href="/courses"
              className="bg-[#C29B72] hover:bg-[#D8B38A] text-white font-semibold py-3 px-6 rounded-xl transition duration-150 text-sm md:text-base"
            >
              Read More
            </Link>
          </div>
        </div>

        <div className="w-10/12 md:w-2/5 aspect-[4/3] md:aspect-[16/10] md:h-[400px] overflow-hidden flex justify-center items-center">
          <img
            src="/image.jpeg"
            alt="Announcement"
            className="h-full w-8/12 md:h-full md:w-8/12"
          />
        </div>
      </div>

      {/* 🎓 SECTION 4: COURSE FLASHCARDS */}
      
      <CourseList />

      {/* 🖼️ SECTION 5: ACCREDITATION / INFINITE GALLERY */}
      <div className=" mb-12 mx-auto text-center">
        <h2 className="font-bold text-3xl md:text-4xl text-[#2B211D]">We are Accredited In ✅</h2>
      </div>
      <InfiniteMarquee />

      {/* 👤 SECTION 6: PRINCIPAL + DIRECTOR CORNER (right after the gallery) */}
      <PrincipalDirectorCorner />

      {/* 🧠 SECTION 7: QUIZ TEASER */}
      <QuizTeaser />

      {/* 💬 SECTION 8: TESTIMONIALS (last) */}
      <Testimonials />    
    </main>
  );
}