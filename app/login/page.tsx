"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Fixed Main Admin credentials (only one admin account exists)
const MAIN_ADMIN_USERNAME = 'ADMIN';
const MAIN_ADMIN_PASSWORD = 'Manavta#987';

export default function AdminLoginPage() {
  const router = useRouter();
  const [instituteCode, setInstituteCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedCode = instituteCode.trim();
    const trimmedPassword = password.trim();

    if (!trimmedCode || !trimmedPassword) {
      setError('Please enter both Institute Code and Password.');
      return;
    }

    setLoading(true);

    try {
      // 1) Check Main Admin (hardcoded, single account)
      if (trimmedCode.toUpperCase() === MAIN_ADMIN_USERNAME && trimmedPassword === MAIN_ADMIN_PASSWORD) {
        localStorage.setItem(
          'admin_session',
          JSON.stringify({ institute_code: 'ADMIN', institute_name: 'Main Admin' })
        );
        localStorage.removeItem('branch_session');
        router.push('/admin/dashboard');
        return;
      }

      // 2) Check Branch login against `branches` table
      // Branches log in with their Institute Code (or email) + the password set at registration.
      const { data: branchMatches, error: fetchError } = await supabase
        .from('branches')
        .select('*')
        .or(`institute_code.eq.${trimmedCode.toUpperCase()},email.eq.${trimmedCode}`);

      if (fetchError) {
        console.error('Branch login lookup error:', fetchError);
        setError('Connection error. Please check your network and try again.');
        setLoading(false);
        return;
      }

      const matchedBranch = (branchMatches || []).find((b: any) => b.password === trimmedPassword);

      if (matchedBranch) {
        localStorage.setItem(
          'branch_session',
          JSON.stringify({
            branch_code: matchedBranch.institute_code,
            branch_name: matchedBranch.institute_name,
            username: trimmedCode
          })
        );
        localStorage.removeItem('admin_session');
        router.push('/branch/dashboard');
        return;
      }

      // 3) Nothing matched
      setError('Invalid Institute Code or Password. Please try again.');
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please check your network and try again.');
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
              placeholder="e.g. ADMIN or MITM-BILARI"
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