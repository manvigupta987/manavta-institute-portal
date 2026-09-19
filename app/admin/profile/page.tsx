"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'profile' | 'security'>('profile');

  // Session Data State
  const [adminSession, setAdminSession] = useState<{
    institute_code?: string;
    institute_name?: string;
    director_name?: string;
    email?: string;
    mobile_no?: string;
    address?: string;
  } | null>(null);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    instituteCode: '',
    instituteName: 'Manavta Institute of Technology & Management',
    directorName: 'Yogesh Chug',
    email: 'info@manavtainstitute.edu.in',
    mobileNo: '9876543210',
    address: 'Main Campus, Bilari, Moradabad, Uttar Pradesh'
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Security / Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Authentication & Session Guard
  useEffect(() => {
    const sessionStr = localStorage.getItem('admin_session');
    if (!sessionStr) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsed = JSON.parse(sessionStr);
      setAdminSession(parsed);
      setProfileForm((prev) => ({
        ...prev,
        instituteCode: parsed.institute_code || 'MITM',
        instituteName: parsed.institute_name || prev.instituteName,
        email: parsed.email || prev.email,
        mobileNo: parsed.mobile_no || prev.mobileNo,
        directorName: parsed.director_name || prev.directorName,
        address: parsed.address || prev.address
      }));
    } catch (e) {
      setProfileForm((prev) => ({ ...prev, instituteCode: 'MITM' }));
    }
  }, [router]);

  // Handle Edit Profile Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatus(null);

    try {
      const res = await fetch('/api/admin/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });

      const data = await res.json();
      if (res.ok) {
        setProfileStatus({ type: 'success', msg: 'Institute Profile updated successfully!' });
        // Update local session cache
        const updatedSession = {
          ...adminSession,
          institute_name: profileForm.instituteName,
          director_name: profileForm.directorName,
          email: profileForm.email,
          mobile_no: profileForm.mobileNo,
          address: profileForm.address
        };
        localStorage.setItem('admin_session', JSON.stringify(updatedSession));
      } else {
        setProfileStatus({ type: 'error', msg: data.message || 'Failed to update profile details.' });
      }
    } catch (err) {
      // Fallback local update if API endpoint pending
      setProfileStatus({ type: 'success', msg: 'Profile details saved locally to session!' });
      const updatedSession = {
        ...adminSession,
        institute_name: profileForm.instituteName,
        director_name: profileForm.directorName,
        email: profileForm.email,
        mobile_no: profileForm.mobileNo,
        address: profileForm.address
      };
      localStorage.setItem('admin_session', JSON.stringify(updatedSession));
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Password Change Submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordStatus(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'New Password and Confirm Password do not match!' });
      setPasswordSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', msg: 'New password must be at least 6 characters long.' });
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instituteCode: profileForm.instituteCode,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({
          type: 'success',
          msg: 'Password changed successfully! Next time please login with your new password.'
        });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordStatus({ type: 'error', msg: data.message || 'Failed to change password.' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', msg: 'Network error. Could not connect to password service.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">
      
      {/* 🧭 TOP BANNER & BACK NAVIGATION */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl transition border border-slate-700 flex items-center gap-2 text-xs font-bold"
            >
              ← Dashboard
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Admin Profile & Settings</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Institute Code: <span className="text-sky-400 font-mono font-bold">{profileForm.instituteCode || 'MITM'}</span>
              </p>
            </div>
          </div>

          {/* Quick Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem('admin_session');
              router.push('/admin/login');
            }}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg transition"
          >
            Log Out Session
          </button>
        </div>
      </div>

      {/* 📦 MAIN CONTENT LAYOUT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Layout Grid: Left Sidebar Navigation & Main Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 👈 LEFT NAVIGATION CARD */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Institute Identity Summary Badge */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg border-4 border-slate-50 mb-3">
                {profileForm.instituteCode ? profileForm.instituteCode.slice(0, 2).toUpperCase() : 'MI'}
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {profileForm.instituteName}
              </h2>
              <p className="text-xs text-sky-600 font-semibold mt-1">
                Authorized Center • {profileForm.instituteCode}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Account
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm space-y-1">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeSection === 'profile'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-base">🏢</span>
                Edit Institute Profile
              </button>

              <button
                onClick={() => setActiveSection('security')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeSection === 'security'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-base">🔑</span>
                Security & Change Password
              </button>
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-xs text-sky-900">
              <p className="font-bold flex items-center gap-1.5 mb-1 text-sky-900">
                <span>🔒</span> Security Tip
              </p>
              <p className="text-sky-800 leading-relaxed text-[11px]">
                Always use a strong password with letters, numbers, and symbols to protect student and certificate records.
              </p>
            </div>

          </div>

          {/* 👉 RIGHT FORM CONTAINER */}
          <div className="lg:col-span-8">
            
            {/* SECTION 1: EDIT INSTITUTE PROFILE */}
            {activeSection === 'profile' && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
                
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>🏢</span> Institute Profile Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Update your official center details, contact information and director name.
                  </p>
                </div>

                {profileStatus && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-semibold ${
                      profileStatus.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {profileStatus.msg}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Institute Code (Locked)
                      </label>
                      <input
                        type="text"
                        value={profileForm.instituteCode}
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Director / Head Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.directorName}
                        onChange={(e) => setProfileForm({ ...profileForm, directorName: e.target.value })}
                        placeholder="e.g. Yogesh Chug"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Institute Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileForm.instituteName}
                      onChange={(e) => setProfileForm({ ...profileForm, instituteName: e.target.value })}
                      placeholder="Enter Institute Name"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="info@institute.com"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Contact Mobile No *
                      </label>
                      <input
                        type="text"
                        value={profileForm.mobileNo}
                        onChange={(e) => setProfileForm({ ...profileForm, mobileNo: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Campus Address
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Enter full address"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>

                </form>

              </div>
            )}

            {/* SECTION 2: CHANGE PASSWORD & SECURITY */}
            {activeSection === 'security' && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
                
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>🔑</span> Change Account Password
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your current password and choose a secure new password for your account.
                  </p>
                </div>

                {passwordStatus && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-semibold ${
                      passwordStatus.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {passwordStatus.msg}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                  
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                      >
                        {showCurrent ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Enter new password (min. 6 chars)"
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                      >
                        {showNew ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Re-type new password"
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                      >
                        {showConfirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      {passwordSaving ? 'Updating Password...' : 'Update Password Now'}
                    </button>
                  </div>

                </form>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
