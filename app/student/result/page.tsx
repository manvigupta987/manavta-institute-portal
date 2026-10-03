"use client";

// Save as: app/student/result/page.tsx
//
// IMPORTANT: Students can ONLY ever see Grade + Pass/Fail here. No percentage,
// no subject-wise marks, no certificate access. The Marksheet and Certificate
// stay strictly inside the Admin Dashboard.
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { printResultCard } from '@/lib/print-templates';

const PLACEHOLDER_PHOTO = 'https://iili.io/3jruEzl.md.jpg';

interface StudentHit {
  id: string;
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  study_center: string;
  photo_url?: string;
}

interface ResultView {
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  study_center: string;
  photo_url?: string;
  grade: string;
  result: 'PASS' | 'FAIL';
}

const STUDENT_COLS = 'id,roll_no,enrollment_no,student_name,father_name,course_name,study_center,photo_url';
const MARKSHEET_COLS = 'grade';
const CERTIFICATE_COLS = 'grade';

export default function CheckResultPage() {
  const [nameInput, setNameInput] = useState('');
  const [rollInput, setRollInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  const [matches, setMatches] = useState<StudentHit[]>([]);
  const [result, setResult] = useState<ResultView | null>(null);

  const loadResultFor = async (student: StudentHit) => {
    const { data: msRows, error: msErr } = await supabase
      .from('marksheets')
      .select(MARKSHEET_COLS)
      .eq('roll_no', student.roll_no)
      .eq('enrollment_no', student.enrollment_no)
      .limit(1);

    if (msErr) {
      setErrorMsg('Error connecting to database. Please try again.');
      return;
    }

    let grade: string | null = null;

    if (msRows && msRows.length > 0) {
      grade = String(msRows[0].grade || '').toUpperCase();
    } else {
      const { data: certRows, error: certErr } = await supabase
        .from('certificates')
        .select(CERTIFICATE_COLS)
        .eq('roll_no', student.roll_no)
        .eq('enrollment_no', student.enrollment_no)
        .limit(1);

      if (certErr) {
        setErrorMsg('Error connecting to database. Please try again.');
        return;
      }

      if (certRows && certRows.length > 0) {
        grade = String(certRows[0].grade || '').toUpperCase();
      }
    }

    if (!grade) {
      setErrorMsg(`Result has not been declared yet for ${student.student_name}.`);
      return;
    }

    setResult({
      roll_no: student.roll_no,
      enrollment_no: student.enrollment_no,
      student_name: student.student_name,
      father_name: student.father_name,
      course_name: student.course_name,
      study_center: student.study_center,
      photo_url: student.photo_url,
      grade,
      result: grade === 'F' ? 'FAIL' : 'PASS',
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    const roll = rollInput.trim();

    // Both fields are mandatory
    if (!name || !roll) {
      setErrorMsg('Both Student Name and Roll Number are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setMatches([]);
    setResult(null);
    setSearched(true);

    try {
      // Name match is "starts with" (so "manvi" or "manvi gupta" matches
      // "MANVI GUPTA", but a surname-only search like "gupta" will not).
      const { data, error } = await supabase
        .from('students')
        .select(STUDENT_COLS)
        .eq('status', 'APPROVED')
        .eq('roll_no', roll)
        .ilike('student_name', `${name}%`)
        .limit(5);

      if (error) throw error;

      if (!data || data.length === 0) {
        setErrorMsg('No matching student found. Please check Name & Roll Number.');
      } else if (data.length === 1) {
        await loadResultFor(data[0] as StudentHit);
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

  const handlePickMatch = async (m: StudentHit) => {
    setMatches([]);
    setLoading(true);
    await loadResultFor(m);
    setLoading(false);
  };

  const handlePrint = () => {
    if (!result) return;
    printResultCard(result);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide">📊 Check Your Result</h1>
          <p className="text-xs text-slate-500">
            Enter your Name and Roll Number to view your result.
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
              <label className="block font-bold text-slate-700 uppercase mb-1">Roll Number *</label>
              <input
                type="text"
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                placeholder="e.g. 103766"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
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
              {loading ? '🔍 Searching...' : '🔍 View Result'}
            </button>
          </div>
        </form>

        {errorMsg && searched && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-bold text-center shadow-sm">
            ❌ {errorMsg}
          </div>
        )}

        {matches.length > 0 && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase">
              {matches.length} matching records found — select yours:
            </p>
            <div className="divide-y divide-slate-100">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handlePickMatch(m)}
                  className="w-full flex items-center justify-between py-2.5 text-left hover:bg-slate-50 px-2 rounded-lg transition"
                >
                  <div>
                    <div className="text-sm font-bold uppercase">{m.student_name}</div>
                    <div className="text-[11px] text-slate-500">
                      Roll: <span className="font-mono font-bold">{m.roll_no}</span> • {m.course_name}
                    </div>
                  </div>
                  <span className="text-sky-600 text-xs font-bold">View Result →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result card - Grade + Pass/Fail ONLY. No subject marks, no certificate. */}
        {result && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <span>📊</span> Result Summary
              </span>
              <span
                className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md border ${
                  result.result === 'PASS'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {result.result}
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
                    <div><span className="font-bold">Roll No:</span> {result.roll_no}</div>
                    <div><span className="font-bold">Enrollment No:</span> {result.enrollment_no}</div>
                    <div><span className="font-bold">Name:</span> <span className="uppercase">{result.student_name}</span></div>
                    <div><span className="font-bold">Fathers Name:</span> <span className="uppercase">{result.father_name}</span></div>
                    <div><span className="font-bold">Course:</span> {result.course_name}</div>
                    <div><span className="font-bold">Grade:</span> {result.grade}</div>
                    <div><span className="font-bold">Result:</span> {result.result === 'PASS' ? 'Pass' : 'Fail'}</div>
                    <div><span className="font-bold">Study Center:</span> {result.study_center}</div>
                  </div>
                  <img
                    src={result.photo_url || PLACEHOLDER_PHOTO}
                    alt={result.student_name}
                    className="w-20 h-24 border border-slate-300 rounded-md object-cover flex-shrink-0 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-2"
              >
                🖨️ Print / Download Result
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}