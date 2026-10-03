"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  FileText, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  BadgeCheck, 
  BookOpen, 
  Scale, 
  Globe, 
  Download,
  Users
} from 'lucide-react';

export default function AccreditationPage() {
  const accreditations = [
    {
      id: 'iso',
      title: 'ISO 9001:2015 Certification',
      category: 'Quality Management Standard',
      icon: ShieldCheck,
      badge: 'International Standard',
      description: 'Manavta Institute of Education (MITM) maintains an audited ISO 9001:2015 certified Quality Management System. This guarantees rigorous standards in IT curriculum design, examination delivery, and student support services.',
      details: [
        'Certified Quality Management Infrastructure',
        'Standardized Examination & Grading Framework',
        'Continuous Audit & Educational Improvement',
        'Internationally Recognized Quality Assurance'
      ]
    },
    {
      id: 'society',
      title: 'Government Registered Educational Society',
      category: 'Legal Institutional Entity',
      icon: Building2,
      badge: 'Government Registered',
      description: 'Operating under an official Government Registered Society framework, MITM is legally empowered to impart vocational, technical, and professional computer education across its authorized training campuses.',
      details: [
        'Registered under Societies Registration Provisions',
        'Authorized Vocational & Computer Education Provider',
        'Official Administrative HQ at Bilari, Moradabad',
        'Regulated Non-Profit Educational Objectives'
      ]
    },
    {
      id: 'vocational',
      title: 'Vocational & IT Skill Recognition',
      category: 'Skill Development Framework',
      icon: Award,
      badge: 'Industry Aligned',
      description: 'Our diploma and certificate curricula (ADCS, CPAC, ADCA, DEO, DTP) are meticulously benchmarked against modern industry demands, preparing students for job roles in IT, accounting, and digital administration.',
      details: [
        'Industry-Oriented Practical Training Modules',
        'Tally & Accounting Competency Standards',
        'Digital Literacy & Software Application Mastery',
        'Hands-on Lab Assessments & Project Work'
      ]
    },
    {
      id: 'verification',
      title: 'Authenticity & Anti-Fraud Verification System',
      category: 'Digital Security Standard',
      icon: BadgeCheck,
      badge: 'Tamper-Proof',
      description: 'Every official Marksheet and Certificate issued by MITM features a unique Enrollment Number, QR Code verification, and digital record matching to prevent unauthorized duplication or forgery.',
      details: [
        'Instant Public Verification via Roll No & DOB',
        'Unique Application & Serial Code Assignment',
        'Encrypted Digital Record Management',
        'Official QR Code Embedded Certificates'
      ]
    }
  ];

  const qualityPolicies = [
    {
      title: 'Standardized Evaluation',
      desc: 'Uniform theory and practical examination protocols across all authorized centers.'
    },
    {
      title: 'Updated Curriculum',
      desc: 'Annual review of software tools, accounting packages, and technical syllabi.'
    },
    {
      title: 'Student Empowerment',
      desc: 'Accessible computer education tailored for rural and semi-urban student communities.'
    },
    {
      title: 'Transparent Certification',
      desc: 'Clear grading metrics, credit distribution, and instant online document validation.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D221C] font-sans">
      
      {/* HERO BANNER SECTION */}
      <div className="relative bg-[#2D221C] text-[#FAF7F2] py-16 sm:py-24 px-4 overflow-hidden border-b-4 border-[#C29B72]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D8B38A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C29B72]/20 text-[#D8B38A] border border-[#C29B72]/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-[#D8B38A]" />
            Official Approvals & Credentials
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Accreditation & <span className="text-[#D8B38A] font-extrabold">Recognition</span>
          </h1>
          <p className="text-[#E2D8CD] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Manavta Institute of Education (MITM) adheres to strict quality benchmarks, government registration standards, and ISO 9001:2015 management certifications to deliver trusted computer and vocational education.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-4 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-lg border border-white/10 text-[#FAF7F2]">
              <ShieldCheck className="w-4 h-4 text-[#D8B38A]" /> ISO 9001:2015 Certified
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-lg border border-white/10 text-[#FAF7F2]">
              <Building2 className="w-4 h-4 text-[#D8B38A]" /> Govt Registered Society
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-lg border border-white/10 text-[#FAF7F2]">
              <BadgeCheck className="w-4 h-4 text-[#D8B38A]" /> QR Verified Credentials
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* SECTION 1: CORE ACCREDITATION CARDS GRID */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D221C]">Institutional Standards & Recognition</h2>
            <p className="text-xs sm:text-sm text-[#7A6B62]">
              Our certifications ensure that every student receives industry-standard education and verifiable academic credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {accreditations.map((item) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#EAE2D8] space-y-5 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-[#FAF5EF] text-[#C29B72] border border-[#EAE2D8] rounded-2xl">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="bg-[#FAF5EF] text-[#3D2E26] text-xs font-bold px-3 py-1 rounded-full border border-[#E2D8CD]">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#C29B72] uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-extrabold text-[#2D221C] mt-1">{item.title}</h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C4D43] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-[#EAE2D8] space-y-2">
                      <h4 className="text-xs font-bold text-[#3D2E26] uppercase tracking-wider">Key Governance Highlights:</h4>
                      <ul className="space-y-1.5">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#7A6B62]">
                            <CheckCircle2 className="w-4 h-4 text-[#C29B72] shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: QUALITY POLICY & ACADEMIC GOVERNANCE */}
        <div className="bg-[#2D221C] text-[#FAF7F2] rounded-3xl p-8 sm:p-12 shadow-xl border border-[#3D2E26] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C29B72]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="bg-[#C29B72]/20 text-[#D8B38A] text-xs font-bold px-3 py-1 rounded-full border border-[#C29B72]/30 uppercase tracking-wider">
              Institutional Quality Mandate
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Our Quality Commitment & Academic Vision</h2>
            <p className="text-[#E2D8CD] text-xs sm:text-sm leading-relaxed">
              Manavta Institute of Education is dedicated to bridging the digital skill gap by delivering high-quality, accessible IT and commercial vocational programs. We maintain rigorous standards across all partner centers and branches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 pt-2">
            {qualityPolicies.map((policy, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#C29B72]/20 text-[#D8B38A] font-bold text-xs flex items-center justify-center">
                  0{idx + 1}
                </div>
                <h3 className="font-extrabold text-white text-sm">{policy.title}</h3>
                <p className="text-xs text-[#E2D8CD] leading-relaxed">{policy.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: CERTIFICATE VALIDATION & ANTI-FRAUD NOTICE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#EAE2D8] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#FAF5EF] text-[#3D2E26] border border-[#E2D8CD] text-xs font-bold px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#C29B72]" /> Public Credential Security
            </div>
            <h3 className="text-2xl font-black text-[#2D221C]">Official Document Verification Guarantee</h3>
            <p className="text-xs sm:text-sm text-[#5C4D43] leading-relaxed">
              All students passing out from MITM programs receive official Marksheets and Certificates bearing our registered seal and digital QR verification codes. Employers and institutions can instantly verify document authenticity online.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#3D2E26] pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C29B72]" /> Roll Number & DOB Match</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C29B72]" /> Real-time Database Search</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C29B72]" /> Secure QR Authentication</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D8CD] text-center space-y-4">
            <BadgeCheck className="w-12 h-12 text-[#C29B72] mx-auto" />
            <h4 className="font-extrabold text-[#2D221C] text-sm">Need to verify a candidate?</h4>
            <p className="text-xs text-[#7A6B62]">Access our live verification portal to authenticate student marksheets and certificates.</p>
            <Link
              href="/student/verify-registration"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#3D2E26] hover:bg-[#2D221C] text-[#FAF7F2] font-bold text-xs rounded-xl shadow transition"
            >
              Go to Student Verification <ExternalLink className="w-3.5 h-3.5 text-[#D8B38A]" />
            </Link>
          </div>
        </div>

        {/* SECTION 4: CALL TO ACTION BANNER */}
        <div className="bg-[#2D221C] text-[#FAF7F2] rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-b-4 border-[#C29B72]">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">Join an ISO Certified & Recognized Institution</h3>
            <p className="text-[#E2D8CD] text-xs sm:text-sm">Explore our job-oriented computer courses and apply online today.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/enroll-now"
              className="px-6 py-3 bg-[#C29B72] hover:bg-[#B08A63] text-[#2D221C] font-black rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              Enroll Now Portal <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-bold rounded-xl text-sm border border-white/20 transition flex items-center gap-2"
            >
              Contact HQ
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
