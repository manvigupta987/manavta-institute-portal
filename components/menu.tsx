"use client"; // Interactive dropdowns aur login state change ke liye

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  // 🔐 Auth state tracking (Aap ise baad me real auth/NextAuth se bind kar sakti hain)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 📱 Mobile responsive menu tracking
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 📂 Dropdowns active tracking ('about' | 'courses' | 'student' | null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Helper functions
  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-black shadow-md font-sans">
      
      {/* 🛠️ DEMO CONTROLLER (Sirf testing ke liye - isse aap live check kar sakti hain logged in aur logged out ka look) */}
      <div className="w-full bg-amber-500 text-slate-900 text-[11px] font-bold py-1 px-4 text-center flex justify-center items-center gap-2">
        <span>⚙️ Test Mode: Click to switch views ➜</span>
        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)} 
          className="bg-white px-2 py-0.5 rounded text-amber-700 hover:bg-slate-100 transition shadow-sm text-[10px]"
        >
          {isLoggedIn ? "Simulate Logged Out" : "Simulate Logged In"}
        </button>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        
        {/* 🏛️ LOGO AREA */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-red-800 font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black tracking-tight text-white leading-none">
              MANAVTA
            </span>
            <span className="text-[10px] font-bold text-amber-50 tracking-wider uppercase mt-1">
              INSTITUTE OF EDUCATION
            </span>
          </div>
        </Link>

        {/* 💻 DESKTOP LINK MENU */}
        <div className="hidden lg:flex items-center gap-6">
          
          {/* 1. Home */}
          <Link href="/" className="text-md font-bold text-white hover:text-orange-200 transition">
            Home
          </Link>

          {/* 2. About Us Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('about')}
              className="flex items-center gap-1 text-md font-bold text-white hover:text-orange-200 transition focus:outline-none py-1.5"
            >
              About Us
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {activeDropdown === 'about' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                <div className="absolute left-0 mt-2.5 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link href="/about/institute" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🏛️ About Institute
                  </Link>
                  <Link href="/about/director-message" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    👨‍💼 Director Message
                  </Link>
                  <Link href="/about/vision-mission" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🎯 Vision & Mission
                  </Link>
                  <Link href="/about/aims-objectives" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🚀 Aims and Objectives
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* 3. Accreditation */}
          <Link href="/accreditation" className="text-md font-bold text-white hover:text-orange-200 transition">
            Accreditation
          </Link>

          {/* 4. Courses Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('courses')}
              className="flex items-center gap-1 text-md font-bold text-white hover:text-orange-200 transition focus:outline-none py-1.5"
            >
              Courses
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'courses' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {activeDropdown === 'courses' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                <div className="absolute left-0 mt-2.5 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link href="/courses/professional" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    💼 Professional Courses
                  </Link>
                  <Link href="/courses/nielit" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🎓 NIELIT (O/A Level)
                  </Link>
                  <Link href="/courses/nios" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🏫 NIOS Board
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* 5. Student Corner Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('student')}
              className="flex items-center gap-1 text-md font-bold text-white hover:text-orange-200 transition focus:outline-none py-1.5"
            >
              Student Corner
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'student' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {activeDropdown === 'student' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                <div className="absolute left-0 mt-2.5 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link href="/student/verify-registration" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🔍 Verify Registration
                  </Link>
                  <Link href="/student/check-result" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    📝 Check Result
                  </Link>
                  <Link href="/student/facilities" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🏢 Facilities
                  </Link>
                  <Link href="/gallery" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition" onClick={() => setActiveDropdown(null)}>
                    🖼️ Gallery
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* 6. Enroll Now */}
          <Link href="/enroll-now" className="text-md font-bold text-white hover:text-red-700 transition">
            Enroll Now ⚡
          </Link>

          {/* 7. Contact Us */}
          <Link href="/contact" className="text-md font-bold text-white hover:text-orange-200 transition">
            Contact Us
          </Link>

        </div>

        {/* 🔐 AUTHENTICATION SECTION (RIGHT CORNER) */}
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            /* 🟢 LOGGED OUT VIEW: Show Register & Login buttons */
            <div className="flex items-center gap-1">
              <Link 
                href="/login" 
                className="text-md font-bold text-sky-100 hover:text-rose-200 transition py-2 px-1"
              >
                Log In
              </Link>
              <span className='text-md font-bold text--100 hover:text-rose-200 transition py-2 px-1"'>/</span>
              <Link 
                href="/admin/register" 
                className="text-md font-bold text-sky-100 hover:text-rose-200 transition py-2 px-1">
                Register
              </Link>
            </div>
          ) : (
            /* 🔵 LOGGED IN VIEW: Show small avatar circle with sub-dropdown */
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                {/* Clean user avatar initials block */}
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-black flex items-center justify-center border-2 border-sky-400 group-hover:border-sky-600 transition shadow-sm overflow-hidden">
                  {/* Agar user photo ho to yaha <img /> laga sakti hain, abhi mock letters use kiya hai */}
                  <span className="text-sm">MV</span>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Welcome back!</p>
                      <p className="text-xs font-bold text-slate-800">Manvi Verma</p>
                    </div>
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 font-bold"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      🎓 Student Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/profile" 
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 font-bold"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ⚙️ Edit Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-black border-t border-slate-50 mt-1.5"
                    >
                      🚪 Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 📱 MOBILE NAVIGATION HAMBURGER */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

      </div>

      {/* 📱 MOBILE SIDE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-t border-slate-100 py-5 px-6 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            
            {/* Mobile links */}
            <Link href="/" className="text-sm font-bold text-slate-800 pb-1" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>

            {/* Mobile About Us Accordion */}
            <div className="flex flex-col border-l-2 border-slate-100 pl-3 py-1 gap-2">
              <span className="text-[11px] font-black uppercase text-slate-400">About Us</span>
              <Link href="/about/institute" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• About Institute</Link>
              <Link href="/about/director-message" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Director Message</Link>
              <Link href="/about/vision-mission" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Vision & Mission</Link>
              <Link href="/about/aims-objectives" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Aims & Objectives</Link>
            </div>

            <Link href="/accreditation" className="text-sm font-bold text-slate-800 pb-1" onClick={() => setIsMobileMenuOpen(false)}>
              Accreditation
            </Link>

            {/* Mobile Courses Accordion */}
            <div className="flex flex-col border-l-2 border-slate-100 pl-3 py-1 gap-2">
              <span className="text-[11px] font-black uppercase text-slate-400">Courses</span>
              <Link href="/courses/professional" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Professional Courses</Link>
              <Link href="/courses/nielit" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• NIELIT (O/A Level)</Link>
              <Link href="/courses/nios" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• NIOS Board</Link>
            </div>

            {/* Mobile Student Corner Accordion */}
            <div className="flex flex-col border-l-2 border-slate-100 pl-3 py-1 gap-2">
              <span className="text-[11px] font-black uppercase text-slate-400">Student Corner</span>
              <Link href="/student/verify-registration" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Verify Registration</Link>
              <Link href="/student/check-result" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Check Result</Link>
              <Link href="/student/facilities" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Facilities</Link>
              <Link href="/gallery" className="text-xs font-semibold text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>• Gallery</Link>
            </div>

            <Link href="/enroll-now" className="text-sm font-bold text-emerald-600 pb-1" onClick={() => setIsMobileMenuOpen(false)}>
              Enroll Now ⚡
            </Link>
            
            <Link href="/contact" className="text-sm font-bold text-slate-800 pb-1" onClick={() => setIsMobileMenuOpen(false)}>
              Contact Us
            </Link>

            {/* Mobile Login / User Profile Strip */}
            <div className="border-t border-slate-100 pt-4 mt-2">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/login" 
                    className="w-full text-center py-2.5 text-sm font-bold text-sky-600 border border-sky-100 rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="w-full text-center py-2.5 text-sm font-bold text-white bg-sky-600 rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center border border-sky-300">
                      MV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-none">Manvi Verma</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Logged In</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-bold text-rose-600 bg-white py-1 px-3 rounded-lg border border-rose-100 shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
