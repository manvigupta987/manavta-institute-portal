"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  institute_name: string;
}

interface SubjectMarks {
  subject_code: string;
  subject_name: string;
  max_marks: number;
  obtained_marks: number;
}

interface MarksheetRecord {
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

  // Verify Admin Session
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
    }
  }, [router]);

  // =========================================================================
  // STATE 1: SINGLE STUDENT ADMISSION FORM (ALL compulsory except alt_mobile_no)
  // =========================================================================
  const [singleStudent, setSingleStudent] = useState<StudentRecord>({
    enrollment_no: '',
    roll_no: '',
    student_name: '',
    father_name: '',
    mother_name: '',
    course_name: 'CPAC',
    admission_date: '',
    dob: '',
    mobile_no: '',
    alt_mobile_no: '', // OPTIONAL
    photo_url: '',
    aadhar_no: '',
    qualification: '',
    address: '',
    institute_name: 'MITM'
  });

  const [admissionStatus, setAdmissionStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [submittingStudent, setSubmittingStudent] = useState(false);

  const handleStudentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingStudent(true);
    setAdmissionStatus(null);

    // Validation Check: All fields EXCEPT alt_mobile_no are mandatory
    const requiredFields = [
      { field: singleStudent.enrollment_no, label: 'Enrollment No' },
      { field: singleStudent.roll_no, label: 'Roll No' },
      { field: singleStudent.student_name, label: 'Student Name' },
      { field: singleStudent.father_name, label: "Father's Name" },
      { field: singleStudent.mother_name, label: "Mother's Name" },
      { field: singleStudent.course_name, label: 'Course Name' },
      { field: singleStudent.admission_date, label: 'Admission Date' },
      { field: singleStudent.dob, label: 'Date of Birth (DOB)' },
      { field: singleStudent.mobile_no, label: 'Mobile No' },
      { field: singleStudent.photo_url, label: 'Student Photo URL' },
      { field: singleStudent.aadhar_no, label: 'Aadhar Card No' },
      { field: singleStudent.qualification, label: 'Qualification' },
      { field: singleStudent.address, label: 'Address' },
      { field: singleStudent.institute_name, label: 'Institute Name' },
    ];

    const missing = requiredFields.filter((item) => !item.field || !item.field.trim());
    if (missing.length > 0) {
      setAdmissionStatus({
        type: 'error',
        msg: `Compulsory field missing: Please enter ${missing.map((m) => m.label).join(', ')}.`
      });
      setSubmittingStudent(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleStudent),
      });

      const data = await res.json();
      if (res.ok) {
        setAdmissionStatus({ type: 'success', msg: 'Student admission details saved successfully!' });
        // Reset compulsory fields
        setSingleStudent({
          enrollment_no: '',
          roll_no: '',
          student_name: '',
          father_name: '',
          mother_name: '',
          course_name: 'CPAC',
          admission_date: '',
          dob: '',
          mobile_no: '',
          alt_mobile_no: '',
          photo_url: '',
          aadhar_no: '',
          qualification: '',
          address: '',
          institute_name: 'MITM'
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
    mother_name: true,
    course_name: true,
    admission_date: true,
    dob: true,
    mobile_no: true,
    alt_mobile_no: false,
    aadhar_no: true,
    qualification: true,
    address: true,
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
      'Course', 'Admission Date', 'DOB', 'Mobile No', 'Alt Mobile No', 'Aadhar No', 'Qualification', 'Address'
    ];

    const csvRows = [headers.join(',')];
    filteredStudents.forEach(s => {
      const row = [
        `"${s.enrollment_no}"`, `"${s.roll_no || ''}"`, `"${s.student_name}"`,
        `"${s.father_name}"`, `"${s.mother_name || ''}"`, `"${s.course_name}"`,
        `"${s.admission_date}"`, `"${s.dob || ''}"`, `"${s.mobile_no || ''}"`,
        `"${s.alt_mobile_no || ''}"`, `"${s.aadhar_no || ''}"`, `"${s.qualification || ''}"`, `"${(s.address || '').replace(/"/g, '""')}"`
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
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-bold text-slate-800">New Student Registration & Admission Form</h3>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    * All fields compulsory except Alternate Mobile No
                  </span>
                </div>

                {admissionStatus && (
                  <div className={`p-4 rounded border text-sm font-medium ${
                    admissionStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {admissionStatus.msg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* 1. Enrollment No */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Enrollment No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.enrollment_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, enrollment_no: e.target.value })}
                      placeholder="e.g. 1039954625"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 2. Roll No */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Roll No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.roll_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, roll_no: e.target.value })}
                      placeholder="e.g. 2026/CPAC/041"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 3. Course Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.course_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, course_name: e.target.value })}
                      placeholder="e.g. CPAC"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 4. Student Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.student_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, student_name: e.target.value })}
                      placeholder="e.g. NISHA"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 5. Father's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.father_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, father_name: e.target.value })}
                      placeholder="e.g. RANINDRA SINGH"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 6. Mother's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.mother_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, mother_name: e.target.value })}
                      placeholder="e.g. SUNITA DEVI"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 7. Admission Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Admission Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.admission_date}
                      onChange={(e) => setSingleStudent({ ...singleStudent, admission_date: e.target.value })}
                      placeholder="e.g. 11.04.2025"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 8. Date of Birth (DOB) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Date of Birth (DOB) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={singleStudent.dob}
                      onChange={(e) => setSingleStudent({ ...singleStudent, dob: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 9. Mobile No */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Mobile No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={singleStudent.mobile_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, mobile_no: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 10. Alternate Mobile No (OPTIONAL FIELD) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Alternate Mobile No <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={singleStudent.alt_mobile_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, alt_mobile_no: e.target.value })}
                      placeholder="e.g. 9123456789 (Optional)"
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>

                  {/* 11. Aadhar Card No */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Aadhar Card No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.aadhar_no}
                      onChange={(e) => setSingleStudent({ ...singleStudent, aadhar_no: e.target.value })}
                      placeholder="e.g. 1234-5678-9012"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 12. Qualification */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.qualification}
                      onChange={(e) => setSingleStudent({ ...singleStudent, qualification: e.target.value })}
                      placeholder="e.g. 12th Pass / Graduate"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 13. Student Photo URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Student Photo URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.photo_url}
                      onChange={(e) => setSingleStudent({ ...singleStudent, photo_url: e.target.value })}
                      placeholder="Paste image URL (e.g. https://portal.manavtainstitute.com/student-photo.jpg)"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  {/* 14. Institute Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Institute Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={singleStudent.institute_name}
                      onChange={(e) => setSingleStudent({ ...singleStudent, institute_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-slate-50"
                      required
                    />
                  </div>

                  {/* 15. Full Address */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={singleStudent.address}
                      onChange={(e) => setSingleStudent({ ...singleStudent, address: e.target.value })}
                      placeholder="Enter full residential address"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingStudent}
                    className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow transition disabled:opacity-50"
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
                  placeholder="🔍 Search Name, Enrollment No, Course..."
                  className="w-full px-4 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5"
                >
                  📥 Export CSV / Excel
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5"
                >
                  🖨️ Print PDF
                </button>
              </div>

            </div>

            {/* Column Toggle Checklist */}
            <div className="bg-slate-50 p-4 rounded border text-xs space-y-2">
              <span className="font-bold text-slate-700 block mb-1">👁️ Column Show/Hide Toggles:</span>
              <div className="flex flex-wrap gap-3">
                {Object.keys(visibleCols).map((col) => (
                  <label key={col} className="flex items-center gap-1.5 capitalize cursor-pointer text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={visibleCols[col as keyof typeof visibleCols]}
                      onChange={(e) => setVisibleCols({ ...visibleCols, [col]: e.target.checked })}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    {col.replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-800 text-white uppercase text-[11px] tracking-wider">
                  <tr>
                    {visibleCols.enrollment_no && (
                      <th 
                        onClick={() => { setSortField('enrollment_no'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className="px-4 py-3 cursor-pointer hover:bg-slate-700 select-none"
                      >
                        Enrollment No ↕
                      </th>
                    )}
                    {visibleCols.roll_no && <th className="px-4 py-3">Roll No</th>}
                    {visibleCols.student_name && (
                      <th 
                        onClick={() => { setSortField('student_name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className="px-4 py-3 cursor-pointer hover:bg-slate-700 select-none"
                      >
                        Student Name ↕
                      </th>
                    )}
                    {visibleCols.father_name && <th className="px-4 py-3">Father Name</th>}
                    {visibleCols.mother_name && <th className="px-4 py-3">Mother Name</th>}
                    {visibleCols.course_name && <th className="px-4 py-3">Course</th>}
                    {visibleCols.admission_date && <th className="px-4 py-3">Admission Date</th>}
                    {visibleCols.dob && <th className="px-4 py-3">DOB</th>}
                    {visibleCols.mobile_no && <th className="px-4 py-3">Mobile No</th>}
                    {visibleCols.alt_mobile_no && <th className="px-4 py-3">Alt Mobile</th>}
                    {visibleCols.aadhar_no && <th className="px-4 py-3">Aadhar No</th>}
                    {visibleCols.qualification && <th className="px-4 py-3">Qualification</th>}
                    {visibleCols.address && <th className="px-4 py-3">Address</th>}
                    {visibleCols.photo && <th className="px-4 py-3 text-center">Photo</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={14} className="text-center py-8 text-slate-500 font-medium">Loading student database...</td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="text-center py-8 text-slate-500 font-medium">No registered student records found.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((st, idx) => (
                      <tr key={st.id || idx} className="hover:bg-sky-50/50 transition">
                        {visibleCols.enrollment_no && <td className="px-4 py-3 font-bold text-slate-900">{st.enrollment_no}</td>}
                        {visibleCols.roll_no && <td className="px-4 py-3">{st.roll_no || '-'}</td>}
                        {visibleCols.student_name && <td className="px-4 py-3 font-semibold text-sky-900">{st.student_name}</td>}
                        {visibleCols.father_name && <td className="px-4 py-3">{st.father_name}</td>}
                        {visibleCols.mother_name && <td className="px-4 py-3">{st.mother_name || '-'}</td>}
                        {visibleCols.course_name && <td className="px-4 py-3 font-medium bg-slate-50">{st.course_name}</td>}
                        {visibleCols.admission_date && <td className="px-4 py-3">{st.admission_date}</td>}
                        {visibleCols.dob && <td className="px-4 py-3">{st.dob || '-'}</td>}
                        {visibleCols.mobile_no && <td className="px-4 py-3">{st.mobile_no || '-'}</td>}
                        {visibleCols.alt_mobile_no && <td className="px-4 py-3">{st.alt_mobile_no || '-'}</td>}
                        {visibleCols.aadhar_no && <td className="px-4 py-3">{st.aadhar_no || '-'}</td>}
                        {visibleCols.qualification && <td className="px-4 py-3">{st.qualification || '-'}</td>}
                        {visibleCols.address && <td className="px-4 py-3 max-w-xs truncate" title={st.address}>{st.address || '-'}</td>}
                        {visibleCols.photo && (
                          <td className="px-4 py-3 text-center">
                            <img
                              src={st.photo_url || '/student-placeholder.jpg'}
                              alt="Student"
                              className="w-8 h-8 object-cover rounded-full border border-slate-300 mx-auto"
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-slate-500 text-right">
              Showing {filteredStudents.length} of {studentsList.length} Total Registered Students
            </div>

          </div>
        )}

        {/* TAB 3: MARKSHEET / RESULT PUBLISHER */}
        {activeTab === 'marksheets' && (
          <div className="bg-white p-6 sm:p-8 rounded-b-lg shadow border border-t-0 border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Student Marksheet & Result Publisher</h3>

            {marksheetStatus && (
              <div className={`p-4 rounded border text-sm font-medium ${
                marksheetStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {marksheetStatus.msg}
              </div>
            )}

            <form onSubmit={handleMarksheetFormSubmit} className="space-y-6">
              
              {/* Basic Student Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded border">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Enrollment No *</label>
                  <input
                    type="text"
                    value={singleMarksheet.enrollment_no}
                    onChange={(e) => setSingleMarksheet({ ...singleMarksheet, enrollment_no: e.target.value })}
                    placeholder="e.g. 1039954625"
                    className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500 bg-white"
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
                    className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course *</label>
                  <input
                    type="text"
                    value={singleMarksheet.course_name}
                    onChange={(e) => setSingleMarksheet({ ...singleMarksheet, course_name: e.target.value })}
                    placeholder="e.g. CPAC"
                    className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Exam Session *</label>
                  <input
                    type="text"
                    value={singleMarksheet.exam_session}
                    onChange={(e) => setSingleMarksheet({ ...singleMarksheet, exam_session: e.target.value })}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Subject Marks Breakdown</h4>
                  <button
                    type="button"
                    onClick={addSubjectRow}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded shadow"
                  >
                    + Add Subject
                  </button>
                </div>

                <div className="overflow-x-auto border rounded">
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead className="bg-slate-200 uppercase font-bold text-slate-700">
                      <tr>
                        <th className="px-3 py-2">Subject Code</th>
                        <th className="px-3 py-2">Subject Title</th>
                        <th className="px-3 py-2 w-28">Max Marks</th>
                        <th className="px-3 py-2 w-28">Obtained</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {singleMarksheet.subjects.map((sub, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={sub.subject_code}
                              onChange={(e) => handleSubjectChange(idx, 'subject_code', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={sub.subject_name}
                              onChange={(e) => handleSubjectChange(idx, 'subject_name', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={sub.max_marks}
                              onChange={(e) => handleSubjectChange(idx, 'max_marks', Number(e.target.value))}
                              className="w-full px-2 py-1 border rounded"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={sub.obtained_marks}
                              onChange={(e) => handleSubjectChange(idx, 'obtained_marks', Number(e.target.value))}
                              className="w-full px-2 py-1 border rounded"
                              required
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculated Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-100 p-3 rounded border">
                  <span className="block text-[11px] text-slate-500 font-bold uppercase">Total Obtained</span>
                  <span className="text-lg font-black text-slate-800">{singleMarksheet.total_obtained_marks} / {singleMarksheet.total_max_marks}</span>
                </div>
                <div className="bg-slate-100 p-3 rounded border">
                  <span className="block text-[11px] text-slate-500 font-bold uppercase">Percentage</span>
                  <span className="text-lg font-black text-sky-700">{singleMarksheet.percentage}%</span>
                </div>
                <div className="bg-slate-100 p-3 rounded border">
                  <span className="block text-[11px] text-slate-500 font-bold uppercase">Grade</span>
                  <span className="text-lg font-black text-slate-800">{singleMarksheet.grade}</span>
                </div>
                <div className={`p-3 rounded border text-white ${singleMarksheet.result_status === 'PASS' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                  <span className="block text-[11px] text-emerald-100 font-bold uppercase">Result Status</span>
                  <span className="text-lg font-black">{singleMarksheet.result_status}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingMarksheet}
                  className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow transition disabled:opacity-50"
                >
                  {submittingMarksheet ? 'Publishing Marksheet...' : 'Publish Marksheet / Result'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
