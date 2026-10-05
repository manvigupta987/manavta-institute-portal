"use client";

// Save as: components/PrincipalDirectorCorner.tsx
import React from 'react';
import Link from 'next/link';

interface Person {
  name: string;
  designation: string;
  photo: string;
  message: string;
  readMoreHref: string;
}

const people: Person[] = [
  {
    name: 'Mrs. Chhama Agarwal',
    designation: 'Director, Manavta Institute',
    photo: '/principal.jpeg',
    message:
      '"Education is not just about certificates — it is about building the confidence and skill that carries our students into real careers. At Manavta, every classroom is built around that promise."',
    readMoreHref: '/about/message',
  },
  {
    name: 'Mr. Anoop Kumar',
    designation: 'Co-ordinator, Manavta Institute',
    photo: '/director.jpeg',
    message:
      '"Since 1998, our focus has stayed the same — government-recognized courses, industry-ready training, and genuine placement support for every student who walks through our doors."',
    readMoreHref: '/about/message',
  },
];

export default function PrincipalDirectorCorner() {
  return (
    <section className="py-14 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-[12px] font-black uppercase tracking-widest text-[#B08D57] mb-2">
            Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B211D]">
            From the Principal &amp; Director&apos;s Desk
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {people.map((p) => (
            <div
              key={p.name}
              className="bg-white border border-[#E8DFC8] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={p.photo}
                alt={p.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#B08D57]/40 shrink-0 mx-auto sm:mx-0"
              />
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-black text-[#2B211D]">{p.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wide text-[#C29B72] mb-3">
                  {p.designation}
                </p>
                <p className="text-sm text-[#52443C] leading-relaxed flex-1 line-clamp-4">
                  {p.message}
                </p>
                <Link
                  href={p.readMoreHref}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#2D221C] hover:text-[#C29B72] transition w-fit"
                >
                  Read More
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}