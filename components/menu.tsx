"use client";

// Save as: components/Menu.tsx  (same place as your current Menu file)
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type Role = 'admin' | 'branch' | null;

// One list for links -> desktop and mobile always stay in sync (no more 404 mismatches)
const ABOUT_LINKS = [
  { href: '/about/institute', label: '🏛️ About Institute', short: 'About Institute' },
  { href: '/about/message', label: '👨‍💼 Director Message', short: 'Director Message' },
  { href: '/about/vision-mission', label: '🎯 Vision & Mission', short: 'Vision & Mission' },
  { href: '/about/aims-objectives', label: '🚀 Aims and Objectives', short: 'Aims & Objectives' },
];

const COURSE_LINKS = [
  { href: '/courses/professional', label: '💼 Professional Courses', short: 'Professional Courses' },
  { href: '/courses/nielit', label: '🎓 NIELIT (O/A Level)', short: 'NIELIT (O/A Level)' },
  { href: '/courses/nios', label: '🏫 NIOS Board', short: 'NIOS Board' },
];

const STUDENT_LINKS = [
  { href: '/student/verify-registration', label: '🔍 Verify Registration', short: 'Verify Registration' },
  { href: '/student/result', label: '📝 Check Result', short: 'Check Result' },
  { href: '/student/facilities', label: '🏢 Facilities', short: 'Facilities' },
  { href: '/gallery', label: '🖼️ Gallery', short: 'Gallery' },
];

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<{ name: string; code: string } | null>(null);
  const isLoggedIn = role !== null;

  // Read the session (Main Admin OR Branch) so the menu stays correct on every page
  const checkSession = () => {
    const adminStr = localStorage.getItem('admin_session');
    if (adminStr) {
      let p: any = {};
      try { p = JSON.parse(adminStr); } catch (e) {}
      setRole('admin');
      setUser({ name: p.institute_name || 'Manavta Admin', code: p.institute_code || 'ADMIN' });
      return;
    }

    const branchStr = localStorage.getItem('branch_session');
    if (branchStr) {
      let p: any = {};
      try { p = JSON.parse(branchStr); } catch (e) {}
      setRole('branch');
      setUser({ name: p.branch_name || 'Branch', code: p.branch_code || 'BRANCH' });
      return;
    }

    setRole(null);
    setUser(null);
  };

  useEffect(() => {
    checkSession();
    // close everything whenever the page changes
    setIsMobileMenuOpen(false);
    setMobileAccordion(null);
    setActiveDropdown(null);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // keep login state in sync if another tab logs in / out
  useEffect(() => {
    const onStorage = () => checkSession();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('branch_session');
    setRole(null);
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  const dashboardHref = role === 'branch' ? '/branch/dashboard' : '/admin/dashboard';
  const dashboardLabel = role === 'branch' ? '🏛️ Branch Dashboard' : '🎓 Admin Dashboard';

  // ---- desktop dropdown (same look as before) ----
  const renderDesktopDropdown = (
    key: string,
    title: string,
    links: { href: string; label: string }[]
  ) => (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(key)}
        className="flex items-center gap-1 text-sm xl:text-base font-bold text-white hover:text-orange-200 transition focus:outline-none py-1.5 cursor-pointer whitespace-nowrap"
      >
        {title}
        <Chevron open={activeDropdown === key} />
      </button>

      {activeDropdown === key && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
          <div className="absolute left-0 mt-2.5 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold transition"
                onClick={() => setActiveDropdown(null)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // ---- mobile accordion ----
  const renderMobileAccordion = (
    key: string,
    title: string,
    links: { href: string; short: string }[]
  ) => {
    const open = mobileAccordion === key;
    return (
      <div className="border-l-2 border-slate-100 pl-3 py-1">
        <button
          onClick={() => setMobileAccordion(open ? null : key)}
          className="w-full flex items-center justify-between text-sm font-bold text-slate-800 py-1 cursor-pointer"
        >
          <span>{title}</span>
          <Chevron open={open} />
        </button>
        {open && (
          <div className="flex flex-col gap-2.5 mt-2 pb-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-semibold text-slate-700 pl-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                • {l.short}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-black shadow-md font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-3">

        {/* 🏛️ LOGO AREA */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-rose-100 flex items-center justify-center text-red-800 font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white leading-none">
              MANAVTA
            </span>
            <span className="text-[8px] sm:text-[10px] font-bold text-amber-50 tracking-wider uppercase mt-1">
              INSTITUTE OF EDUCATION
            </span>
          </div>
        </Link>

        {/* 💻 DESKTOP LINK MENU */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <Link href="/" className="text-sm xl:text-base font-bold text-white hover:text-orange-200 transition whitespace-nowrap">
            Home
          </Link>

          {renderDesktopDropdown('about', 'About Us', ABOUT_LINKS)}

          <Link href="/accreditation" className="text-sm xl:text-base font-bold text-white hover:text-orange-200 transition whitespace-nowrap">
            Accreditation
          </Link>

          {renderDesktopDropdown('courses', 'Courses', COURSE_LINKS)}
          {renderDesktopDropdown('student', 'Student Corner', STUDENT_LINKS)}

          <Link href="/enroll-now" className="text-sm xl:text-base font-bold text-amber-300 hover:text-amber-100 transition whitespace-nowrap">
            Enroll Now ⚡
          </Link>

          <Link href="/contact" className="text-sm xl:text-base font-bold text-white hover:text-orange-200 transition whitespace-nowrap">
            Contact Us
          </Link>
        </div>

        {/* 🔐 AUTHENTICATION SECTION (RIGHT CORNER) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {!isLoggedIn ? (
            <div className="flex items-center gap-1">
              <Link href="/login" className="text-sm xl:text-base font-bold text-sky-100 hover:text-rose-200 transition py-2 px-1">
                Log In
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setActiveDropdown(null);
                }}
                className="flex items-center gap-2 focus:outline-none group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-black flex items-center justify-center border-2 border-sky-400 group-hover:border-sky-600 transition shadow-sm overflow-hidden">
                  <span className="text-sm font-bold">{user?.code ? user.code.slice(0, 2).toUpperCase() : 'MV'}</span>
                </div>
                <svg className={`w-3.5 h-3.5 text-white group-hover:text-amber-300 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3.5 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1.5 bg-slate-50/80 rounded-t-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Welcome back!</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[10px] font-mono font-semibold text-sky-700">Code: {user?.code}</p>
                    </div>

                    <Link
                      href={dashboardHref}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 font-bold transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {dashboardLabel}
                    </Link>

                    {role === 'admin' && (
                      <Link
                        href="/admin/profile?tab=profile"
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 font-bold transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        ⚙️ Edit Profile / Change Password
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-black border-t border-slate-100 mt-1.5 cursor-pointer"
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
          aria-label="Toggle menu"
          className="lg:hidden p-2 rounded-lg text-white hover:bg-slate-800 transition focus:outline-none cursor-pointer"
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

      {/* 📱 MOBILE / TABLET DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-t border-slate-100 py-4 px-5 sm:px-6 animate-in fade-in slide-in-from-top duration-200 text-slate-800 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-bold text-slate-800 py-1" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>

            {renderMobileAccordion('about', 'About Us', ABOUT_LINKS)}

            <Link href="/accreditation" className="text-sm font-bold text-slate-800 py-1" onClick={() => setIsMobileMenuOpen(false)}>
              Accreditation
            </Link>

            {renderMobileAccordion('courses', 'Courses', COURSE_LINKS)}
            {renderMobileAccordion('student', 'Student Corner', STUDENT_LINKS)}

            <Link href="/enroll-now" className="text-sm font-bold text-emerald-600 py-1" onClick={() => setIsMobileMenuOpen(false)}>
              Enroll Now ⚡
            </Link>

            <Link href="/contact" className="text-sm font-bold text-slate-800 py-1" onClick={() => setIsMobileMenuOpen(false)}>
              Contact Us
            </Link>

            {/* Mobile Login / User Strip */}
            <div className="border-t border-slate-100 pt-4 mt-1">
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="block w-full text-center py-2.5 text-sm font-bold text-sky-600 border border-sky-100 rounded-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center border border-sky-300 shrink-0">
                        {user?.code ? user.code.slice(0, 2).toUpperCase() : 'MV'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-none truncate">{user?.name}</p>
                        <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Logged In • {user?.code}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-xs font-bold text-rose-600 bg-white py-1 px-3 rounded-lg border border-rose-100 shadow-sm cursor-pointer shrink-0"
                    >
                      Logout
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={dashboardHref}
                      className="block w-full text-center py-2 text-xs font-bold text-sky-700 bg-sky-50 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dashboardLabel}
                    </Link>
                    {role === 'admin' && (
                      <Link
                        href="/admin/profile?tab=profile"
                        className="block w-full text-center py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ⚙️ Edit Profile / Change Password
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}