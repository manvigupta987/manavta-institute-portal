"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [instituteCode, setInstituteCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!instituteCode.trim() || !password.trim()) {
      setErrorMsg('Please enter Institute Code and Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instituteCode: instituteCode.trim().toUpperCase(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store Admin Institute session in localStorage
        localStorage.setItem('adminSession', JSON.stringify({
          instituteCode: data.institute.institute_code,
          instituteName: data.institute.institute_name,
          email: data.institute.email,
          loggedInAt: new Date().toISOString(),
        }));

        router.push('/admin/dashboard');
      } else {
        setErrorMsg(data.message || 'Invalid Institute Code or Password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-slate-200">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-100 text-sky-600 rounded-full font-bold text-xl mb-3">
            MI
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Institute Admin Portal</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to manage your institute's students & results
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Institute Code*
            </label>
            <input
              type="text"
              value={instituteCode}
              onChange={(e) => setInstituteCode(e.target.value)}
              placeholder="e.g. MITM-DELHI"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password*
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-sm transition duration-150 disabled:opacity-50 mt-2 text-sm"
          >
            {loading ? 'Logging in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 space-y-2">
          <div>
            Don't have an Institute account?{' '}
            <Link href="/admin/register" className="text-sky-600 font-semibold hover:underline">
              Register New Institute
            </Link>
          </div>
          <div className="text-[11px] text-slate-400 border-t pt-3">
            Demo Credentials: Code: <span className="font-mono text-slate-600">MITM</span> | Password: <span className="font-mono text-slate-600">admin123</span>
          </div>
        </div>

      </div>
    </div>
  );
}
