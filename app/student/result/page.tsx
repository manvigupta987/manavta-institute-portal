"use client";

// Save as: app/student/result/page.tsx
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { printMarksheet, formatDate } from '@/lib/print-templates';

const PLACEHOLDER_PHOTO = 'https://iili.io/3jruEzl.md.jpg';

export default function CheckResultPage() {
  const [rollNo, setRollNo] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResult(null);

    const roll = rollNo.trim();
    if (!roll || !dob) {
      setErrorMsg('Please enter both Roll Number and Date of Birth.');
      return;
    }

    setLoading(true);

    try {
      // 1) Verify identity: Roll No + DOB must match an approved student (indexed lookup)
      const { data: stu, error: stuErr } = await supabase
        .from('students')
        .select('id')
        .eq('roll_no', roll)
        .eq('dob', dob)
        .eq('status', 'APPROVED')
        .limit(1);

      if (stuErr) throw stuErr;
      if (!stu || stu.length === 0) {
        setErrorMsg('No student found with this Roll Number and Date of Birth.');
        return;
      }

      // 2) Fetch the marksheet
      const { data: ms, error: msErr } = await supabase
        .from('marksheets')
        .select('*')
        .eq('roll_no', roll)
        .order('created_at', { ascending: false })
        .limit(1);

      if (msErr) throw msErr;
      if (!ms || ms.length === 0) {
        setErrorMsg('Result has not been declared yet for this Roll Number.');
        return;
      }

      const r = ms[0];
      setResult({
        ...r,
        subjects: Array.isArray(r.subjects) ? r.subjects : [],
        grand_total_obtained: Number(r.grand_total_obtained) || 0,
        grand_total_max: Number(r.grand_total_max) || 0,
        percentage: Number(r.percentage) || 0,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide">📊 Check Your Result</h1>
          <p className="text-xs text-slate-500">Enter your Roll Number and Date of Birth to view your statement of marks.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 103766"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
            >
              {loading ? '🔍 Searching...' : '🔍 View Result'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-bold text-center shadow-sm">
            ❌ {errorMsg}
          </div>
        )}

        {result && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-5 text-black text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-bold uppercase tracking-wide">Statement of Marks</span>
              <button
                onClick={() => printMarksheet(result, { topMarginMm: 15, showHeader: true })}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition cursor-pointer"
              >
                🖨️ Print / Download
              </button>
            </div>

            <div className="flex justify-between items-start gap-4 border-2 border-black p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 flex-1">
                <div><span className="font-extrabold">PROGRAMME:</span> <span className="font-bold">{result.course_name}</span></div>
                <div><span className="font-extrabold">SESSION:</span> <span className="font-bold">{result.session}</span></div>
                <div><span className="font-extrabold">ROLL NO:</span> <span className="font-black">{result.roll_no}</span></div>
                <div><span className="font-extrabold">ENROLLMENT NO:</span> <span className="font-black">{result.enrollment_no}</span></div>
                <div><span className="font-extrabold">CANDIDATE:</span> <span className="font-extrabold uppercase">{result.student_name}</span></div>
                <div><span className="font-extrabold">FATHER:</span> <span className="font-bold uppercase">{result.father_name}</span></div>
                <div><span className="font-extrabold">DOB:</span> <span className="font-bold">{formatDate(result.dob) || 'N/A'}</span></div>
                <div><span className="font-extrabold">STUDY CENTER:</span> <span className="font-bold">{result.study_center}</span></div>
              </div>
              <img src={result.photo_url || PLACEHOLDER_PHOTO} alt="Student" className="w-20 h-24 object-cover border-2 border-black shrink-0" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-black text-center">
                <thead className="font-extrabold">
                  <tr className="border-b-2 border-black">
                    <th className="p-2 border-r border-black">PAPER CODE</th>
                    <th className="p-2 border-r border-black text-left">EXAM / PAPER NAME</th>
                    <th className="p-2 border-r border-black">MAX</th>
                    <th className="p-2 border-r border-black">THEORY</th>
                    <th className="p-2 border-r border-black">PRACTICAL</th>
                    <th className="p-2">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="font-semibold">
                  {result.subjects.map((s: any, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="p-2 border-r border-black font-mono font-bold">{s.paper_code}</td>
                      <td className="p-2 border-r border-black text-left uppercase">{s.paper_name}</td>
                      <td className="p-2 border-r border-black">{s.max_marks}</td>
                      <td className="p-2 border-r border-black">{s.theory}</td>
                      <td className="p-2 border-r border-black">{s.practical}</td>
                      <td className="p-2 font-bold">{s.total_marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 border-2 border-black p-3 font-extrabold">
              <div>GRAND TOTAL: {result.grand_total_obtained} / {result.grand_total_max}</div>
              <div>PERCENTAGE: {result.percentage}%</div>
              <div>FINAL GRADE: {result.grade}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}