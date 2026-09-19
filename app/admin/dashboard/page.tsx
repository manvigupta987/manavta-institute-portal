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
  photo_url?: string;
  aadhar_no?: string;
  institute_name?: string;
}

interface SubjectMarks {
  subject_code: string;
  subject_name: string;
  max_marks: number;
  theory_marks: number;
  practical_marks: number;
  total_marks: number;
}

interface MarksheetRecord {
  id?: string;
  enrollment_no: string;
  roll_no: string;
  serial_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  study_center: string;
  session: string;
  subjects: SubjectMarks[];
  grand_total_max: number;
  grand_total_obtained: number;
  percentage: number;
  grade: string;
  issue_date: string;
  photo_url?: string;
}

interface CertificateRecord {
  id?: string;
  roll_no: string;
  enrollment_no: string;
  session: string;
  serial_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  start_date: string;
  end_date: string;
  grade: string;
  issue_date: string;
  institute_name: string;
  photo_url?: string;
}

// =========================================================================
// ROBUST CSV PARSER
// =========================================================================
function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  return lines.map((line) => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim().replace(/^"|"$/g, ''));
    return cells;
  });
}

// QR Code URL Generator Helper
function getQRCodeUrl(text: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(text)}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'admission' | 'marksheets' | 'certificates'>('admission');
  const [isLetterhead, setIsLetterhead] = useState(false);

  // Authentication Guard
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
    }
  }, [router]);

  // Handle Print Action cleanly
  const triggerPrint = () => {
    window.print();
  };

  // =========================================================================
  // TAB 1: STUDENT ADMISSION STATE & HANDLERS
  // =========================================================================
  const [singleStudent, setSingleStudent] = useState<StudentRecord>({
    enrollment_no: '',
    roll_no: '',
    student_name: '',
    father_name: '',
    mother_name: '',
    course_name: 'Computerised Professional Accounting Course',
    admission_date: '01.08.2025',
    dob: '15.08.2005',
    mobile_no: '',
    photo_url: '',
    aadhar_no: '',
    institute_name: 'MITM, BILARI'
  });

  const [studentsList, setStudentsList] = useState<StudentRecord[]>([
    {
      enrollment_no: '1039954663',
      roll_no: '103766',
      student_name: 'SHREYA CHUG',
      father_name: 'YOGESH CHUG',
      mother_name: 'SUNITA CHUG',
      course_name: 'Computerised Professional Accounting Course',
      admission_date: '01.08.2025',
      institute_name: 'MITM, BILARI',
      photo_url: 'https://iili.io/CNGWoTG.md.jpg'
    },
    {
      enrollment_no: '1039954671',
      roll_no: '103774',
      student_name: 'BANTY',
      father_name: 'BATTU',
      course_name: 'Desktop Publishing Course',
      admission_date: '01.08.2025',
      institute_name: 'MITM, BILARI',
      photo_url: 'https://i.postimg.cc/zG4WY1PR/103354.jpg'
    }
  ]);

  const [admissionStatus, setAdmissionStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [selectedStudentForID, setSelectedStudentForID] = useState<StudentRecord | null>(null);
  const [admissionSearch, setAdmissionSearch] = useState('');

  const handleStudentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleStudent.enrollment_no || !singleStudent.student_name) return;

    setStudentsList([singleStudent, ...studentsList]);
    setAdmissionStatus({ type: 'success', msg: 'Student admission details saved successfully!' });
    setSingleStudent({
      enrollment_no: '',
      roll_no: '',
      student_name: '',
      father_name: '',
      mother_name: '',
      course_name: 'Computerised Professional Accounting Course',
      admission_date: '01.08.2025',
      dob: '',
      mobile_no: '',
      photo_url: '',
      aadhar_no: '',
      institute_name: 'MITM, BILARI'
    });
  };

  const handleAdmissionExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length <= 1) {
          setAdmissionStatus({ type: 'error', msg: 'CSV file is empty or missing header row.' });
          return;
        }

        const newRecords: StudentRecord[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (cols.length >= 3) {
            newRecords.push({
              enrollment_no: cols[0] || `ENR-${Date.now()}-${i}`,
              roll_no: cols[1] || '',
              student_name: cols[2] || 'Student',
              father_name: cols[3] || '',
              mother_name: cols[4] || '',
              course_name: cols[5] || 'Professional Course',
              admission_date: cols[6] || '01.08.2025',
              dob: cols[7] || '',
              mobile_no: cols[8] || '',
              institute_name: cols[9] || 'MITM, BILARI',
              photo_url: cols[10] || '/student-placeholder.jpg'
            });
          }
        }

        setStudentsList([...newRecords, ...studentsList]);
        setAdmissionStatus({ type: 'success', msg: `Successfully imported ${newRecords.length} student admission records!` });
      } catch (err) {
        setAdmissionStatus({ type: 'error', msg: 'Failed to parse CSV file. Please check format.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadAdmissionTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Enrollment No,Roll No,Student Name,Father Name,Mother Name,Course Name,Admission Date,DOB,Mobile No,Institute Name,Photo URL\n' +
      '1039954663,103766,SHREYA CHUG,YOGESH CHUG,SUNITA CHUG,Computerised Professional Accounting Course,01.08.2025,15.08.2005,9876543210,MITM BILARI,https://iili.io/CNGWoTG.md.jpg';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Admission_Excel_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // TAB 2: MARKSHEET UPLOAD & GENERATION STATE & HANDLERS
  // =========================================================================
  const [marksheetsList, setMarksheetsList] = useState<MarksheetRecord[]>([
    {
      enrollment_no: '1039954663',
      roll_no: '103766',
      serial_no: 'DN-3754',
      student_name: 'SHREYA CHUG',
      father_name: 'YOGESH CHUG',
      course_name: 'Computerised Professional Accounting Course',
      study_center: 'MITM, BILARI',
      session: '2025-2027',
      subjects: [
        { subject_code: 'CPAC 201', subject_name: 'IT TOOLS', max_marks: 150, theory_marks: 65, practical_marks: 45, total_marks: 110 },
        { subject_code: 'CPAC 202', subject_name: 'Financial Accounting', max_marks: 150, theory_marks: 70, practical_marks: 48, total_marks: 118 },
        { subject_code: 'CPAC 203', subject_name: 'Tally', max_marks: 150, theory_marks: 68, practical_marks: 46, total_marks: 114 },
        { subject_code: 'CPAC 204', subject_name: 'Taxation & Project Work', max_marks: 150, theory_marks: 60, practical_marks: 42, total_marks: 102 }
      ],
      grand_total_max: 600,
      grand_total_obtained: 444,
      percentage: 74.00,
      grade: 'B',
      issue_date: '13.07.2026',
      photo_url: 'https://iili.io/CNGWoTG.md.jpg'
    }
  ]);

  const [marksheetStatus, setMarksheetStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [selectedMarksheetForPrint, setSelectedMarksheetForPrint] = useState<MarksheetRecord | null>(null);
  const [marksheetSearch, setMarksheetSearch] = useState('');

  const handleMarksheetExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length <= 1) {
          setMarksheetStatus({ type: 'error', msg: 'CSV file is empty or missing headers.' });
          return;
        }

        const mapByStudent: { [key: string]: MarksheetRecord } = {};

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (cols.length >= 8) {
            const courseName = cols[0] || 'Computerised Professional Accounting Course';
            const rollNo = cols[1] || `ROLL-${i}`;
            const enrollmentNo = cols[2] || `ENR-${i}`;
            const sName = cols[3] || 'Student Name';
            const fName = cols[4] || '';
            const center = cols[5] || 'MITM, BILARI';
            const session = cols[6] || '2025-2027';
            const serialNo = cols[7] || `DN-${3750 + i}`;
            const photoUrl = cols[8] || '';

            const key = `${enrollmentNo}_${rollNo}`;

            if (!mapByStudent[key]) {
              mapByStudent[key] = {
                enrollment_no: enrollmentNo,
                roll_no: rollNo,
                serial_no: serialNo,
                student_name: sName,
                father_name: fName,
                course_name: courseName,
                study_center: center,
                session: session,
                subjects: [],
                grand_total_max: 0,
                grand_total_obtained: 0,
                percentage: 0,
                grade: 'C',
                issue_date: cols[16] || '13.07.2026',
                photo_url: photoUrl
              };
            }

            const code = cols[9] || `SUB-${mapByStudent[key].subjects.length + 1}`;
            const subName = cols[10] || 'Subject';
            const maxM = Number(cols[11]) || 150;
            const thM = Number(cols[12]) || 0;
            const prM = Number(cols[13]) || 0;
            const totM = Number(cols[14]) || (thM + prM);

            mapByStudent[key].subjects.push({
              subject_code: code,
              subject_name: subName,
              max_marks: maxM,
              theory_marks: thM,
              practical_marks: prM,
              total_marks: totM
            });
          }
        }

        const parsedList = Object.values(mapByStudent).map((rec) => {
          const totalMax = rec.subjects.reduce((sum, s) => sum + s.max_marks, 0);
          const totalObt = rec.subjects.reduce((sum, s) => sum + s.total_marks, 0);
          const pct = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
          let calcGrade = 'C';
          if (pct >= 90) calcGrade = 'Ex';
          else if (pct >= 80) calcGrade = 'A';
          else if (pct >= 70) calcGrade = 'B';
          else if (pct >= 60) calcGrade = 'C';
          else if (pct >= 40) calcGrade = 'D';
          else calcGrade = 'F';

          return {
            ...rec,
            grand_total_max: totalMax,
            grand_total_obtained: totalObt,
            percentage: pct,
            grade: calcGrade
          };
        });

        if (parsedList.length === 0) {
          setMarksheetStatus({ type: 'error', msg: 'No valid marksheet records found in CSV file.' });
          return;
        }

        setMarksheetsList([...parsedList, ...marksheetsList]);
        setMarksheetStatus({ type: 'success', msg: `Successfully imported ${parsedList.length} student marksheet records!` });
      } catch (err) {
        setMarksheetStatus({ type: 'error', msg: 'Error parsing Marksheet CSV file.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadMarksheetTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Course Name,Roll No,Enrollment No,Name,Fathers Name,Study Center,Session,Document No,Photo,Paper Code,Paper name,max marks,theory,practical,Total Marks,Percentage,Date Of Issue\n' +
      'Computerised Professional Accounting Course,103766,1039954663,SHREYA CHUG,YOGESH CHUG,MITM BILARI,2025-2027,DN-3754,https://iili.io/CNGWoTG.md.jpg,CPAC 201,IT TOOLS,150,65,45,110,74.00,13.07.2026\n' +
      'Computerised Professional Accounting Course,103766,1039954663,SHREYA CHUG,YOGESH CHUG,MITM BILARI,2025-2027,DN-3754,https://iili.io/CNGWoTG.md.jpg,CPAC 202,Financial Accounting,150,70,48,118,74.00,13.07.2026\n' +
      'Computerised Professional Accounting Course,103766,1039954663,SHREYA CHUG,YOGESH CHUG,MITM BILARI,2025-2027,DN-3754,https://iili.io/CNGWoTG.md.jpg,CPAC 203,Tally,150,68,46,114,74.00,13.07.2026\n' +
      'Computerised Professional Accounting Course,103766,1039954663,SHREYA CHUG,YOGESH CHUG,MITM BILARI,2025-2027,DN-3754,https://iili.io/CNGWoTG.md.jpg,CPAC 204,Taxation & Project Work,150,60,42,102,74.00,13.07.2026';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Marksheet_Excel_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // TAB 3: CERTIFICATE UPLOAD & GENERATION STATE & HANDLERS
  // =========================================================================
  const [certificatesList, setCertificatesList] = useState<CertificateRecord[]>([
    {
      roll_no: '103774',
      enrollment_no: '1039954671',
      session: '2025-2026',
      serial_no: 'DN-3762',
      student_name: 'BANTY',
      father_name: 'BATTU',
      course_name: 'Desktop Publishing Course',
      start_date: '01.08.2025',
      end_date: '31.01.2026',
      grade: 'C',
      issue_date: '02.04.2026',
      institute_name: 'MITM BILARI',
      photo_url: 'https://i.postimg.cc/zG4WY1PR/103354.jpg'
    }
  ]);

  const [certificateStatus, setCertificateStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [selectedCertForPrint, setSelectedCertForPrint] = useState<CertificateRecord | null>(null);
  const [certSearch, setCertSearch] = useState('');

  const handleCertificateExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length <= 1) {
          setCertificateStatus({ type: 'error', msg: 'CSV file is empty or missing headers.' });
          return;
        }

        const newRecords: CertificateRecord[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (cols.length >= 6) {
            newRecords.push({
              roll_no: cols[0] || `ROLL-${i}`,
              enrollment_no: cols[1] || `ENR-${i}`,
              session: cols[2] || '2025-2026',
              serial_no: cols[3] || `DN-${3760 + i}`,
              student_name: cols[4] || 'Student Name',
              father_name: cols[5] || '',
              course_name: cols[6] || 'Desktop Publishing Course',
              start_date: cols[7] || '01.08.2025',
              end_date: cols[8] || '31.01.2026',
              grade: cols[9] || 'C',
              issue_date: cols[10] || '02.04.2026',
              institute_name: cols[11] || 'MITM BILARI',
              photo_url: cols[12] || '/student-placeholder.jpg'
            });
          }
        }

        setCertificatesList([...newRecords, ...certificatesList]);
        setCertificateStatus({ type: 'success', msg: `Successfully imported ${newRecords.length} student certificate records!` });
      } catch (err) {
        setCertificateStatus({ type: 'error', msg: 'Error parsing Certificate CSV file.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadCertificateTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Roll No,Enrollment No,Session,Serial No,Student Name,Father Name,Course Name,Start Date,End Date,Grade,Issue Date,Institute Name,Photo URL\n' +
      '103774,1039954671,2025-2026,DN-3762,BANTY,BATTU,Desktop Publishing Course,01.08.2025,31.01.2026,C,02.04.2026,MITM BILARI,https://i.postimg.cc/zG4WY1PR/103354.jpg';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Certificate_Excel_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      
      {/* ========================================================================= */}
      {/* 🖨️ BULLETPROOF PRINT CSS RULES (GUARENTEES EXACT SINGLE PAGE A4 PRINT) */}
      {/* ========================================================================= */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide everything else on the screen */
          body * {
            visibility: hidden !important;
          }
          /* Show ONLY printable document container */
          #printable-card, #printable-card *,
          #printable-marksheet, #printable-marksheet *,
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-card, #printable-marksheet, #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            z-index: 999999 !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
          /* Letterhead mode top margin padding */
          .letterhead-mode {
            padding-top: 45mm !important;
          }
          .hide-on-letterhead {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Top Header Navbar */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow-md flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-red-800 font-black text-base shadow">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">MANAVTA Admin Control Center</h1>
            <p className="text-xs text-sky-400">Institute Student Admission, Marksheet & Certificate Portal</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('admin_session');
            router.push('/admin/login');
          }}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow transition cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-300 bg-white rounded-t-xl shadow-sm px-3 pt-3 gap-2 no-print">
          <button
            onClick={() => setActiveTab('admission')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition cursor-pointer ${
              activeTab === 'admission'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📝 1. Student Admission Details
          </button>
          <button
            onClick={() => setActiveTab('marksheets')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition cursor-pointer ${
              activeTab === 'marksheets'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📊 2. Student Marks & Marksheet
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            🎓 3. Student Marks & Certificate
          </button>
        </div>

        {/* TAB 1: STUDENT ADMISSION DETAILS */}
        {activeTab === 'admission' && (
          <div className="bg-white p-6 sm:p-8 rounded-b-xl shadow-md border border-t-0 border-slate-200 space-y-8 no-print">
            
            {admissionStatus && (
              <div className={`p-4 rounded-lg border text-sm font-semibold ${
                admissionStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {admissionStatus.msg}
              </div>
            )}

            {/* Single Student Admission Form */}
            <form onSubmit={handleStudentFormSubmit} className="space-y-4 border-b pb-8">
              <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                ➕ Single Student Admission Entry Form
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Enrollment No *</label>
                  <input
                    type="text"
                    value={singleStudent.enrollment_no}
                    onChange={(e) => setSingleStudent({ ...singleStudent, enrollment_no: e.target.value })}
                    placeholder="e.g. 1039954663"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Roll No</label>
                  <input
                    type="text"
                    value={singleStudent.roll_no}
                    onChange={(e) => setSingleStudent({ ...singleStudent, roll_no: e.target.value })}
                    placeholder="e.g. 103766"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Student Name *</label>
                  <input
                    type="text"
                    value={singleStudent.student_name}
                    onChange={(e) => setSingleStudent({ ...singleStudent, student_name: e.target.value })}
                    placeholder="e.g. SHREYA CHUG"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Father's Name *</label>
                  <input
                    type="text"
                    value={singleStudent.father_name}
                    onChange={(e) => setSingleStudent({ ...singleStudent, father_name: e.target.value })}
                    placeholder="e.g. YOGESH CHUG"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={singleStudent.mother_name}
                    onChange={(e) => setSingleStudent({ ...singleStudent, mother_name: e.target.value })}
                    placeholder="e.g. SUNITA CHUG"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={singleStudent.course_name}
                    onChange={(e) => setSingleStudent({ ...singleStudent, course_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Admission Date *</label>
                  <input
                    type="text"
                    value={singleStudent.admission_date}
                    onChange={(e) => setSingleStudent({ ...singleStudent, admission_date: e.target.value })}
                    placeholder="e.g. 01.08.2025"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mobile No</label>
                  <input
                    type="text"
                    value={singleStudent.mobile_no}
                    onChange={(e) => setSingleStudent({ ...singleStudent, mobile_no: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={singleStudent.photo_url}
                    onChange={(e) => setSingleStudent({ ...singleStudent, photo_url: e.target.value })}
                    placeholder="Paste photo image link"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Institute Name</label>
                  <input
                    type="text"
                    value={singleStudent.institute_name}
                    onChange={(e) => setSingleStudent({ ...singleStudent, institute_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded shadow transition cursor-pointer"
                >
                  Save Student Admission Entry
                </button>
              </div>
            </form>

            {/* Bulk Upload CSV Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">📁 Bulk Upload Admission Details via Excel / CSV</h4>
                  <p className="text-xs text-slate-500">Upload your student admission records CSV file matching form columns.</p>
                </div>
                <button
                  onClick={downloadAdmissionTemplate}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded shadow transition cursor-pointer"
                >
                  📥 Download Sample CSV
                </button>
              </div>

              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleAdmissionExcelUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
              />
            </div>

            {/* Registered Students Table & ID Card Preview Button */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h4 className="font-bold text-sm text-slate-800 uppercase">📋 Registered Students List ({studentsList.length})</h4>
                <input
                  type="text"
                  value={admissionSearch}
                  onChange={(e) => setAdmissionSearch(e.target.value)}
                  placeholder="🔍 Search by Name, Enrollment No..."
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs w-full sm:w-64 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-2.5">Enrollment No</th>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Father Name</th>
                      <th className="p-2.5">Course</th>
                      <th className="p-2.5">Admission Date</th>
                      <th className="p-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentsList
                      .filter(s => 
                        s.student_name.toLowerCase().includes(admissionSearch.toLowerCase()) ||
                        s.enrollment_no.includes(admissionSearch)
                      )
                      .map((student) => (
                        <tr key={student.enrollment_no} className="hover:bg-slate-50 transition">
                          <td className="p-2.5 font-bold text-sky-700">{student.enrollment_no}</td>
                          <td className="p-2.5">{student.roll_no || '-'}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{student.student_name}</td>
                          <td className="p-2.5">{student.father_name}</td>
                          <td className="p-2.5">{student.course_name}</td>
                          <td className="p-2.5">{student.admission_date}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => setSelectedStudentForID(student)}
                              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                            >
                              🖨️ View & Print ID Card
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MARKSHEET UPLOAD & GENERATION */}
        {activeTab === 'marksheets' && (
          <div className="bg-white p-6 sm:p-8 rounded-b-xl shadow-md border border-t-0 border-slate-200 space-y-8 no-print">
            
            {marksheetStatus && (
              <div className={`p-4 rounded-lg border text-sm font-semibold ${
                marksheetStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {marksheetStatus.msg}
              </div>
            )}

            {/* NO FORM - Direct Bulk Upload Section ONLY */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                    📁 Upload Student Marks Excel / CSV File
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No form filling required! Directly upload your Excel/CSV file containing subject marks breakdown to generate marksheets.
                  </p>
                </div>
                <button
                  onClick={downloadMarksheetTemplate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  📥 Download Marksheet Excel Template
                </button>
              </div>

              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleMarksheetExcelUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
              />
            </div>

            {/* Generated Marksheets List */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h4 className="font-bold text-sm text-slate-800 uppercase">📋 Generated Student Marksheets ({marksheetsList.length})</h4>
                <input
                  type="text"
                  value={marksheetSearch}
                  onChange={(e) => setMarksheetSearch(e.target.value)}
                  placeholder="🔍 Search Marksheet..."
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs w-full sm:w-64 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Enrollment No</th>
                      <th className="p-2.5">Candidate Name</th>
                      <th className="p-2.5">Course Name</th>
                      <th className="p-2.5">Total Marks</th>
                      <th className="p-2.5">Grade</th>
                      <th className="p-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {marksheetsList
                      .filter(m => 
                        m.student_name.toLowerCase().includes(marksheetSearch.toLowerCase()) ||
                        m.enrollment_no.includes(marksheetSearch) ||
                        m.roll_no.includes(marksheetSearch)
                      )
                      .map((m) => (
                        <tr key={m.enrollment_no} className="hover:bg-slate-50 transition">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{m.roll_no}</td>
                          <td className="p-2.5 font-bold text-sky-700">{m.enrollment_no}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{m.student_name}</td>
                          <td className="p-2.5">{m.course_name}</td>
                          <td className="p-2.5 font-bold text-emerald-700">{m.grand_total_obtained} / {m.grand_total_max}</td>
                          <td className="p-2.5 font-bold text-slate-900">{m.grade}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => setSelectedMarksheetForPrint(m)}
                              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                            >
                              🖨️ View & Print Marksheet
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CERTIFICATE UPLOAD & GENERATION */}
        {activeTab === 'certificates' && (
          <div className="bg-white p-6 sm:p-8 rounded-b-xl shadow-md border border-t-0 border-slate-200 space-y-8 no-print">
            
            {certificateStatus && (
              <div className={`p-4 rounded-lg border text-sm font-semibold ${
                certificateStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {certificateStatus.msg}
              </div>
            )}

            {/* NO FORM - Direct Bulk Upload Section ONLY */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                    📁 Upload Student Certificate Excel / CSV File
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No form filling required! Directly upload your Excel/CSV file to generate student course completion certificates.
                  </p>
                </div>
                <button
                  onClick={downloadCertificateTemplate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  📥 Download Certificate Excel Template
                </button>
              </div>

              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleCertificateExcelUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
              />
            </div>

            {/* Generated Certificates List */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h4 className="font-bold text-sm text-slate-800 uppercase">📋 Generated Student Certificates ({certificatesList.length})</h4>
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="🔍 Search Certificate..."
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs w-full sm:w-64 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Enrollment No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Course Name</th>
                      <th className="p-2.5">Serial No</th>
                      <th className="p-2.5">Grade</th>
                      <th className="p-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {certificatesList
                      .filter(c => 
                        c.student_name.toLowerCase().includes(certSearch.toLowerCase()) ||
                        c.enrollment_no.includes(certSearch) ||
                        c.roll_no.includes(certSearch)
                      )
                      .map((c) => (
                        <tr key={c.enrollment_no} className="hover:bg-slate-50 transition">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{c.roll_no}</td>
                          <td className="p-2.5 font-bold text-sky-700">{c.enrollment_no}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{c.student_name}</td>
                          <td className="p-2.5">{c.course_name}</td>
                          <td className="p-2.5 font-mono text-amber-700 font-bold">{c.serial_no}</td>
                          <td className="p-2.5 font-bold text-slate-900">{c.grade}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => setSelectedCertForPrint(c)}
                              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                            >
                              🖨️ View & Print Certificate
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 📜 PRINT PREVIEW MODALS */}
      {/* ========================================================================= */}

      {/* 1. STUDENT ID CARD PRINT PREVIEW MODAL */}
      {selectedStudentForID && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8 relative">
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <h3 className="text-base font-bold text-slate-800">🖨️ Student ID Card Print Preview</h3>
              <button
                onClick={() => setSelectedStudentForID(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* PRINTABLE ID CARD CONTAINER */}
            <div id="printable-card" className="bg-white border border-slate-200 shadow-md rounded-xl p-6 text-slate-900 font-sans">
              {/* Header 3 Logos */}
              <div className="flex items-center justify-center gap-4 border-b pb-4 mb-6">
                <img src="/mitm-logo.png" alt="MITM Emblem" className="h-16 object-contain" />
                <img src="/manavta-text-logo.png" alt="MANAVTA" className="h-12 object-contain" />
                <img src="/iso-certified-badge.png" alt="ISO" className="h-16 object-contain" />
              </div>

              {/* Grid: Details Left, Photo Right */}
              <div className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-8 space-y-3 text-sm">
                  <div className="grid grid-cols-12"><span className="col-span-5 font-bold">Enrollment No:</span><span className="col-span-7">{selectedStudentForID.enrollment_no}</span></div>
                  <div className="grid grid-cols-12"><span className="col-span-5 font-bold">Course:</span><span className="col-span-7">{selectedStudentForID.course_name}</span></div>
                  <div className="grid grid-cols-12"><span className="col-span-5 font-bold">Name:</span><span className="col-span-7 font-bold text-slate-900">{selectedStudentForID.student_name}</span></div>
                  <div className="grid grid-cols-12"><span className="col-span-5 font-bold">Fathers Name:</span><span className="col-span-7">{selectedStudentForID.father_name}</span></div>
                  <div className="grid grid-cols-12"><span className="col-span-5 font-bold">Addmission Date:</span><span className="col-span-7">{selectedStudentForID.admission_date}</span></div>
                  <div className="grid grid-cols-12"><span className="col-span-5 font-bold">Institute Name:</span><span className="col-span-7">{selectedStudentForID.institute_name}</span></div>
                </div>

                <div className="col-span-4 flex flex-col items-center justify-center">
                  <div className="w-28 h-32 border border-slate-300 p-0.5 bg-white shadow-sm overflow-hidden mb-3">
                    <img src={selectedStudentForID.photo_url || '/student-placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center pt-2 border-t border-slate-300 w-full flex flex-col items-center">
                    <img src="/authorised-signature.png" alt="Signatory" className="h-8 object-contain mb-0.5" />
                    <span className="text-[11px] font-bold text-slate-800">Authorised Signatory</span>
                    <span className="text-[9px] text-slate-500">Manavta Institute</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t no-print">
              <button
                onClick={() => setSelectedStudentForID(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-xs transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={triggerPrint}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-xs shadow transition cursor-pointer flex items-center gap-1.5"
              >
                🖨️ Print ID Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENT MARKSHEET PRINT PREVIEW MODAL */}
      {selectedMarksheetForPrint && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 no-print">
              <div>
                <h3 className="text-base font-bold text-slate-800">🖨️ Student Marksheet Print Preview</h3>
                <label className="flex items-center gap-2 mt-1 cursor-pointer text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                  <input
                    type="checkbox"
                    checked={isLetterhead}
                    onChange={(e) => setIsLetterhead(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>📄 Print on Pre-Printed Letterhead (Leave Top Margin & Hide Header Logos)</span>
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerPrint}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  🖨️ Print Marksheet
                </button>
                <button
                  onClick={() => setSelectedMarksheetForPrint(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* PRINTABLE MARKSHEET CONTAINER */}
            <div 
              id="printable-marksheet" 
              className={`bg-white border border-slate-300 p-6 sm:p-8 text-slate-900 font-sans relative ${
                isLetterhead ? 'letterhead-mode' : ''
              }`}
            >
              {/* Header 3 Logos & Title (Hidden if Letterhead mode) */}
              <div className={`text-center space-y-2 mb-4 border-b pb-4 ${isLetterhead ? 'hide-on-letterhead' : ''}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <img src="/mitm-logo.png" alt="MITM Emblem" className="h-14 object-contain" />
                  <img src="/manavta-text-logo.png" alt="MANAVTA" className="h-10 object-contain" />
                  <img src="/iso-certified-badge.png" alt="ISO" className="h-14 object-contain" />
                </div>
                <h2 className="text-2xl font-black tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-0.5">
                  STATEMENT OF MARKS
                </h2>
              </div>

              {/* Candidate Info Grid */}
              <div className="space-y-1.5 text-xs sm:text-sm font-semibold border-b pb-3 mb-4">
                <div className="grid grid-cols-12"><span className="col-span-4 uppercase text-slate-600">PROGRAMME NAME:</span><span className="col-span-8 font-bold text-slate-900">{selectedMarksheetForPrint.course_name}</span></div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 uppercase text-slate-600">ROLL NO:</span>
                  <span className="col-span-4 font-bold text-slate-900">{selectedMarksheetForPrint.roll_no}</span>
                  <span className="col-span-4 text-right font-mono font-bold text-amber-800">{selectedMarksheetForPrint.serial_no}</span>
                </div>
                <div className="grid grid-cols-12"><span className="col-span-4 uppercase text-slate-600">ENROLLMENT NO:</span><span className="col-span-8 font-bold text-slate-900">{selectedMarksheetForPrint.enrollment_no}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4 uppercase text-slate-600">NAME OF CANDIDATE:</span><span className="col-span-8 font-bold text-slate-900 uppercase">{selectedMarksheetForPrint.student_name}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4 uppercase text-slate-600">FATHERS NAME:</span><span className="col-span-8 font-bold text-slate-900 uppercase">{selectedMarksheetForPrint.father_name}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4 uppercase text-slate-600">STUDY CENTER:</span><span className="col-span-8 font-bold text-slate-900">{selectedMarksheetForPrint.study_center}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4 uppercase text-slate-600">SESSION:</span><span className="col-span-8 font-bold text-slate-900">{selectedMarksheetForPrint.session}</span></div>
              </div>

              {/* Subject Breakdown Table */}
              <table className="w-full border-collapse border border-slate-900 text-center text-xs mb-4">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-900 uppercase">
                    <th className="border border-slate-900 p-2 text-left">PAPER CODE</th>
                    <th className="border border-slate-900 p-2 text-left">COURSE NAME</th>
                    <th className="border border-slate-900 p-2">MAX. MARKS</th>
                    <th className="border border-slate-900 p-2">THEORY</th>
                    <th className="border border-slate-900 p-2">PRACTICAL</th>
                    <th className="border border-slate-900 p-2">TOTAL MARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMarksheetForPrint.subjects.map((sub, idx) => (
                    <tr key={idx} className="border-b border-slate-300">
                      <td className="border border-slate-900 p-2 font-mono font-bold text-left">{sub.subject_code}</td>
                      <td className="border border-slate-900 p-2 text-left font-semibold">{sub.subject_name}</td>
                      <td className="border border-slate-900 p-2 font-bold">{sub.max_marks}</td>
                      <td className="border border-slate-900 p-2">{sub.theory_marks}</td>
                      <td className="border border-slate-900 p-2">{sub.practical_marks}</td>
                      <td className="border border-slate-900 p-2 font-bold text-sky-800">{sub.total_marks}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-900 text-xs">
                    <td colSpan={2} className="border border-slate-900 p-2 text-right uppercase">GRAND TOTAL =</td>
                    <td className="border border-slate-900 p-2">{selectedMarksheetForPrint.grand_total_max}</td>
                    <td colSpan={2} className="border border-slate-900 p-2">OBTAINED: {selectedMarksheetForPrint.grand_total_obtained}</td>
                    <td className="border border-slate-900 p-2 font-bold text-emerald-800">{selectedMarksheetForPrint.grand_total_obtained}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals & Grade Bar */}
              <div className="flex justify-between items-center border border-slate-900 p-2.5 font-bold text-xs bg-slate-50 mb-6">
                <div>GRADE: <span className="text-base text-rose-700 ml-1">{selectedMarksheetForPrint.grade}</span></div>
                <div>PERCENTAGE: <span className="text-base text-emerald-700 ml-1">{selectedMarksheetForPrint.percentage}%</span></div>
              </div>

              {/* Signatures + QR CODE Section */}
              <div className="grid grid-cols-12 gap-2 items-end pt-4 border-t border-slate-300">
                {/* Left Signature */}
                <div className="col-span-4 text-center space-y-1">
                  <img src="/authorised-signature.png" alt="Director Sign" className="h-10 object-contain mx-auto" />
                  <p className="text-xs font-bold text-slate-900 border-t border-slate-400 pt-1">Director (MITM BILARI)</p>
                </div>

                {/* Center VERIFICATION QR CODE */}
                <div className="col-span-4 flex flex-col items-center justify-center text-center">
                  <img 
                    src={getQRCodeUrl(`https://manavta-institute-portal.vercel.app/verify?enrollment=${selectedMarksheetForPrint.enrollment_no}`)}
                    alt="Verification QR Code" 
                    className="w-20 h-20 border border-slate-300 p-1 bg-white shadow-sm mb-1"
                  />
                  <span className="text-[9px] font-mono font-bold text-slate-600">Scan to Verify Result</span>
                  <span className="text-[8px] text-slate-400">Date: {selectedMarksheetForPrint.issue_date}</span>
                </div>

                {/* Right Signature */}
                <div className="col-span-4 text-center space-y-1">
                  <img src="/authorised-signature.png" alt="Exam Controller Sign" className="h-10 object-contain mx-auto" />
                  <p className="text-xs font-bold text-slate-900 border-t border-slate-400 pt-1">Chief Exam Controller</p>
                </div>
              </div>

              {/* Footer Grade Legend */}
              <div className="mt-6 pt-2 border-t text-[10px] text-center font-bold text-slate-600 tracking-tight">
                GRADE LEGEND-Ex:90% & over | A:80%-89% | B:70%-79% | C:60%-69% | D:40%-59% | F:Less than 40%(Fail)
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. STUDENT CERTIFICATE PRINT PREVIEW MODAL */}
      {selectedCertForPrint && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 no-print">
              <div>
                <h3 className="text-base font-bold text-slate-800">🖨️ Student Course Certificate Print Preview</h3>
                <label className="flex items-center gap-2 mt-1 cursor-pointer text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                  <input
                    type="checkbox"
                    checked={isLetterhead}
                    onChange={(e) => setIsLetterhead(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>📄 Print on Pre-Printed Letterhead (Leave Top Margin & Hide Header Logos)</span>
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerPrint}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  🖨️ Print Certificate
                </button>
                <button
                  onClick={() => setSelectedCertForPrint(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* PRINTABLE CERTIFICATE CONTAINER */}
            <div 
              id="printable-certificate" 
              className={`bg-white border-4 border-amber-600 p-8 text-slate-900 font-serif relative shadow-inner ${
                isLetterhead ? 'letterhead-mode' : ''
              }`}
            >
              {/* Header 3 Logos & Title (Hidden if Letterhead mode) */}
              <div className={`text-center space-y-3 mb-6 ${isLetterhead ? 'hide-on-letterhead' : ''}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <img src="/mitm-logo.png" alt="MITM Emblem" className="h-16 object-contain" />
                  <img src="/manavta-text-logo.png" alt="MANAVTA" className="h-12 object-contain" />
                  <img src="/iso-certified-badge.png" alt="ISO" className="h-16 object-contain" />
                </div>
              </div>

              {/* Certificate Details Top Bar */}
              <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-800 pb-2 mb-6 text-xs sm:text-sm font-sans font-bold text-slate-800">
                <div>Roll No. - <span className="text-slate-900">{selectedCertForPrint.roll_no}</span></div>
                <div>Enrollment No. - <span className="text-slate-900">{selectedCertForPrint.enrollment_no}</span></div>
                <div>Session - <span className="text-slate-900">{selectedCertForPrint.session}</span></div>
                <div className="text-amber-800 font-mono">{selectedCertForPrint.serial_no}</div>
              </div>

              {/* Main CERTIFICATE Heading */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-slate-900 uppercase border-b-2 border-amber-600 inline-block pb-1">
                  CERTIFICATE
                </h1>
              </div>

              {/* Certificate Award Text */}
              <div className="text-center leading-relaxed text-base sm:text-lg font-medium space-y-4 px-4 my-8 text-slate-800">
                <p>
                  This certificate is awarded to{' '}
                  <span className="font-bold text-slate-900 underline underline-offset-4 uppercase px-1">
                    {selectedCertForPrint.student_name}
                  </span>{' '}
                  S/O{' '}
                  <span className="font-bold text-slate-900 underline underline-offset-4 uppercase px-1">
                    {selectedCertForPrint.father_name}
                  </span>{' '}
                  in recognition of successful completion of{' '}
                  <span className="font-bold text-slate-900 underline underline-offset-4 uppercase px-1">
                    {selectedCertForPrint.course_name}
                  </span>{' '}
                  conducted in our own campus from{' '}
                  <span className="font-semibold text-slate-900">{selectedCertForPrint.start_date}</span> to{' '}
                  <span className="font-semibold text-slate-900">{selectedCertForPrint.end_date}</span>.
                </p>
                <p className="text-lg font-bold text-slate-900 pt-2">
                  His/Her performance was grade{' '}
                  <span className="text-xl font-black text-rose-700 bg-amber-50 px-3 py-1 rounded border border-amber-300">
                    {selectedCertForPrint.grade}
                  </span>.
                </p>
              </div>

              {/* Signatures + VERIFICATION QR CODE Section */}
              <div className="grid grid-cols-12 gap-2 items-end pt-8 mt-12 border-t border-slate-300 font-sans">
                {/* Left Signature */}
                <div className="col-span-4 text-center space-y-1">
                  <img src="/authorised-signature.png" alt="Director Sign" className="h-10 object-contain mx-auto" />
                  <p className="text-xs font-bold text-slate-900 border-t border-slate-400 pt-1">Director ({selectedCertForPrint.institute_name})</p>
                </div>

                {/* Center VERIFICATION QR CODE */}
                <div className="col-span-4 flex flex-col items-center justify-center text-center">
                  <img 
                    src={getQRCodeUrl(`https://manavta-institute-portal.vercel.app/verify?enrollment=${selectedCertForPrint.enrollment_no}`)}
                    alt="Verification QR Code" 
                    className="w-20 h-20 border border-slate-300 p-1 bg-white shadow-sm mb-1"
                  />
                  <span className="text-[9px] font-mono font-bold text-slate-600">Scan to Verify Certificate</span>
                  <span className="text-[8px] text-slate-400">Issued: {selectedCertForPrint.issue_date}</span>
                </div>

                {/* Right Signature */}
                <div className="col-span-4 text-center space-y-1">
                  <img src="/authorised-signature.png" alt="Exam Controller Sign" className="h-10 object-contain mx-auto" />
                  <p className="text-xs font-bold text-slate-900 border-t border-slate-400 pt-1">Chief Exam Controller</p>
                </div>
              </div>

              {/* Footer Grade Legend */}
              <div className="mt-8 pt-2 border-t text-[10px] text-center font-sans font-bold text-slate-600 tracking-tight">
                GRADE LEGEND-Ex:90% & over | A:80%-89% | B:70%-79% | C:60%-69% | D:40%-59% | F:Less than 40%(Fail)
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
