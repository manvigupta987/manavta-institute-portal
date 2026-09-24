"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// =========================================================================
// TYPES
// =========================================================================
interface BranchStudent {
  id?: string;
  branch_code: string;
  branch_name: string;
  student_name: string;
  father_name: string;
  mother_name?: string;
  course_name: string;
  admission_date: string;
  dob?: string;
  mobile_no?: string;
  aadhar_no: string; // Mandatory & Strict Unique
  photo_url?: string;
  gender?: string;
  enrollment_no: string; // "NOT_ISSUED" (display only) until admin assigns real one
  roll_no: string;       // "NOT_ISSUED" (display only) until admin assigns real one
  status: 'PENDING_APPROVAL' | 'APPROVED';
  created_at?: string;
}

export default function BranchDashboardPage() {
  const router = useRouter();

  // Branch Session Data
  const [branchSession, setBranchSession] = useState<{
    branch_code: string;
    branch_name: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('branch_session');
    if (sessionStr) {
      try {
        setBranchSession(JSON.parse(sessionStr));
      } catch (e) {
        setBranchSession({ branch_code: 'MITM-CH01', branch_name: 'MITM Chandausi Branch', username: 'chandausi_admin' });
      }
    } else {
      setBranchSession({ branch_code: 'MITM-CH01', branch_name: 'MITM Chandausi Branch', username: 'chandausi_admin' });
    }
  }, []);

  // Form State (NO Roll No or Enrollment No fields allowed for Branch)
  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    mother_name: '',
    course_name: 'Computerised Professional Accounting Course',
    admission_date: new Date().toISOString().split('T')[0],
    dob: '',
    mobile_no: '',
    aadhar_no: '',
    photo_url: '',
    gender: 'Male'
  });

  // Branch Records - now loaded from Supabase (students table), not hardcoded
  const [studentList, setStudentList] = useState<BranchStudent[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const [searchQuery, setSearchSearchQuery] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [selectedStudentForView, setSelectedStudentForView] = useState<BranchStudent | null>(null);

  // -------------------------------------------------------------------------
  // Map a raw Supabase students row -> BranchStudent shape used by the UI
  // -------------------------------------------------------------------------
  const mapRowToBranchStudent = (s: any, branchName: string): BranchStudent => ({
    id: s.id,
    branch_code: s.branch_code,
    branch_name: branchName,
    student_name: s.student_name,
    father_name: s.father_name,
    mother_name: s.mother_name || '',
    course_name: s.course_name,
    admission_date: s.admission_date,
    dob: s.dob || '',
    mobile_no: s.mobile_no || '',
    aadhar_no: s.aadhar_no || '',
    photo_url: s.photo_url || 'https://iili.io/3jruEzl.md.jpg',
    gender: s.gender || '',
    enrollment_no: s.enrollment_no && s.enrollment_no.startsWith('PENDING-') ? 'NOT_ISSUED' : s.enrollment_no,
    roll_no: s.roll_no ? s.roll_no : 'NOT_ISSUED',
    status: s.status === 'APPROVED' ? 'APPROVED' : 'PENDING_APPROVAL',
    created_at: s.created_at
  });

  // -------------------------------------------------------------------------
  // Load this branch's students from Supabase (so data survives login/logout)
  // -------------------------------------------------------------------------
  const fetchBranchStudents = async (branchCode: string, branchName: string) => {
    setIsLoadingList(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('branch_code', branchCode)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch branch students error:', error);
      setFormStatus({ type: 'error', msg: '❌ Could not load your submitted records: ' + error.message });
      setIsLoadingList(false);
      return;
    }

    setStudentList((data || []).map((row: any) => mapRowToBranchStudent(row, branchName)));
    setIsLoadingList(false);
  };

  useEffect(() => {
    if (branchSession?.branch_code) {
      fetchBranchStudents(branchSession.branch_code, branchSession.branch_name);
    }
  }, [branchSession?.branch_code]);

  // -------------------------------------------------------------------------
  // 1. SINGLE STUDENT FORM SUBMISSION WITH STRICT AADHAR CHECK (DB-backed)
  // -------------------------------------------------------------------------
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus(null);

    const cleanAadhar = formData.aadhar_no.trim();

    if (!cleanAadhar) {
      setFormStatus({ type: 'error', msg: 'Aadhar Number is strictly required for admission!' });
      return;
    }

    const digitsOnly = cleanAadhar.replace(/\D/g, '');
    const selectedCourse = formData.course_name.trim();

    // DUPLICATE CHECK - same Aadhar is fine (a student can take multiple
    // courses), but the SAME Aadhar + SAME Course combination is blocked.
    const { data: existingMatches, error: checkError } = await supabase
      .from('students')
      .select('id, aadhar_no, course_name')
      .not('aadhar_no', 'is', null);

    if (checkError) {
      setFormStatus({ type: 'error', msg: '❌ Could not verify Aadhar right now. Please try again.' });
      return;
    }

    const isDuplicateAdmission = (existingMatches || []).some(
      (s: any) =>
        (s.aadhar_no || '').replace(/\D/g, '') === digitsOnly &&
        (s.course_name || '').trim().toLowerCase() === selectedCourse.toLowerCase()
    );

    if (isDuplicateAdmission) {
      setFormStatus({
        type: 'error',
        msg: `❌ Duplicate Admission Error: Student with Aadhar No. [${cleanAadhar}] is ALREADY registered for "${selectedCourse}"! (Same Aadhar can take admission in a different course.)`
      });
      return;
    }

    // enrollment_no is UNIQUE + NOT NULL in the DB, so every pending student
    // gets its own unique placeholder until Main Admin assigns the real one.
    const placeholderEnrollment = `PENDING-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const payload = {
      enrollment_no: placeholderEnrollment,
      roll_no: null,
      student_name: formData.student_name.trim().toUpperCase(),
      father_name: formData.father_name.trim().toUpperCase(),
      mother_name: formData.mother_name.trim().toUpperCase() || null,
      course_name: formData.course_name.trim(),
      admission_date: formData.admission_date,
      dob: formData.dob || null,
      mobile_no: formData.mobile_no.trim() || null,
      aadhar_no: cleanAadhar,
      photo_url: formData.photo_url.trim() || 'https://iili.io/3jruEzl.md.jpg',
      status: 'PENDING_APPROVAL',
      branch_code: branchSession?.branch_code || 'BRANCH',
      study_center: branchSession?.branch_name || 'MITM',
    };

    const { data, error } = await supabase
      .from('students')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      setFormStatus({ type: 'error', msg: '❌ Failed to save to database: ' + error.message });
      return;
    }

    const newRecord = mapRowToBranchStudent(data, branchSession?.branch_name || 'Branch Office');
    setStudentList([newRecord, ...studentList]);
    setFormStatus({
      type: 'success',
      msg: '✅ Student Admission details submitted successfully! Sent to Main Admin MITM for Roll No & Enrollment No assignment.'
    });

    // Reset Form
    setFormData({
      student_name: '',
      father_name: '',
      mother_name: '',
      course_name: 'Computerised Professional Accounting Course',
      admission_date: new Date().toISOString().split('T')[0],
      dob: '',
      mobile_no: '',
      aadhar_no: '',
      photo_url: '',
      gender: 'Male'
    });
  };

  // -------------------------------------------------------------------------
  // 2. BULK CSV / EXCEL UPLOAD WITH STRICT AADHAR CHECK (DB-backed)
  // -------------------------------------------------------------------------
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

        if (lines.length <= 1) {
          setFormStatus({ type: 'error', msg: 'CSV file is empty or missing headers.' });
          return;
        }

        // Pull every existing Aadhar+Course combo from the DB once, to check duplicates against
        const { data: existingRows, error: fetchErr } = await supabase
          .from('students')
          .select('aadhar_no, course_name')
          .not('aadhar_no', 'is', null);

        if (fetchErr) {
          setFormStatus({ type: 'error', msg: '❌ Could not verify existing records: ' + fetchErr.message });
          return;
        }

        // Key = digitsOnlyAadhar + "::" + lowercased course name
        const existingCombos = new Set(
          (existingRows || []).map(
            (r: any) => `${(r.aadhar_no || '').replace(/\D/g, '')}::${(r.course_name || '').trim().toLowerCase()}`
          )
        );

        const rowsToInsert: any[] = [];
        let duplicateCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 4) {
            const aadhar = cols[5] || '';
            const cleanA = aadhar.replace(/\D/g, '');
            const rowCourse = cols[3] || 'Professional Course';
            const combo = `${cleanA}::${rowCourse.trim().toLowerCase()}`;

            if (cleanA && existingCombos.has(combo)) {
              duplicateCount++;
              continue; // Skip duplicate Aadhar+Course combination
            }
            if (cleanA) existingCombos.add(combo);

            rowsToInsert.push({
              enrollment_no: `PENDING-${Date.now()}-${i}-${Math.floor(Math.random() * 10000)}`,
              roll_no: null,
              student_name: (cols[0] || 'STUDENT').toUpperCase(),
              father_name: (cols[1] || '').toUpperCase(),
              mother_name: (cols[2] || '').toUpperCase() || null,
              course_name: cols[3] || 'Professional Course',
              admission_date: cols[4] || new Date().toISOString().split('T')[0],
              aadhar_no: aadhar || null,
              mobile_no: cols[6] || null,
              dob: cols[7] || null,
              photo_url: cols[8] || 'https://iili.io/3jruEzl.md.jpg',
              status: 'PENDING_APPROVAL',
              branch_code: branchSession?.branch_code || 'BRANCH',
              study_center: branchSession?.branch_name || 'MITM',
            });
          }
        }

        if (rowsToInsert.length > 0) {
          const { data: inserted, error: insertErr } = await supabase
            .from('students')
            .insert(rowsToInsert)
            .select();

          if (insertErr) {
            console.error('Bulk insert error:', insertErr);
            setFormStatus({ type: 'error', msg: '❌ Bulk upload failed: ' + insertErr.message });
            return;
          }

          const mapped = (inserted || []).map((row: any) =>
            mapRowToBranchStudent(row, branchSession?.branch_name || 'Branch Office')
          );

          setStudentList([...mapped, ...studentList]);
          setFormStatus({
            type: 'success',
            msg: `✅ Successfully imported ${mapped.length} student records! ${
              duplicateCount > 0 ? `(Skipped ${duplicateCount} duplicate Aadhar+Course records)` : ''
            }`
          });
        } else if (duplicateCount > 0) {
          setFormStatus({
            type: 'error',
            msg: `❌ All ${duplicateCount} records in the CSV were skipped — same Aadhar is already admitted in the same course!`
          });
        }
      } catch (err) {
        console.error(err);
        setFormStatus({ type: 'error', msg: 'Failed to parse CSV file. Please check format.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Student_Name,Father_Name,Mother_Name,Course_Name,Admission_Date,Aadhar_No,Mobile_No,DOB,Photo_URL\nAMIT KUMAR,RAMESH KUMAR,SUNITA DEVI,Computerised Professional Accounting Course,01.08.2025,9988-7766-5544,9876543210,15.08.2005,https://iili.io/3jruEzl.md.jpg';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Branch_Student_Admission_Sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTable = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      
      {/* Printable CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
          }
          #branch-table-container, #branch-table-container * {
            visibility: visible;
          }
          #branch-table-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Header Bar */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow-md flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 font-black text-lg flex items-center justify-center shadow">
            🏛️
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              {branchSession?.branch_name || 'Branch Student Admission Portal'}
            </h1>
            <p className="text-xs text-amber-300 font-mono">
              Branch Code: <span className="font-bold">{branchSession?.branch_code || 'MITM-BRANCH'}</span> | Status: Active Authorized Branch
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('branch_session');
            router.push('/login');
          }}
          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shadow transition cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Important Authority Notice Box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm text-xs text-amber-900 space-y-1 no-print">
          <p className="font-bold text-sm flex items-center gap-2">
            <span>ℹ️</span> Branch Registration Guidelines & Rules:
          </p>
          <p>
            1. <strong>No Authority for Roll/Enrollment No:</strong> Roll Number & Enrollment Number are assigned exclusively by <strong>Main Admin (MITM)</strong> after reviewing your submitted student data.
          </p>
          <p>
            2. <strong>Strict Unique Aadhar Rule:</strong> Students with an existing Aadhar Number cannot be re-registered.
          </p>
          <p>
            3. <strong>Read-Only Submission:</strong> Once a student form is submitted, it cannot be modified by the branch.
          </p>
          <p>
            4. <strong>ID Card Printing:</strong> ID Card printing is disabled for branches until Main Admin assigns the official Enrollment Number.
          </p>
        </div>

        {/* Global Notification */}
        {formStatus && (
          <div
            className={`p-4 rounded-xl border text-xs font-bold shadow-sm no-print ${
              formStatus.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            {formStatus.msg}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. STUDENT ADMISSION ENTRY FORM */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6 no-print">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>✍️</span> Student Admission Entry Form
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill in student details. Data will be transmitted to Main Admin MITM for Roll & Enrollment assignment.
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Branch Entry Mode
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. SHREYA CHUG"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Father&apos;s Name *
                </label>
                <input
                  type="text"
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  placeholder="e.g. YOGESH CHUG"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mother&apos;s Name
                </label>
                <input
                  type="text"
                  value={formData.mother_name}
                  onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                  placeholder="e.g. SUNITA DEVI"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Aadhar Number (Mandatory & Unique) *
                </label>
                <input
                  type="text"
                  value={formData.aadhar_no}
                  onChange={(e) => setFormData({ ...formData, aadhar_no: e.target.value })}
                  placeholder="e.g. 1234-5678-9012"
                  className="w-full px-3 py-2 border-2 border-amber-300 bg-amber-50/50 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Course Name *
                </label>
                <select
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 font-semibold"
                  required
                >
                  <option value="Computerised Professional Accounting Course">Computerised Professional Accounting Course</option>
                  <option value="Advance Diploma In Computer Software">Advance Diploma In Computer Software</option>
                  <option value="Advance Diploma In Computer Application">Advance Diploma In Computer Application</option>
                  <option value="Data Entry Operator">Data Entry Operator</option>
                  <option value="Computer Teacher Training Course">Computer Teacher Training Course</option>
                  <option value="Advance Diploma in IT & Management">Advance Diploma in IT & Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admission Date *
                </label>
                <input
                  type="date"
                  value={formData.admission_date}
                  onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Date of Birth (DOB)
                </label>
                <input
                  type="text"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  placeholder="e.g. 15.08.2005"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.mobile_no}
                  onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo Link / URL
                </label>
                <input
                  type="text"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="Paste image URL (Optional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-2"
              >
                <span>🚀</span> Submit Admission Details to Main Admin
              </button>
            </div>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* 2. BULK CSV UPLOAD FOR BRANCH */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4 no-print">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span>📁</span> Bulk Upload Admission Records via CSV
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload CSV file for batch admission. System will automatically reject duplicate Aadhar numbers.
              </p>
            </div>
            <button
              onClick={downloadSampleCSV}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <span>📥</span> Download Branch CSV Template
            </button>
          </div>

          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-900 hover:file:bg-amber-600 cursor-pointer"
          />
        </div>

        {/* ========================================================================= */}
        {/* 3. SUBMITTED BRANCH STUDENTS TABLE */}
        {/* ========================================================================= */}
        <div id="branch-table-container" className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                📋 Submitted Students Records ({studentList.length})
              </h3>
              <p className="text-xs text-slate-500">
                Track approval status from Main Admin MITM.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchSearchQuery(e.target.value)}
                placeholder="🔍 Search Name, Aadhar, Course..."
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-full sm:w-64 focus:ring-2 focus:ring-sky-500 font-medium"
              />
              <button
                onClick={handlePrintTable}
                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer whitespace-nowrap"
              >
                🖨️ Print Table
              </button>
            </div>
          </div>

          {isLoadingList ? (
            <div className="p-8 text-center text-slate-500 text-xs font-bold">⏳ Loading your submitted records...</div>
          ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">Father's Name</th>
                  <th className="p-3">Aadhar Number</th>
                  <th className="p-3">Course</th>
                  <th className="p-3 text-center">Enrollment No</th>
                  <th className="p-3 text-center">Roll No</th>
                  <th className="p-3 text-center">Admin Status</th>
                  <th className="p-3 text-center no-print">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentList
                  .filter(
                    (s) =>
                      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.aadhar_no.includes(searchQuery) ||
                      s.course_name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900 uppercase">{student.student_name}</td>
                      <td className="p-3 font-medium uppercase">{student.father_name}</td>
                      <td className="p-3 font-mono font-bold text-slate-700">{student.aadhar_no}</td>
                      <td className="p-3">{student.course_name}</td>
                      <td className="p-3 text-center">
                        {student.enrollment_no === 'NOT_ISSUED' ? (
                          <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px] border border-amber-300">
                            ⏳ Not Issued Yet
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-sky-700">{student.enrollment_no}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {student.roll_no === 'NOT_ISSUED' ? (
                          <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px] border border-amber-300">
                            ⏳ Not Issued Yet
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-slate-900">{student.roll_no}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {student.status === 'PENDING_APPROVAL' ? (
                          <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded text-[10px]">
                            Pending Admin MITM
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                            Approved & Merged
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center no-print">
                        <button
                          onClick={() => setSelectedStudentForView(student)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                        >
                          👁️ View Preview
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. READ-ONLY PREVIEW MODAL */}
      {/* ========================================================================= */}
      {selectedStudentForView && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8 relative border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                📄 Student Entry Preview Details
              </h3>
              <button
                onClick={() => setSelectedStudentForView(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Read-Only Status Banner */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>🔒</span> Entry Submitted to Main Admin
              </p>
              <p className="text-[11px]">
                Roll No & Enrollment No: <strong>Not Issued Yet</strong>. ID Card printing will unlock once Main Admin MITM assigns the enrollment number.
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-12 gap-4 items-center text-xs">
              <div className="col-span-8 space-y-2">
                <div><span className="font-bold text-slate-500">Candidate Name:</span> <p className="font-black text-slate-900 text-sm">{selectedStudentForView.student_name}</p></div>
                <div><span className="font-bold text-slate-500">Father's Name:</span> <p className="font-bold text-slate-800">{selectedStudentForView.father_name}</p></div>
                <div><span className="font-bold text-slate-500">Aadhar Number:</span> <p className="font-mono font-bold text-amber-800">{selectedStudentForView.aadhar_no}</p></div>
                <div><span className="font-bold text-slate-500">Course:</span> <p className="font-semibold text-sky-900">{selectedStudentForView.course_name}</p></div>
                <div><span className="font-bold text-slate-500">Admission Date:</span> <p className="font-medium">{selectedStudentForView.admission_date}</p></div>
              </div>

              <div className="col-span-4 flex flex-col items-center justify-center">
                <div className="w-24 h-28 border border-slate-300 p-0.5 bg-white shadow-sm overflow-hidden rounded-md mb-2">
                  <img src={selectedStudentForView.photo_url || 'https://iili.io/3jruEzl.md.jpg'} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Student Photo</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <button
                disabled
                className="px-4 py-2 bg-slate-200 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed shadow-none"
                title="Disabled until Enrollment No is assigned by Main Admin"
              >
                🖨️ Print ID Card (Locked)
              </button>
              <button
                onClick={() => setSelectedStudentForView(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}