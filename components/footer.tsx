'use client';

import React from 'react';
import Link from 'next/link';

export default function WebsiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-200 pt-10 pb-6 border-t-4 border-sky-600">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          
          {/* Column 1: Institute Branding & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg">
                <img src="/logo.png" className="w-10 h-10" alt="Manavta Institute" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-wide uppercase">
                  MANAVTA INSTITUTE OF TECHNOLOGY & MANAGEMENT
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">Empowering students with industry-grade IT, Software Engineering, and Computerised Accounting skills. <br></br><strong>ISO 9001:2015 Certified</strong></p>
              </div>
            </div>
            

            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                ISO 9001:2015 Certified
              </span>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Govt Regd.
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links & Student Verification */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-sky-500">🔗</span> Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span>▸</span> Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span>▸</span> Check Courses
                </Link>
              </li>
              <li>
                <Link href="/enroll" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span>▸</span> Online Admission / Enroll Now
                </Link>
              </li>
              <li>
                <Link href="/result" className="hover:text-sky-400   flex items-center gap-1.5">
                  <span>🔍</span> Student Result
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span>🏢</span> Student Id Card
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span>📞</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Courses */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 break-words">
              <span className="text-sky-500">🎓</span> Popular Programs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-sky-400 text-xs mt-0.5">•</span>
                <span>O Level (NIELIT)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 text-xs mt-0.5">•</span>
                <span>Advance Diploma In Computer Software (ADCS)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 text-xs mt-0.5">•</span>
                <span>Computerised Professional Accounting Course (CPAC)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 text-xs mt-0.5">•</span>
                <span>Advance Diploma In Computer Application (ADCA)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 text-xs mt-0.5">•</span>
                <span>Data Entry Operator (DEO) & DTP</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Head Office Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-sky-500">📍</span> Main Office
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <span className="text-slate-400 font-bold shrink-0">🏛️ 205-A,Manavta Insttitute, Sahu Kunj, Station Road, Bilari, <br></br>Moradabad, Uttar Pradesh - 244411</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-400 font-bold shrink-0">📞</span>
                <span>+91 9897513656 / +91 8923130448</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-400 font-bold shrink-0">✉️</span>
                <span>manavtaeducation@yahoo.com</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-400 font-bold shrink-0">🕒</span>
                <span>Mon - Sat: 08:00 AM - 05:00 PM</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Manavta Institute of Technolology & Management (MITM). <br></br>All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <Link href="/login" className="text-sky-400 font-bold hover:underline">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
