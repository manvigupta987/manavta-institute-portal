"use client";

// Save as: components/QuizTeaser.tsx
import React from 'react';
import Link from 'next/link';

export default function QuizTeaser() {
  return (
    <section className="py-12 sm:py-14 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative bg-[#2D221C] text-[#FAF7F2] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
          <div
            className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #D8BD8E, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 text-center md:text-left">
            <span className="inline-block text-[11px] font-black uppercase tracking-widest text-[#D8BD8E] mb-2">
              Free Practice Test
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Test Yourself — CCC &amp; O Level Mock Quiz
            </h2>
            <p className="text-sm text-[#F2ECE1]/90 mt-2 max-w-md">
            "Smart practice for sharper minds.
              Test your knowledge, track your speed, and ace your exams online."
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/quiz/ccc"
              className="px-6 py-3 bg-white text-[#6B1F2A] rounded-xl text-sm font-black text-center hover:bg-[#F2ECE1] transition shadow"
            >
              Start CCC Quiz
            </Link>
            <Link
              href="/quiz/o-level"
              className="px-6 py-3 bg-[#B08D57] text-white rounded-xl text-sm font-black text-center hover:bg-[#9c7a49] transition shadow"
            >
              Start O Level Quiz
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}