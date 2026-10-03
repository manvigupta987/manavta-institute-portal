"use client";

// Save as: app/student/verify-registration/page.tsx
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { printIdentityCard } from '@/lib/print-templates';

const PLACEHOLDER_PHOTO = 'https://iili.io/3jruEzl.md.jpg';

interface StudentHit {
  id: string;
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  study_center: string;
  session?: string;
  photo_url?: string;
}

// Only the columns this page actually needs -> fast query, no heavy data
const SELECT_COLS = 'id,roll_no,enrollment_no,student_name,father_name,course_name,study_center,session,photo_url';

export default function VerifyRegistrationPage() {
  const [nameInput, setNameInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  const [matches, setMatches] = useState<StudentHit[]>([]);
  const [selected, setSelected] = useState<StudentHit | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    const dob = dobInput.trim();

    // Both fields are mandatory
    if (!name || !dob) {
      setErrorMsg('Both Student Name and Date of Birth are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setMatches([]);
    setSelected(null);
    setSearched(true);

    try {
      // "manvi" or "manvi gupta" matches "MANVI GUPTA" (name STARTS WITH input).
      // A surname-only search like "gupta" will NOT match, since the name
      // doesn't start with it.
      const { data, error } = await supabase
        .from('students')
        .select(SELECT_COLS)
        .eq('status', 'APPROVED')
        .eq('dob', dob)
        .ilike('student_name', `${name}%`)
        .limit(20);

      if (error) throw error;

      if (!data || data.length === 0) {
        setErrorMsg('No matching student record found. Please check Name & Date of Birth.');
      } else if (data.length === 1) {
        setSelected(data[0] as StudentHit);
      } else {
        setMatches(data as StudentHit[]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!selected) return;
    printIdentityCard(selected);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
            🎓 Student Verification & ID Card
          </h1>
          <p className="text-xs text-slate-500">
            Enter Student Name (e.g. first name is enough) and Date of Birth to verify identity and download the ID card.
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Student Name * <span className="text-[10px] text-slate-400">(e.g. manvi / manvi gupta)</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter Student Name"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
            >
              {loading ? '🔍 Searching...' : '🔍 Search & Verify Student'}
            </button>
          </div>
        </form>

        {errorMsg && searched && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-bold text-center shadow-sm">
            ❌ {errorMsg}
          </div>
        )}

        {/* Multiple matches (e.g. two students with the same first name + same DOB) */}
        {matches.length > 0 && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase">
              {matches.length} matching records found — select yours:
            </p>
            <div className="divide-y divide-slate-100">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelected(m);
                    setMatches([]);
                  }}
                  className="w-full flex items-center justify-between py-2.5 text-left hover:bg-slate-50 px-2 rounded-lg transition"
                >
                  <div>
                    <div className="text-sm font-bold uppercase">{m.student_name}</div>
                    <div className="text-[11px] text-slate-500">
                      Roll: <span className="font-mono font-bold">{m.roll_no}</span> • {m.course_name}
                    </div>
                  </div>
                  <span className="text-sky-600 text-xs font-bold">View →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ID Card display */}
        {selected && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <span>🪪</span> Official Student Identity Card
              </span>
            </div>

            <div className="flex justify-center py-4 bg-slate-100 rounded-xl border border-slate-200">
              <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-2">
                  <img src="/logo.png" alt="Logo" className="h-10 object-contain" onError={(e: any) => (e.target.style.display = 'none')} />
                  <img src="/logo2.png" alt="Manavta Institute" className="h-7 object-contain flex-1" onError={(e: any) => (e.target.style.display = 'none')} />
                  <img src="/site.jpg" alt="Badge" className="h-9 object-contain" onError={(e: any) => (e.target.style.display = 'none')} />
                </div>

                <div className="flex items-start gap-4">
                  <div className="space-y-1.5 text-[12px] font-semibold flex-1 min-w-0">
                    <div><span className="font-bold">Roll No:</span> {selected.roll_no}</div>
                    <div><span className="font-bold">Enrollment No:</span> {selected.enrollment_no}</div>
                    <div><span className="font-bold">Name:</span> <span className="uppercase">{selected.student_name}</span></div>
                    <div><span className="font-bold">Fathers Name:</span> <span className="uppercase">{selected.father_name}</span></div>
                    <div><span className="font-bold">Course:</span> {selected.course_name}</div>
                    <div><span className="font-bold">Study Center:</span> {selected.study_center}</div>
                  </div>
                  <img
                    src={selected.photo_url || PLACEHOLDER_PHOTO}
                    alt={selected.student_name}
                    className="w-20 h-24 border border-slate-300 rounded-md object-cover flex-shrink-0 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-2"
              >
                🖨️ Print / Download ID Card
              </button>
              <p className="text-[10px] text-slate-400">Prints both the front and back of the card, Aadhar size (85.6mm × 53.9mm).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}