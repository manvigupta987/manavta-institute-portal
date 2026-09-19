"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState<{ institute_name?: string; institute_code?: string; email?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchronize session state across all page navigations
  useEffect(() => {
    const checkSession = () => {
      const sessionStr = localStorage.getItem('admin_session');
      if (sessionStr) {
        setIsLoggedIn(true);
        try {
          const parsed = JSON.parse(sessionStr);
          setAdminData(parsed);
        } catch (e) {
          setAdminData({ institute_code: 'Admin', institute_name: 'Main Admin' });
        }
      } else {
        setIsLoggedIn(false);
        setAdminData(null);
      }
    };

    checkSession();
  }, [pathname]); // Runs on every route change so clicking Home/Verify keeps user logged in

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsLoggedIn(false);
    setAdminData(null);
    setIsDropdownOpen(false);
    router.push('/admin/login');
  };

  const getInitials = (code?: string) => {
    if (!code) return 'AD';
    return code.slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/mitm-logo.png" alt="MITM Logo" className="h-10 w-auto object-contain" />
            <span className="font-bold text-slate-800 text-base sm:text-lg hidden sm:inline-block">
              Manavta Institute Portal
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-600">
            <Link 
              href="/" 
              className={`hover:text-sky-600 transition ${pathname === '/' ? 'text-sky-600 font-semibold border-b-2 border-sky-600 pb-1' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/verify" 
              className={`hover:text-sky-600 transition ${pathname === '/verify' ? 'text-sky-600 font-semibold border-b-2 border-sky-600 pb-1' : ''}`}
            >
              Student Verification
            </Link>

            {/* Session Based Action Items */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* Admin Profile Logo / Avatar Trigger */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                    {getInitials(adminData?.institute_code)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-800 leading-none">
                      {adminData?.institute_code || 'Admin'}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold leading-tight flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Logged In
                    </p>
                  </div>
                  {/* Dropdown Arrow */}
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Info Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {adminData?.institute_name || 'Manavta Head Campus'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        Code: <span className="font-mono font-bold text-sky-700">{adminData?.institute_code || 'MITM'}</span>
                      </p>
                    </div>

                    {/* Options */}
                    <div className="py-1">
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        <span className="text-sm">📊</span>
                        Admin Dashboard
                      </Link>

                      <Link
                        href="/admin/dashboard?tab=profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        <span className="text-sm">⚙️</span>
                        Edit Profile / Change Password
                      </Link>
                    </div>

                    {/* Logout Option */}
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                      >
                        <span className="text-sm">🚪</span>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/login"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/admin/register"
                  className="px-3 py-2 text-slate-600 hover:text-sky-600 text-sm font-medium transition hidden sm:inline-block"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
