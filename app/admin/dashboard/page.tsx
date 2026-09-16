"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// =========================================================================
// TYPES
// =========================================================================
interface StudentRecord {
  id?: string;
  enrollment_no: string;
  roll_no?: string;
  student_name: string;
  father_name: string;
  mother_name?: string;
  course_name: string;
  admission_date: string;
  dob?: string;
  mobile_no?: string;
  alt_mobile_no?: string;
  photo_url?: string;
  aadhar_no?: string;
  qualification?: string;
  address?: string;
  institute_name?: string;
  created_at?: string;
}

interface SubjectMarks {
  subject_code: string;
  subject_name: string;
  max_marks: number;
  obtained_marks: number;
}

interface MarksheetRecord {
  id?: string;
  enrollment_no: string;
  roll_no?: string;
  student_name: string;
  course_name: string;
  exam_session: string;
  semester_year: string;
  subjects: SubjectMarks[];
  total_max_marks: number;
  total_obtained_marks: number;
  percentage: number;
  grade: string;
  result_status: 'PASS' | 'FAIL' | 'HELD';
  issue_date: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'admission' | 'students_list' | 'marksheets'>('admission');
  const [admissionSubTab, setAdmissionSubTab] = useState<'single' | 'excel'>('single');
  const [marksheetSubTab, setMarksheetSubTab] = useState<'single' | 'excel'>('single');

