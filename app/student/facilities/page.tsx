"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  BadgeCheck, 
  Monitor, 
  UserCheck, 
  Calendar, 
  Wind, 
  Car, 
  Languages, 
  Check, 
  ArrowRight,
  GraduationCap,
  Sparkle
} from 'lucide-react';

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const facilities = [
    {
      id: 'labs',
      title: 'Separate Computer Labs for Boys & Girls',
      category: 'Infrastructure & Safety',
      tab: 'labs',
      icon: Monitor,
      badge: 'Dedicated Labs',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      description: 'Independent, state-of-the-art computer laboratories for male and female students to ensure a safe, disciplined, and comfortable learning environment.',
      points: [
        '1:1 computer-to-student ratio during lab hours',
        'Workstations pre-configured for ADCS, ADCA, Tally & DTP',
        'Dedicated lab instructors for instant query resolution',
        'Safe, respectful, and distraction-free academic setting'
      ]
    },
    {
      id: 'offline',
      title: '100% Physical Campus Classes (No Online Classes)',
      category: 'Teaching Methodology',
      tab: 'academic',
      icon: UserCheck,
      badge: 'Direct Learning',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      description: 'We prioritize genuine hands-on practical education with face-to-face classroom lectures, immediate teacher guidance, and supervised lab exercises.',
      points: [
        'Daily physical classroom & practical lab sessions',
        'Direct 1-on-1 instructor support for complex concepts',
        'Strict attendance tracking & regular practical testing',
        'Uncompromising focus on real-world job skills'
      ]
    },
    {
      id: 'faculty',
      title: 'Experienced & Qualified Faculty',
      category: 'Academic Excellence',
      tab: 'academic',
      icon: GraduationCap,
      badge: 'Certified Teachers',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      description: 'Our certified instructors bring decades of practical experience in computer applications, commercial accounting, Tally Prime, and office software.',
      points: [
        'Years of dedicated teaching experience in technical education',
        'Specialized faculty for Tally, Programming & Software',
        'Student-centric, patient, and encouraging pedagogy',
        'Step-by-step guidance from fundamentals to advanced modules'
      ]
    },
    {
      id: 'classrooms',
      title: 'Spacious & Well-Ventilated Classrooms',
      category: 'Campus Environment',
      tab: 'amenities',
      icon: Wind,
      badge: 'Airy & Natural',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      description: 'Bright, airy, and comfortably designed non-AC classrooms maintaining a healthy, fresh, and high-energy learning atmosphere throughout the day.',
      points: [
        'Abundant natural lighting and fresh air ventilation',
        'Ergonomic seating arrangements for long study sessions',
        'Hygienic, quiet, and well-maintained study spaces',
        'Acoustically sound setup for clear lecture delivery'
      ]
    },
    {
      id: 'bilingual',
      title: 'Bilingual Instruction (Hindi & English Medium)',
      category: 'Student Accessibility',
      tab: 'academic',
      icon: Languages,
      badge: 'Hindi & English',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      description: 'To ensure seamless comprehension, lectures, practical lab assignment sheets, and study materials are delivered in simple Hindi and professional English.',
      points: [
        'Concepts clarified in easily understandable Hindi',
        'Bilingual assignment workbooks and reference notes',
        'Special attention for students from Hindi-medium backgrounds',
        'English typing and key software terminology training'
      ]
    },
    {
      id: 'parking',
      title: 'Dedicated On-Campus Student Parking',
      category: 'Campus Amenities',
      tab: 'amenities',
      icon: Car,
      badge: 'Safe & Secure',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      description: 'Generous and secure parking facility inside the campus premises for two-wheelers, motorcycles, scooters, and bicycles belonging to students.',
      points: [
        'Secure campus area for student vehicle safety',
        'Organized parking sections for boys and girls',
        'Convenient entry and exit during all batch timings',
        'Complete safety while attending lectures and lab sessions'
      ]
    }
  ];

  const whyChooseUs = [
    {
      no: '01',
      title: '27+ Years Educational Legacy',
      subtitle: 'In Service Since 1998',
      desc: 'Decades of unmatched educational trust, quality training, and thousands of successful alumni across Moradabad & Bilari region.'
    },
    {
      no: '02',
      title: 'Govt. Job Eligible Credentials',
      subtitle: 'Authorized Certification',
      desc: 'Official Marksheets and Certificates recognized for state/central government job applications and employment exchange registration.'
    },
    {
      no: '03',
      title: 'Separate Labs for Boys & Girls',
      subtitle: 'Safety & Comfort First',
      desc: 'Dedicated computer laboratories providing total security, privacy, and focused learning for male and female candidates.'
    },
    {
      no: '04',
      title: '100% Offline Practical Focus',
      subtitle: 'No Online Shortcuts',
      desc: 'Genuine hands-on experience on physical computer systems with live instructor feedback on every exercise.'
    },
    {
      no: '05',
      title: 'Tamper-Proof QR Verification',
      subtitle: 'Instant Online Validation',
      desc: 'Every certificate is embedded with an official QR code and unique Enrollment ID for online document verification.'
    },
    {
      no: '06',
      title: 'Bilingual & Student-Friendly',
      subtitle: 'Hindi & English Medium',
      desc: 'Clear explanations in simple Hindi along with standard English terms, plus well-ventilated rooms and campus parking.'
    }
  ];

  const filteredFacilities = activeTab === 'all' 
    ? facilities 
    : facilities.filter(f => f.tab === activeTab);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3D2E26] font-sans">
      
      {/* LIGHT NUDE HERO BANNER */}
      <div className="relative bg-gradient-to-b from-[#F5EFE6] via-[#FAF7F2] to-[#FAF7F2] py-16 sm:py-24 px-4 border-b border-[#E8DFC8]/60 overflow-hidden">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E8DFC8]/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D8C4B6]/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 bg-[#EFE6D5] text-[#7A5C43] border border-[#DFCBB5] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C29B72]" />
            MAANAVTA INSTITUTE - "BUILDING CAREER, NOT JUST SKILLS !"
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#3D2E26]">
            Institute Facilities & <span className="text-[#B8860B] font-black">Infrastructure</span>
          </h1>

          <p className="text-[#6E5A4C] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
            Discover our world-class offline educational ecosystem featuring separate computer labs for boys and girls, experienced faculty, bilingual instruction, and valid certification at our Bilari Head Campus.
          </p>

          {/* Quick Highlight Pills */}
          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-[#E8DFC8] text-[#5A4638] shadow-sm">
              <Calendar className="w-4 h-4 text-[#B8860B]" /> In Service Since 1998 (27+ Years)
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-[#E8DFC8] text-[#5A4638] shadow-sm">
              <UserCheck className="w-4 h-4 text-[#8B5A2B]" /> 100% Physical Offline Campus
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-[#E8DFC8] text-[#5A4638] shadow-sm">
              <BadgeCheck className="w-4 h-4 text-[#2E7D32]" /> Govt. Job Valid Credentials
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-[#E8DFC8] text-[#5A4638] shadow-sm">
              <Languages className="w-4 h-4 text-[#8B5A2B]" /> Hindi & English Medium
            </span>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* SECTION 1: FILTERABLE BENTO GRID FACILITIES */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DFC8] pb-6">
            <div>
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-wider block mb-1">
                Modern Campus Amenities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2E26]">
                Our Infrastructure & Facilities
              </h2>
            </div>

            {/* TAB FILTERS */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Facilities' },
                { id: 'labs', label: 'Boys & Girls Labs' },
                { id: 'academic', label: 'Academic Focus' },
                { id: 'amenities', label: 'Campus Comfort' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#3D2E26] text-[#FAF7F2] shadow-md'
                      : 'bg-white text-[#6E5A4C] border border-[#E8DFC8] hover:bg-[#F5EFE6]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* FACILITY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((item) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Card Image Header */}
                    <div className="relative h-48 overflow-hidden bg-[#F5EFE6]">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3D2E26]/60 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[#3D2E26] text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#E8DFC8] shadow-sm flex items-center gap-1.5">
                        <IconComp className="w-3.5 h-3.5 text-[#B8860B]" />
                        {item.badge}
                      </div>

                      <span className="absolute bottom-3 left-3 text-white text-xs font-bold tracking-wide drop-shadow">
                        {item.category}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-extrabold text-[#3D2E26] leading-snug group-hover:text-[#B8860B] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#6E5A4C] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-3 border-t border-[#F5EFE6] space-y-2">
                        <ul className="space-y-2">
                          {item.points.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#5A4638]">
                              <CheckCircle2 className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: VALID CERTIFICATION & GOVT JOB ELIGIBILITY */}
        <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EF] to-[#F5EFE6] rounded-3xl p-6 sm:p-10 border border-[#E8DFC8] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#EFE6D5] text-[#5A4638] border border-[#DFCBB5] text-xs font-bold px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> Government Job Valid Qualification
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3D2E26]">
              Valid Certification After Course Completion
            </h3>

            <p className="text-xs sm:text-sm text-[#6E5A4C] leading-relaxed">
              Every candidate who finishes their diploma program (such as <strong className="text-[#3D2E26]">ADCS, ADCA, CPAC, DEO, or DTP</strong>) receives an official Marksheet and Certificate. Our certifications are recognized for government job recruitments, private corporate roles, and employment exchange registration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-[#E8DFC8] shadow-xs">
                <Check className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#3D2E26]">Recognized for Govt. Recruitment</h4>
                  <p className="text-[11px] text-[#7A6B62]">Valid for state & central government job eligibility criteria.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-[#E8DFC8] shadow-xs">
                <Check className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#3D2E26]">Unique Code & QR Verification</h4>
                  <p className="text-[11px] text-[#7A6B62]">Issued with unique Roll No, Enrollment ID, and digital QR code.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-md text-center space-y-4">
            <div className="w-12 h-12 bg-[#F5EFE6] text-[#B8860B] rounded-2xl flex items-center justify-center mx-auto border border-[#E8DFC8]">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#3D2E26] text-base">In Service Since 1998</h4>
              <p className="text-xs text-[#7A6B62] mt-1 leading-relaxed">
                27+ years of dedication. Over 10,000+ students certified in computer applications and accounting.
              </p>
            </div>
            <Link
              href="/enroll-now"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#3D2E26] hover:bg-[#2D221C] text-[#FAF7F2] font-extrabold text-xs rounded-xl shadow transition"
            >
              Enroll Online Now <ArrowRight className="w-4 h-4 text-[#C29B72]" />
            </Link>
          </div>
        </div>

        {/* SECTION 3: WHY CHOOSE MANAVTA INSTITUTE? (मानवता इंस्टीट्यूट क्यों चुनें?) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFC8] shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="bg-[#F5EFE6] text-[#7A5C43] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#E8DFC8] uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-[#B8860B]" /> Institutional Excellence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3D2E26]">
              Why Choose Manavta Institute? 
            </h2>
            <p className="text-[#6E5A4C] text-xs sm:text-sm leading-relaxed">
              We stand apart through our commitment to quality offline practical education, safe separate labs for male and female students, and career-ready practical training.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {whyChooseUs.map((reason) => (
              <div 
                key={reason.no} 
                className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] space-y-3 hover:border-[#C29B72] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#EFE6D5] text-[#3D2E26] font-extrabold text-xs flex items-center justify-center border border-[#DFCBB5]">
                    {reason.no}
                  </span>
                  <span className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider">
                    {reason.subtitle}
                  </span>
                </div>
                <h3 className="font-extrabold text-[#3D2E26] text-base">{reason.title}</h3>
                <p className="text-xs text-[#6E5A4C] leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CALL TO ACTION BANNER */}
        <div className="bg-gradient-to-r from-[#3D2E26] via-[#4A3B32] to-[#3D2E26] text-[#FAF7F2] rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-b-4 border-[#C29B72]">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">Visit Manavta Institute Today!</h3>
            <p className="text-[#E8DFC8] text-xs sm:text-sm">Experience our campus facilities, meet our faculty, and register for job-oriented computer courses.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/enroll-now"
              className="px-6 py-3 bg-[#C29B72] hover:bg-[#B08A63] text-[#3D2E26] font-black rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              Enroll Now Portal <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-bold rounded-xl text-sm border border-white/20 transition flex items-center gap-2"
            >
              Contact Us Soon 
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
