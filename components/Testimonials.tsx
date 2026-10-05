"use client";

// Save as: components/Testimonials.tsx
import React from 'react';

interface Testimonial {
  name: string;
  course: string;
  quote: string;
  initials: string;
}

// Replace with real student testimonials when available
const testimonials: Testimonial[] = [
  {
    name: 'Srashti Gupta',
    course: 'Computerised Professional Accounting',
    quote: 'The practical, hands-on classes at Manavta gave me real confidence with Tally and GST filing — I started freelancing within months of completing the course.',
    initials: 'SC',
  },
  {
    name: 'Manvi Gupta',
    course: 'O Level (NIELIT)',
    quote: 'Govt.-recognized certificate, supportive faculty, and a syllabus that actually matches what employers ask for. Best decision I made after 12th.',
    initials: 'BK',
  },
  {
    name: 'Neha',
    course: 'CCC (NIELIT)',
    quote: 'I had zero computer background. The teachers explained everything step by step — passed CCC on my first attempt.',
    initials: 'PS',
  },
  {
    name: 'Vikram Singh',
    course: 'Web Designing',
    quote: 'From HTML basics to building my own responsive site in 6 months. The institute also helped me find my first freelance project.',
    initials: 'VS',
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-16 bg-[#F2ECE1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-[#B08D57] mb-2">
            Student Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B211D]">What Our Students Say</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="text-[#D8BD8E] text-3xl font-black leading-none mb-2">&ldquo;</div>
              <p className="text-sm text-[#52443C] leading-relaxed flex-1 mb-5">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F2ECE1]">
                <div className="w-10 h-10 rounded-full bg-[#2D221C] text-white font-black text-xs flex items-center justify-center shrink-0">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#2B211D] truncate">{t.name}</p>
                  <p className="text-[11px] text-[#8A7A6F] font-semibold truncate">{t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}