  // Authentication Guard
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
    }
  }, [router]);

  // =========================================================================
  // STATE 1: SINGLE STUDENT ADMISSION FORM
  // =========================================================================
  const [singleStudent, setSingleStudent] = useState<StudentRecord>({
    enrollment_no: '',
    roll_no: '',
    student_name: '',
    father_name: '',
    mother_name: '',
    course_name: 'CPAC',
    admission_date: '11.04.2025',
    dob: '15.08.2005',
    mobile_no: '',
    alt_mobile_no: '',
    photo_url: '',
    aadhar_no: '',
    qualification: '12th Pass',
    address: '',
    institute_name: 'MITM'
  });
  const [admissionStatus, setAdmissionStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [submittingStudent, setSubmittingStudent] = useState(false);

  const handleStudentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingStudent(true);
    setAdmissionStatus(null);

    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleStudent),
      });

      const data = await res.json();
      if (res.ok) {
        setAdmissionStatus({ type: 'success', msg: 'Student admission details saved successfully!' });
        // Reset key fields
        setSingleStudent({
          ...singleStudent,
          enrollment_no: '',
          roll_no: '',
          student_name: '',
          father_name: '',
          mother_name: '',
          mobile_no: '',
          aadhar_no: '',
          address: ''
        });
      } else {
        setAdmissionStatus({ type: 'error', msg: data.message || 'Failed to save student record.' });
      }
    } catch (err) {
      setAdmissionStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setSubmittingStudent(false);
    }
  };

  // =========================================================================
  // STATE 2: EXCEL BULK UPLOAD (ADMISSION)
  // =========================================================================
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [excelStatus, setExcelStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) return;

    setUploadingExcel(true);
    setExcelStatus(null);

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      const res = await fetch('/api/admin/students/bulk-excel', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setExcelStatus({ type: 'success', msg: `Successfully imported ${data.count || 0} student records!` });
        setExcelFile(null);
      } else {
        setExcelStatus({ type: 'error', msg: data.message || 'Error parsing Excel file.' });
      }
    } catch (err) {
      setExcelStatus({ type: 'error', msg: 'Failed to upload Excel file.' });
    } finally {
      setUploadingExcel(false);
    }
  };

  // =========================================================================
  // STATE 3: REGISTERED STUDENTS TABLE VIEW (SEARCH, SORT, COLUMN TOGGLE, EXPORT)
  // =========================================================================
  const [studentsList, setStudentsList] = useState<StudentRecord[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'enrollment_no' | 'student_name' | 'course_name' | 'admission_date'>('student_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Column Visibility Controls
  const [visibleCols, setVisibleCols] = useState({
    enrollment_no: true,
    roll_no: true,
    student_name: true,
    father_name: true,
    mother_name: false,
    course_name: true,
    admission_date: true,
    dob: false,
    mobile_no: true,
    aadhar_no: false,
    qualification: false,
    address: false,
    photo: true,
  });

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (res.ok && data.students) {
        setStudentsList(data.students);
      }
    } catch (err) {
      console.error('Failed to fetch students list:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students_list') {
      fetchStudents();
    }
  }, [activeTab]);

  // Filter & Sort Logic
  const filteredStudents = studentsList
    .filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.student_name.toLowerCase().includes(q) ||
        s.enrollment_no.toLowerCase().includes(q) ||
        s.course_name.toLowerCase().includes(q) ||
        (s.mobile_no && s.mobile_no.includes(q))
      );
    })
    .sort((a, b) => {
      const valA = (a[sortField] || '').toString().toLowerCase();
      const valB = (b[sortField] || '').toString().toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Export Table to CSV / Excel
  const exportToExcel = () => {
    if (filteredStudents.length === 0) return;
    const headers = [
      'Enrollment No', 'Roll No', 'Student Name', 'Father Name', 'Mother Name',
      'Course', 'Admission Date', 'DOB', 'Mobile No', 'Aadhar No', 'Address'
    ];

    const csvRows = [headers.join(',')];
    filteredStudents.forEach(s => {
      const row = [
        `"${s.enrollment_no}"`, `"${s.roll_no || ''}"`, `"${s.student_name}"`,
        `"${s.father_name}"`, `"${s.mother_name || ''}"`, `"${s.course_name}"`,
        `"${s.admission_date}"`, `"${s.dob || ''}"`, `"${s.mobile_no || ''}"`,
        `"${s.aadhar_no || ''}"`, `"${(s.address || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Registered_Students_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  // =========================================================================
  // STATE 4: MARKSHEET / RESULT MANAGEMENT MODULE
  // =========================================================================
  const [singleMarksheet, setSingleMarksheet] = useState<MarksheetRecord>({
    enrollment_no: '',
    roll_no: '',
    student_name: '',
    course_name: 'CPAC',
    exam_session: '2025-2026',
    semester_year: '1st Year',
    subjects: [
      { subject_code: 'CPAC101', subject_name: 'Financial Accounting', max_marks: 100, obtained_marks: 85 },
      { subject_code: 'CPAC102', subject_name: 'Taxation & GST', max_marks: 100, obtained_marks: 78 },
      { subject_code: 'CPAC103', subject_name: 'Computerized Tally Prime', max_marks: 100, obtained_marks: 90 },
    ],
    total_max_marks: 300,
    total_obtained_marks: 253,
    percentage: 84.33,
    grade: 'A+',
    result_status: 'PASS',
    issue_date: '20.05.2025'
  });

  const [marksheetStatus, setMarksheetStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [submittingMarksheet, setSubmittingMarksheet] = useState(false);

  // Recalculate Totals & Percentage when subjects change
  const handleSubjectChange = (index: number, field: keyof SubjectMarks, val: any) => {
    const updated = [...singleMarksheet.subjects];
    updated[index] = { ...updated[index], [field]: val };

    const totalMax = updated.reduce((sum, s) => sum + Number(s.max_marks || 0), 0);
    const totalObt = updated.reduce((sum, s) => sum + Number(s.obtained_marks || 0), 0);
    const pct = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
    const resStatus = pct >= 40 ? 'PASS' : 'FAIL';

    setSingleMarksheet({
      ...singleMarksheet,
      subjects: updated,
      total_max_marks: totalMax,
      total_obtained_marks: totalObt,
      percentage: pct,
      result_status: resStatus
    });
  };

  const addSubjectRow = () => {
    setSingleMarksheet({
      ...singleMarksheet,
      subjects: [...singleMarksheet.subjects, { subject_code: '', subject_name: '', max_marks: 100, obtained_marks: 0 }]
    });
  };

  const handleMarksheetFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingMarksheet(true);
    setMarksheetStatus(null);

    try {
      const res = await fetch('/api/admin/marksheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleMarksheet),
      });

      const data = await res.json();
      if (res.ok) {
        setMarksheetStatus({ type: 'success', msg: 'Marksheet record published successfully!' });
      } else {
        setMarksheetStatus({ type: 'error', msg: data.message || 'Failed to save marksheet.' });
      }
    } catch (err) {
      setMarksheetStatus({ type: 'error', msg: 'Error submitting marksheet.' });
    } finally {
      setSubmittingMarksheet(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12">
      
      {/* Top Header Navbar */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/mitm-logo.png" alt="MITM" className="h-10 object-contain bg-white rounded p-1" />
          <div>
            <h1 className="text-xl font-bold">MANAVTA Admin Control Panel</h1>
            <p className="text-xs text-sky-400">Student Admission, Records & Marksheet Portal</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('admin_session');
            router.push('/admin/login');
          }}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow transition"
        >
          Logout
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-300 bg-white rounded-t-lg shadow-sm px-2 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('admission')}
            className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition ${
              activeTab === 'admission'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📝 Student Admission Form / Bulk Upload
          </button>
          <button
            onClick={() => setActiveTab('students_list')}
            className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition ${
              activeTab === 'students_list'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📊 Registered Students Table & Export
          </button>
          <button
            onClick={() => setActiveTab('marksheets')}
            className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition ${
              activeTab === 'marksheets'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            🎓 Marksheet / Result Management
          </button>
        </div>

        {/* TAB 1: ADMISSION FORM & BULK EXCEL UPLOAD */}
        {activeTab === 'admission' && (
          <div className="bg-white p-6 sm:p-8 rounded-b-lg shadow border border-t-0 border-slate-200">
            
            {/* Sub-tabs */}
            <div className="flex gap-4 border-b pb-4 mb-6">
              <button
                onClick={() => setAdmissionSubTab('single')}
                className={`px-4 py-2 rounded text-sm font-semibold transition ${
                  admissionSubTab === 'single' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ➕ Single Student Admission Entry (Form)
              </button>
              <button
                onClick={() => setAdmissionSubTab('excel')}
                className={`px-4 py-2 rounded text-sm font-semibold transition ${
                  admissionSubTab === 'excel' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📁 Old Students Excel Bulk Upload
              </button>
            </div>

            {/* SUB-TAB A: SINGLE STUDENT ADMISSION FORM */}
            {admissionSubTab === 'single' && (
              <form onSubmit={handleStudentFormSubmit} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">New Student Registration & Admission Form</h3>

                {admissionStatus && (
                  <div className={`p-4 rounded border text-sm font-medium ${
                    admissionStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {admissionStatus.msg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Enrollment No *</label>
                    <input
                      type="text"
                      value={singleStudent.enrollment_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, enrollment_no: e.target.value })}
                      placeholder="e.g. 1039954625"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Roll No</label>
                    <input
                      type="text"
                      value={singleStudent.roll_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, roll_no: e.target.value })}
                      placeholder="e.g. 2026/CPAC/041"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Name *</label>
                    <input
                      type="text"
                      value={singleStudent.course_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, course_name: e.target.value })}
                      placeholder="e.g. CPAC"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Student Name *</label>
                    <input
                      type="text"
                      value={singleStudent.student_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, student_name: e.target.value })}
                      placeholder="e.g. NISHA"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Father&apos;s Name *</label>
                    <input
                      type="text"
                      value={singleStudent.father_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, father_name: e.target.value })}
                      placeholder="e.g. RANINDRA SINGH"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mother&apos;s Name</label>
                    <input
                      type="text"
                      value={singleStudent.mother_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, mother_name: e.target.value })}
                      placeholder="e.g. SUNITA DEVI"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Admission Date *</label>
                    <input
                      type="text"
                      value={singleStudent.admission_date}
                      onChange={(e) => setSingleStudent({ ...singleStudent, admission_date: e.target.value })}
                      placeholder="e.g. 11.04.2025"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date of Birth (DOB)</label>
                    <input
                      type="text"
                      value={singleStudent.dob}
                      onChange={(e) => setSingleStudent({ ...singleStudent, dob: e.target.value })}
                      placeholder="e.g. 15.08.2005"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mobile No</label>
                    <input
                      type="text"
                      value={singleStudent.mobile_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, mobile_no: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Alternate Mobile No</label>
                    <input
                      type="text"
                      value={singleStudent.alt_mobile_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, alt_mobile_no: e.target.value })}
                      placeholder="e.g. 9123456789"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Aadhar Card No</label>
                    <input
                      type="text"
                      value={singleStudent.aadhar_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, aadhar_no: e.target.value })}
                      placeholder="e.g. 1234-5678-9012"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Qualification</label>
                    <input
                      type="text"
                      value={singleStudent.qualification}
                      onChange={(e) => setSingleStudent({ ...singleStudent, qualification: e.target.value })}
                      placeholder="e.g. 12th Pass / Graduate"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Student Photo URL</label>
                    <input
                      type="text"
                      value={singleStudent.photo_url}
                      onChange={(e) => setSingleStudent({ ...singleStudent, photo_url: e.target.value })}
                      placeholder="Paste image link or URL (e.g. https://portal.../nisha.jpg)"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Institute Name</label>
                    <input
                      type="text"
                      value={singleStudent.institute_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, institute_name: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm bg-slate-50"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Address</label>
                    <textarea
                      rows={2}
                      value={singleStudent.address}
                      onChange={(e) => setSingleStudent({ ...singleStudent, address: e.target.value })}
                      placeholder="Enter student residential address"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingStudent}
                    className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow transition"
                  >
                    {submittingStudent ? 'Saving Student Record...' : 'Save Student Admission Details'}
                  </button>
                </div>
              </form>
            )}

            {/* SUB-TAB B: BULK EXCEL UPLOAD */}
            {admissionSubTab === 'excel' && (
              <form onSubmit={handleExcelUpload} className="space-y-6 max-w-xl">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Bulk Upload Old Student Data via Excel / CSV</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload an Excel (.xlsx, .xls) or CSV file containing old student admission records. 
                  The file should contain columns: <strong>enrollment_no, student_name, father_name, course_name, admission_date, institute_name, photo_url</strong>.
                </p>

                {excelStatus && (
                  <div className={`p-4 rounded border text-sm font-medium ${
                    excelStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {excelStatus.msg}
                  </div>
                )}

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50 hover:bg-slate-100 transition">
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={(e) => setExcelFile(e.target.files ? e.target.files[0] : null)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-600"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-2">Supported formats: CSV, XLSX (Up to 5000 rows)</p>
                </div>

                <button
                  type="submit"
                  disabled={uploadingExcel || !excelFile}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded shadow transition disabled:opacity-50"
                >
                  {uploadingExcel ? 'Processing File...' : 'Upload & Process Excel Data'}
                </button>
              </form>
            )}

          </div>
        )}

        {/* TAB 2: REGISTERED STUDENTS DATA TABLE (SEARCH, SORT, COLUMN SHOW/HIDE, EXPORT) */}
        {activeTab === 'students_list' && (
          <div className="bg-white p-6 sm:p-8 rounded-b-lg shadow border border-t-0 border-slate-200 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-4">
              
              {/* Search */}
              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search by Name, Enrollment, Course..."
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5"
                >
                  📊 Download Excel / CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5"
                >
                  🖨️ Print / Save PDF
                </button>
              </div>

            </div>

            {/* Column Visibility Toggles */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-2">👁️ Column Visibility Toggles:</span>
              <div className="flex flex-wrap gap-3">
                {Object.keys(visibleCols).map((col) => (
                  <label key={col} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(visibleCols as any)[col]}
                      onChange={(e) => setVisibleCols({ ...visibleCols, [col]: e.target.checked })}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="capitalize">{col.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Students Data Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                <thead className="bg-slate-900 text-white font-semibold">
                  <tr>
                    {visibleCols.photo && <th className="p-3">Photo</th>}
                    {visibleCols.enrollment_no && <th className="p-3 cursor-pointer" onClick={() => { setSortField('enrollment_no'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Enrollment No ↕</th>}
                    {visibleCols.roll_no && <th className="p-3">Roll No</th>}
                    {visibleCols.student_name && <th className="p-3 cursor-pointer" onClick={() => { setSortField('student_name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Student Name ↕</th>}
                    {visibleCols.father_name && <th className="p-3">Father Name</th>}
                    {visibleCols.mother_name && <th className="p-3">Mother Name</th>}
                    {visibleCols.course_name && <th className="p-3 cursor-pointer" onClick={() => { setSortField('course_name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Course ↕</th>}
                    {visibleCols.admission_date && <th className="p-3">Admission Date</th>}
                    {visibleCols.dob && <th className="p-3">DOB</th>}
                    {visibleCols.mobile_no && <th className="p-3">Mobile</th>}
                    {visibleCols.aadhar_no && <th className="p-3">Aadhar</th>}
                    {visibleCols.qualification && <th className="p-3">Qualification</th>}
                    {visibleCols.address && <th className="p-3">Address</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={12} className="p-6 text-center text-slate-500">Loading student records...</td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="p-6 text-center text-slate-500">No student records found.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.enrollment_no} className="hover:bg-slate-50 transition">
                        {visibleCols.photo && (
                          <td className="p-2">
                            <img src={s.photo_url || '/student-placeholder.jpg'} alt="" className="w-8 h-10 object-cover rounded border" />
                          </td>
                        )}
                        {visibleCols.enrollment_no && <td className="p-3 font-bold text-sky-700">{s.enrollment_no}</td>}
                        {visibleCols.roll_no && <td className="p-3">{s.roll_no || '-'}</td>}
                        {visibleCols.student_name && <td className="p-3 font-semibold text-slate-900">{s.student_name}</td>}
                        {visibleCols.father_name && <td className="p-3">{s.father_name}</td>}
                        {visibleCols.mother_name && <td className="p-3">{s.mother_name || '-'}</td>}
                        {visibleCols.course_name && <td className="p-3 font-medium">{s.course_name}</td>}
                        {visibleCols.admission_date && <td className="p-3">{s.admission_date}</td>}
                        {visibleCols.dob && <td className="p-3">{s.dob || '-'}</td>}
                        {visibleCols.mobile_no && <td className="p-3">{s.mobile_no || '-'}</td>}
                        {visibleCols.aadhar_no && <td className="p-3">{s.aadhar_no || '-'}</td>}
                        {visibleCols.qualification && <td className="p-3">{s.qualification || '-'}</td>}
                        {visibleCols.address && <td className="p-3 text-xs max-w-xs truncate">{s.address || '-'}</td>}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-slate-500 text-right">
              Showing <strong>{filteredStudents.length}</strong> of <strong>{studentsList.length}</strong> total registered students
            </div>

          </div>
        )}

        {/* TAB 3: MARKSHEET & RESULT MANAGEMENT */}
        {activeTab === 'marksheets' && (
          <div className="bg-white p-6 sm:p-8 rounded-b-lg shadow border border-t-0 border-slate-200">
            
            {/* Sub-tabs */}
            <div className="flex gap-4 border-b pb-4 mb-6">
              <button
                onClick={() => setMarksheetSubTab('single')}
                className={`px-4 py-2 rounded text-sm font-semibold transition ${
                  marksheetSubTab === 'single' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ➕ Single Student Marksheet Entry
              </button>
              <button
                onClick={() => setMarksheetSubTab('excel')}
                className={`px-4 py-2 rounded text-sm font-semibold transition ${
                  marksheetSubTab === 'excel' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📁 Bulk Upload Old Results via Excel
              </button>
            </div>

            {/* SINGLE MARKSHEET ENTRY FORM */}
            {marksheetSubTab === 'single' && (
              <form onSubmit={handleMarksheetFormSubmit} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Student Result / Marksheet Generation Form</h3>

                {marksheetStatus && (
                  <div className={`p-4 rounded border text-sm font-medium ${
                    marksheetStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {marksheetStatus.msg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Enrollment No *</label>
                    <input
                      type="text"
                      value={singleMarksheet.enrollment_no}
                      onChange={(e) => setSingleMarksheet({ ...singleMarksheet, enrollment_no: e.target.value })}
                      placeholder="e.g. 1039954625"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Student Name *</label>
                    <input
                      type="text"
                      value={singleMarksheet.student_name}
                      onChange={(e) => setSingleMarksheet({ ...singleMarksheet, student_name: e.target.value })}
                      placeholder="e.g. NISHA"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Name *</label>
                    <input
                      type="text"
                      value={singleMarksheet.course_name}
                      onChange={(e) => setSingleMarksheet({ ...singleMarksheet, course_name: e.target.value })}
                      placeholder="e.g. CPAC"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Exam Session</label>
                    <input
                      type="text"
                      value={singleMarksheet.exam_session}
                      onChange={(e) => setSingleMarksheet({ ...singleMarksheet, exam_session: e.target.value })}
                      placeholder="e.g. 2025-2026"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Semester / Year</label>
                    <input
                      type="text"
                      value={singleMarksheet.semester_year}
                      onChange={(e) => setSingleMarksheet({ ...singleMarksheet, semester_year: e.target.value })}
                      placeholder="e.g. 1st Year"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Result Issue Date</label>
                    <input
                      type="text"
                      value={singleMarksheet.issue_date}
                      onChange={(e) => setSingleMarksheet({ ...singleMarksheet, issue_date: e.target.value })}
                      placeholder="e.g. 20.05.2025"
                      className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Subject-wise Marks Table */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm text-slate-800">Subject-wise Marks Breakdown</h4>
                    <button
                      type="button"
                      onClick={addSubjectRow}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded shadow"
                    >
                      + Add Subject
                    </button>
                  </div>

                  {singleMarksheet.subjects.map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={sub.subject_code}
                          onChange={(e) => handleSubjectChange(idx, 'subject_code', e.target.value)}
                          placeholder="Code (e.g. CPAC101)"
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={sub.subject_name}
                          onChange={(e) => handleSubjectChange(idx, 'subject_name', e.target.value)}
                          placeholder="Subject Title"
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={sub.max_marks}
                          onChange={(e) => handleSubjectChange(idx, 'max_marks', e.target.value)}
                          placeholder="Max"
                          className="w-full p-2 border rounded text-center"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={sub.obtained_marks}
                          onChange={(e) => handleSubjectChange(idx, 'obtained_marks', e.target.value)}
                          placeholder="Obtained"
                          className="w-full p-2 border rounded text-center font-bold text-sky-700"
                          required
                        />
                      </div>
                    </div>
                  ))}

                  {/* Calculated Totals Box */}
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t text-sm font-bold bg-white p-3 rounded border">
                    <div>Total Max Marks: <span className="text-slate-900">{singleMarksheet.total_max_marks}</span></div>
                    <div>Obtained Marks: <span className="text-sky-700">{singleMarksheet.total_obtained_marks}</span></div>
                    <div>Percentage: <span className="text-emerald-700">{singleMarksheet.percentage}% ({singleMarksheet.result_status})</span></div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingMarksheet}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow transition"
                  >
                    {submittingMarksheet ? 'Publishing Result...' : 'Publish & Save Marksheet'}
                  </button>
                </div>
              </form>
            )}

            {/* BULK MARKSHEET EXCEL UPLOAD */}
            {marksheetSubTab === 'excel' && (
              <div className="space-y-4 max-w-xl">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Bulk Upload Old Marksheet Results via Excel</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload an Excel/CSV file containing student results with columns: 
                  <strong>enrollment_no, student_name, course_name, exam_session, total_max_marks, total_obtained_marks, percentage, result_status</strong>.
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sky-500 file:text-white"
                  />
                  <p className="text-xs text-slate-400 mt-2">Upload Result Sheets (Max 5000 students)</p>
                </div>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded shadow"
                >
                  Process & Save Results
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
