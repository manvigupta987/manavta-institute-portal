"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  BadgeCheck, 
  Quote, 
  Target, 
  Compass, 
  HeartHandshake, 
  ArrowRight, 
  ExternalLink,
  Check,
  UserCheck,
  Award
} from 'lucide-react';

export default function CoordinatorMessagePage() {
  const leadershipPillars = [
    {
      id: 'manpower',
      title: 'Bridging Manpower Gap',
      desc: 'Addressing the critical national demand for industry-ready, technically sound IT professionals.',
      icon: Target,
      tag: 'Industry Focus'
    },
    {
      id: 'practical',
      title: '100% Physical Practical Training',
      desc: 'No online shortcuts — genuine daily hands-on practice in Tally, Accounting, Software & Typing.',
      icon: UserCheck,
      tag: 'Direct Practice'
    },
    {
      id: 'character',
      title: 'Character & Personality',
      desc: 'Fostering workplace discipline, professional communication, and self-confidence.',
      icon: Compass,
      tag: 'Holistic Growth'
    },
    {
      id: 'placement',
      title: 'Dedicated Placement Cell',
      desc: 'Active placement support guiding students toward rewarding government and private jobs.',
      icon: HeartHandshake,
      tag: 'Career Success'
    }
  ];

  const campusVisuals = [
    {
      title: 'High-Tech Computer Laboratories',
      desc: '1:1 computer allocation with separate lab schedules for boys and girls.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      tag: 'Practical Training'
    },
    {
      title: 'Interactive Classroom Mentorship',
      desc: 'Direct face-to-face guidance from certified & experienced faculty.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      tag: 'Expert Mentors'
    },
    {
      title: 'Official Certification & Success',
      desc: 'Over 10,000+ graduates working across state and central government departments.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      tag: 'Govt. Job Eligible'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D221C] font-sans">
      
      {/* HERO HEADER SECTION */}
      <div className="relative bg-[#2D221C] text-[#FAF7F2] py-14 sm:py-20 px-4 text-center relative overflow-hidden border-b-4 border-[#C29B72">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C29B72]/20 text-[#D8B38A] border border-[#C29B72]/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition hover:scale-105 duration-300">
            <Sparkles className="w-4 h-4 text-[#D8B38A]" />
            Manavta Institute of Education (MITM) • Bilari Head Campus
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Institutional <span className="text-white">Leadership Messages</span>
          </h1>
          
          <p className="text-[#E2D8CD] text-xs sm:text-base max-w-3xl mx-auto leading-relaxed font-medium">
            Discover the core vision, academic philosophy, and guidance from the Director&apos;s & Co-ordinator&apos;s Desk at Manavta Institute (In Service Since 1998).
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 shadow-sm">
              <Award className="w-4 h-4 text-[#C29B72]" /> Director&apos;s Desk
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 shadow-sm">
              <Compass className="w-4 h-4 text-blue-600" /> Co-ordinator&apos;s Desk
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-emerald-600" /> ISO 9001:2015 Quality Mandate
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* SECTION 1: DIRECTOR'S MESSAGE (LARGE LANDSCAPE PHOTO) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E8DFC8] space-y-8">
          <div className="flex items-center justify-between border-b border-[#F2E8D8] pb-4">
            <div className="inline-flex items-center gap-2 bg-[#FAF5EF] text-[#3D2E26] border border-[#E2D8CD] text-xs font-bold px-3.5 py-1 rounded-full">
              <Award className="w-4 h-4 text-[#C29B72]" /> Director&apos;s Desk (निदेशक का संदेश)
            </div>
            <span className="text-xs font-extrabold text-[#C29B72] uppercase tracking-wider">
              Leadership Vision
            </span>
          </div>

          {/* LARGE FEATURED LANDSCAPE PHOTO FRAME */}
          <div className="relative group overflow-hidden rounded-3xl border-2 border-[#E8DFC8] shadow-md">
            <div className="aspect-[16/9] sm:aspect-[21/9] relative overflow-hidden bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80" 
                alt="Director Desk & Campus Leadership" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="inline-flex items-center gap-2 bg-[#C29B72] text-[#2D221C] text-xs font-extrabold px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Director Desk • Bilari Head Campus HQ
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  &quot;An Organization is a union of ordinary people doing extra-ordinary work.&quot;
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-3xl">
                  Building career confidence, technical excellence, and disciplined computer education since 1998.
                </p>
              </div>
            </div>
          </div>

          {/* DIRECTOR'S MESSAGE TEXT */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-[#C29B72]">
              <Quote className="w-8 h-8 opacity-80" />
              <h2 className="text-2xl font-black text-[#2D221C]">Message from the Director</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#5C4D43] leading-relaxed">
              <p>
                Welcome to <strong className="text-[#2D221C]">Manavta Institute of Technology & Management (MITM)</strong>. Since our establishment in 1998 under the <em>All India Manavta Computer Education & Welfare Society</em>, our guiding vision has been to democratize computer literacy and vocational technical training across Bilari and Moradabad region.
              </p>

              <p>
                We firmly believe that technical education should not be confined to theoretical textbooks or online shortcuts. Real competence is built through daily hands-on practice, 1:1 computer access in dedicated laboratories, and direct mentorship from experienced faculty.
              </p>

              <blockquote className="p-4 bg-[#FAF7F2] rounded-2xl border-l-4 border-[#C29B72] text-[#3D2E26] font-semibold italic">
                &quot;Our commitment is total: separate computer labs for boys and girls to ensure complete safety and comfort, 100% offline physical classes, and valid, tamper-proof certifications recognized for government job recruitment.&quot;
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C29B72] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D221C]">27+ Years Legacy</h4>
                    <p className="text-[11px] text-[#7A6B62]">In service continuously since 1998.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C29B72] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D221C]">Separate Labs</h4>
                    <p className="text-[11px] text-[#7A6B62]">1:1 computers for boys and girls.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C29B72] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D221C]">Govt. Valid Credentials</h4>
                    <p className="text-[11px] text-[#7A6B62]">Recognized for state & central jobs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COORDINATOR'S MESSAGE (LARGE LANDSCAPE PHOTO) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E8DFC8] space-y-8">
          <div className="flex items-center justify-between border-b border-[#F2E8D8] pb-4">
            <div className="inline-flex items-center gap-2 bg-[#FAF5EF] text-[#3D2E26] border border-[#E2D8CD] text-xs font-bold px-3.5 py-1 rounded-full">
              <Compass className="w-4 h-4 text-blue-600" /> Co-ordinator&apos;s Desk (समन्वयक का संदेश)
            </div>
            <span className="text-xs font-extrabold text-[#C29B72] uppercase tracking-wider">
              Academic Co-ordination
            </span>
          </div>

          {/* LARGE FEATURED LANDSCAPE PHOTO FRAME FOR COORDINATOR */}
          <div className="relative group overflow-hidden rounded-3xl border-2 border-[#E8DFC8] shadow-md">
            <div className="aspect-[16/9] sm:aspect-[21/9] relative overflow-hidden bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80" 
                alt="Coordinator Desk & Student Guidance" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  <UserCheck className="w-3.5 h-3.5" /> Co-ordinator Desk • Student Academic Guidance
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  &quot;Goals are met when we co-ordinate our efforts with those of others.&quot;
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-3xl">
                  Aligning technical skill training, character development, and dedicated placement support.
                </p>
              </div>
            </div>
          </div>

          {/* COORDINATOR MESSAGE TEXT */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-[#C29B72]">
              <Quote className="w-8 h-8 opacity-80" />
              <h2 className="text-2xl font-black text-[#2D221C]">Message from the Co-ordinator</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#5C4D43] leading-relaxed">
              <p>
                In today&apos;s rapidly evolving technological landscape, India faces a dual challenge: while millions seek meaningful employment, industries face a acute shortage of trained, technically proficient manpower. At <strong className="text-[#2D221C]">Manavta Institute</strong>, our primary purpose is to bridge this exact deficiency.
              </p>

              <p>
                To prepare our learners for real-world career opportunities, we focus on holistic growth. Technical knowledge in software, accounting (Tally Prime), and web skills is combined with strong personal character, workplace communication, and English typing proficiency.
              </p>

              <p>
                Through the dedicated efforts of our faculty and our <strong>Active Student Placement Cell</strong>, we guide our candidates toward rewarding careers in both government departments and private enterprises across the country.
              </p>

              <blockquote className="p-4 bg-[#FAF7F2] rounded-2xl border-l-4 border-blue-600 text-[#3D2E26] font-semibold italic">
                &quot;We remain steadfast in our mission, believing that true collective teamwork and coordinated effort are the keys to achieving greater institutional milestones.&quot;
              </blockquote>
            </div>
          </div>
        </div>

        {/* SECTION 3: CORE LEADERSHIP PILLARS */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bg-[#F5EFE6] text-[#8C6B42] text-xs font-bold px-3 py-1 rounded-full border border-[#E2D6C5] uppercase tracking-wider">
              Academic Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D221C]">Core Academic Pillars</h2>
            <p className="text-xs sm:text-sm text-[#7A6B62]">
              Designed to ensure every student gains real practical mastery and career confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipPillars.map((p) => {
              const IconComp = p.icon;
              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition duration-500 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-[#FAF7F2] text-[#C29B72] border border-[#E8DFC8] rounded-2xl">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase bg-[#FAF5EF] text-[#8C6B42] px-2.5 py-1 rounded-full border border-[#E2D6C5]">
                        {p.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#2D221C]">{p.title}</h3>
                    <p className="text-xs text-[#5C4D43] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: LIFE AT CAMPUS LANDSCAPE PHOTO GALLERY */}
        <div className="bg-[#FAF5EF] rounded-3xl p-6 sm:p-10 border border-[#E2D8CD] space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D221C]">Campus Learning Environment</h2>
            <p className="text-xs sm:text-sm text-[#7A6B62]">
              Explore our modern computer labs, classrooms, and student activities at Bilari Head HQ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campusVisuals.map((vis, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-sm hover:shadow-lg transition group"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                  <img 
                    src={vis.image} 
                    alt={vis.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur text-[#2D221C] border border-[#E8DFC8] text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                      {vis.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-extrabold text-[#2D221C] text-sm group-hover:text-[#C29B72] transition">{vis.title}</h3>
                  <p className="text-xs text-[#7A6B62] leading-relaxed">{vis.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: CALL TO ACTION BANNER */}
        <div className="bg-[#C29B72]/20 text-[#D8B38A] border border-[#C29B72]/40 rounded-3xl p-8 sm:p-10 border-2 border-[#C29B72] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-black">Join Manavta Institute Today!</h3>
            <p className="text-slate-700 text-xs sm:text-sm font-medium">Experience quality computer education under expert leadership at Bilari Head Campus.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/enroll-now"
              className="px-6 py-3 bg-[#2D221C] hover:bg-[#8C6B42] text-[#FAF7F2] font-black rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              Enroll Online Now <ArrowRight className="w-4 h-4 text-[#C29B72]" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-[#2D221C] font-bold rounded-xl text-sm border border-slate-300 transition flex items-center gap-2 shadow-sm"
            >
              Contact Campus HQ <ExternalLink className="w-4 h-4 text-[#C29B72]" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
