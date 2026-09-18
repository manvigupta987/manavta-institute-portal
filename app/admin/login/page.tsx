"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [instituteCode, setInstituteCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instituteCode, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('admin_session', JSON.stringify(data.institute));
        router.push('/admin/dashboard');
      } else {
        // Fallback for demo admin credentials if API fails or env fallback
        const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'manavta@2026';

        if (instituteCode === adminUser && password === adminPass) {
          localStorage.setItem('admin_session', JSON.stringify({ institute_code: 'ADMIN', institute_name: 'Main Admin' }));
          router.push('/admin/dashboard');
        } else {
          setError(data.message || 'Invalid Institute Code or Password. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      // Hardcoded fallback if offline/error
      if (instituteCode === 'MITM' && password === 'admin123') {
        localStorage.setItem('admin_session', JSON.stringify({ institute_code: 'MITM', institute_name: 'Manavta Head Campus' }));
        router.push('/admin/dashboard');
      } else {
        setError('Connection error. Please check your network and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-8 max-w-md w-full">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center gap-3 mb-3">
            <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Institute Portal Login</h2>
          <p className="text-xs text-slate-500 mt-1">Manavta Institute Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Institute Code
            </label>
            <input
              type="text"
              value={instituteCode}
              onChange={(e) => setInstituteCode(e.target.value)}
              placeholder="e.g. MITM"
              className="w-full px-4 py-2.5 border text-slate-600 border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-2.5 border text-slate-600 border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center border-t pt-4 text-xs text-slate-400">
          Protected Area • Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}
