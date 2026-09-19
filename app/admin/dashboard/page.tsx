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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'admission' | 'marksheets' | 'certificates'>('admission');
  const [isLetterheadMode, setIsLetterheadMode] = useState<boolean>(false);

  // Authentication Guard
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
    }
  }, [router]);

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
    setAdmissionStatus({ type: 'success', msg: 'Student admission record saved successfully!' });
    setSingleStudent({
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
          setAdmissionStatus({ type: 'error', msg: 'File is empty or missing header columns.' });
          return;
        }

        const newRecords: StudentRecord[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (cols.length >= 3) {
            newRecords.push({
              enrollment_no: cols[0] || `ENR-${Date.now()}-${i}`,
              roll_no: cols[1] || '',
              student_name: cols[2] || '',
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
        setAdmissionStatus({ type: 'error', msg: 'Error processing Excel CSV file.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadAdmissionTemplate = () => {
    const headers = ['Enrollment No', 'Roll No', 'Student Name', 'Father Name', 'Mother Name', 'Course Name', 'Admission Date', 'DOB', 'Mobile No', 'Institute Name', 'Photo URL'];
    const sample = ['1039954663', '103766', 'SHREYA CHUG', 'YOGESH CHUG', 'SUNITA CHUG', 'Computerised Professional Accounting Course', '01.08.2025', '15.08.2005', '9876543210', 'MITM, BILARI', 'https://iili.io/CNGWoTG.md.jpg'];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sample.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Student_Admission_Template.csv');
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
        { subject_code: 'CPAC 201', subject_name: 'IT TOOLS', max_marks: 150, theory_marks: 68, practical_marks: 45, total_marks: 113 },
        { subject_code: 'CPAC 202', subject_name: 'Financial Accounting', max_marks: 150, theory_marks: 65, practical_marks: 40, total_marks: 105 },
        { subject_code: 'CPAC 203', subject_name: 'Tally', max_marks: 150, theory_marks: 62, practical_marks: 38, total_marks: 100 },
        { subject_code: 'CPAC 204', subject_name: 'Taxation & Project Work', max_marks: 150, theory_marks: 60, practical_marks: 36, total_marks: 96 }
      ],
      grand_total_max: 600,
      grand_total_obtained: 414,
      percentage: 69.00,
      grade: 'C',
      issue_date: '02.04.2026'
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
          setMarksheetStatus({ type: 'error', msg: 'File is empty or missing headers.' });
          return;
        }

        // Group rows by student enrollment or roll no
        const grouped: { [key: string]: any } = {};

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (cols.length >= 6) {
            const course = cols[0] || 'Professional Course';
            const roll = cols[1] || '';
            const enrollment = cols[2] || `ENR-${i}`;
            const sName = cols[3] || 'Student Name';
            const fName = cols[4] || '';
            const center = cols[5] || 'MITM, BILARI';
            const sess = cols[6] || '2025-2026';
            const docNo = cols[7] || `DN-${3700 + i}`;
            const pCode = cols[9] || `SUB-${i}`;
            const pName = cols[10] || 'Subject Title';
            const maxM = Number(cols[11]) || 150;
            const thM = Number(cols[12]) || 0;
            const prM = Number(cols[13]) || 0;
            const totM = Number(cols[14]) || (thM + prM);
            const issueDate = cols[21] || cols[20] || '02.04.2026';

            const key = `${enrollment}_${roll}`;

            if (!grouped[key]) {
              grouped[key] = {
                enrollment_no: enrollment,
                roll_no: roll,
                serial_no: docNo,
                student_name: sName,
                father_name: fName,
                course_name: course,
                study_center: center,
                session: sess,
                issue_date: issueDate,
                subjects: []
              };
            }

            grouped[key].subjects.push({
              subject_code: pCode,
              subject_name: pName,
              max_marks: maxM,
              theory_marks: thM,
              practical_marks: prM,
              total_marks: totM
            });
          }
        }

        const newRecords: MarksheetRecord[] = Object.values(grouped).map((st: any) => {
          const totalMax = st.subjects.reduce((sum: number, s: SubjectMarks) => sum + s.max_marks, 0);
          const totalObt = st.subjects.reduce((sum: number, s: SubjectMarks) => sum + s.total_marks, 0);
          const pct = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
          let calcGrade = 'C';
          if (pct >= 90) calcGrade = 'Ex';
          else if (pct >= 80) calcGrade = 'A';
          else if (pct >= 70) calcGrade = 'B';
          else if (pct >= 60) calcGrade = 'C';
          else if (pct >= 40) calcGrade = 'D';
          else calcGrade = 'F';

          return {
            ...st,
            grand_total_max: totalMax,
            grand_total_obtained: totalObt,
            percentage: pct,
            grade: calcGrade
          };
        });

        setMarksheetsList([...newRecords, ...marksheetsList]);
        setMarksheetStatus({ type: 'success', msg: `Successfully imported ${newRecords.length} student marksheets!` });
      } catch (err) {
        setMarksheetStatus({ type: 'error', msg: 'Error parsing Marksheet Excel CSV file.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadMarksheetTemplate = () => {
    const headers = ['Course Name', 'Roll No', 'Enrollment No', 'Name', "Father's Name", 'Study Center', 'Session', 'Document No', 'Photo', 'Paper Code', 'Paper name', 'max marks', 'theory', 'practical', 'Total Marks', 'Total of max marks', 'total theory', 'total practical', 'all total', 'Percentage', 'GRADE', 'Date Of Issue'];
    const sample = ['Computerised Professional Accounting Course', '103766', '1039954663', 'SHREYA CHUG', 'YOGESH CHUG', 'MITM, BILARI', '2025-2027', 'DN-3754', '', 'CPAC 201', 'IT TOOLS', '150', '68', '45', '113', '600', '248', '166', '414', '69.00', 'C', '02.04.2026'];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sample.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Student_Marksheet_Excel_Template.csv');
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
      institute_name: 'MITM BILARI'
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
          setCertificateStatus({ type: 'error', msg: 'File is empty or missing headers.' });
          return;
        }

        const newRecords: CertificateRecord[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (cols.length >= 6) {
            newRecords.push({
              roll_no: cols[0] || '',
              enrollment_no: cols[1] || '',
              session: cols[2] || '2025-2026',
              serial_no: cols[3] || `DN-${3760 + i}`,
              student_name: cols[4] || '',
              father_name: cols[5] || '',
              course_name: cols[6] || 'Professional Course',
              start_date: cols[7] || '01.08.2025',
              end_date: cols[8] || '31.01.2026',
              grade: cols[9] || 'A',
              issue_date: cols[10] || '02.04.2026',
              institute_name: cols[11] || 'MITM BILARI'
            });
          }
        }

        setCertificatesList([...newRecords, ...certificatesList]);
        setCertificateStatus({ type: 'success', msg: `Successfully imported ${newRecords.length} student certificates!` });
      } catch (err) {
        setCertificateStatus({ type: 'error', msg: 'Error parsing Certificate Excel CSV file.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadCertificateTemplate = () => {
    const headers = ['Roll No', 'Enrollment No', 'Session', 'Serial No', 'Student Name', 'Father Name', 'Course Name', 'Start Date', 'End Date', 'Grade', 'Issue Date', 'Institute Name'];
    const sample = ['103774', '1039954671', '2025-2026', 'DN-3762', 'BANTY', 'BATTU', 'Desktop Publishing Course', '01.08.2025', '31.01.2026', 'C', '02.04.2026', 'MITM BILARI'];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sample.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Student_Certificate_Excel_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      
      {/* Print CSS Rules */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
          }
          #printable-doc, #printable-doc * {
            visibility: visible;
          }
          #printable-doc {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Header Bar */}
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
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Father&apos;s Name *</label>
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
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mother&apos;s Name</label>
                  <input
                    type="text"
                    value={singleStudent.mother_name}
                    onChange={(e) => setSingleStudent({ ...singleStudent, mother_name: e.target.value })}
                    placeholder="e.g. SUNITA DEVI"
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
                          <td className="p-2.5">{student.roll_no || ''}</td>
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
                  placeholder="🔍 Search Marksheet by Roll No, Enrollment..."
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
                  placeholder="🔍 Search Certificate by Roll No, Enrollment..."
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
            <div id="printable-doc" className="bg-white border border-slate-200 shadow-md rounded-xl p-6 text-slate-900 font-sans">
              <div className="flex items-center justify-center gap-4 border-b pb-4 mb-6">
                <img src="/mitm-logo.png" alt="MITM Emblem" className="h-16 object-contain" />
                <img src="/manavta-text-logo.png" alt="MANAVTA" className="h-12 object-contain" />
                <img src="/iso-certified-badge.png" alt="ISO" className="h-16 object-contain" />
              </div>

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
                    <img src="/authorised-signature.png" alt="" className="h-10 object-contain mb-1" />
                    <span className="text-[11px] font-bold text-slate-700">Authorised Signatory</span>
                    <span className="text-[9px] text-slate-500">Manavta Institute</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-3 no-print">
              <span className="text-xs text-slate-500">Formatted for standard Student Registration ID Card print.</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStudentForID(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  🖨️ Print ID Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MARKSHEET PRINT PREVIEW MODAL */}
      {selectedMarksheetForPrint && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl my-8 relative">
            
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <h3 className="text-base font-bold text-slate-800">🖨️ Marksheet Document Print Preview</h3>
              <button
                onClick={() => setSelectedMarksheetForPrint(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Letterhead Toggle Control */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-3 no-print">
              <input
                type="checkbox"
                id="letterheadModeMarksheet"
                checked={isLetterheadMode}
                onChange={(e) => setIsLetterheadMode(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded cursor-pointer"
              />
              <label htmlFor="letterheadModeMarksheet" className="text-xs font-bold text-amber-900 cursor-pointer">
                📄 Print on Pre-Printed Physical Letterhead (Leave ~140px Top Margin Space & Hide Top Logos)
              </label>
            </div>

            {/* PRINTABLE MARKSHEET DOCUMENT */}
            <div 
              id="printable-doc" 
              className={`bg-white border border-slate-200 shadow-md p-8 text-slate-900 font-sans text-xs space-y-6 ${
                isLetterheadMode ? 'pt-[140px]' : ''
              }`}
            >
              {/* Header Logos (Only when NOT on pre-printed letterhead) */}
              {!isLetterheadMode && (
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/mitm-logo.png" alt="MITM" className="h-14 object-contain" />
                    <div>
                      <h2 className="text-lg font-black text-slate-900 uppercase leading-none">MANAVTA INSTITUTE OF EDUCATION</h2>
                      <p className="text-[10px] text-slate-600 mt-1 font-semibold">An ISO 9001:2015 Certified Educational Institution</p>
                    </div>
                  </div>
                  <img src="/iso-certified-badge.png" alt="ISO" className="h-14 object-contain" />
                </div>
              )}

              {/* Document Title */}
              <div className="text-center border-b pb-2">
                <h1 className="text-xl font-black tracking-wider text-slate-900 uppercase">STATEMENT OF MARKS</h1>
              </div>

              {/* Candidate Info Block */}
              <div className="space-y-2 text-xs border-b pb-4">
                <div className="grid grid-cols-12"><span className="col-span-3 font-bold uppercase">PROGRAMME NAME:</span><span className="col-span-9 font-bold text-sky-800">{selectedMarksheetForPrint.course_name}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-3 font-bold uppercase">ROLL NO:</span><span className="col-span-4 font-mono font-bold">{selectedMarksheetForPrint.roll_no}</span><span className="col-span-2 font-bold uppercase">DOC NO:</span><span className="col-span-3 font-mono font-bold text-amber-800">{selectedMarksheetForPrint.serial_no}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-3 font-bold uppercase">ENROLLMENT NO:</span><span className="col-span-9 font-bold">{selectedMarksheetForPrint.enrollment_no}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-3 font-bold uppercase">NAME OF CANDIDATE:</span><span className="col-span-9 font-bold text-slate-900">{selectedMarksheetForPrint.student_name}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-3 font-bold uppercase">FATHERS NAME:</span><span className="col-span-9 font-bold">{selectedMarksheetForPrint.father_name}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-3 font-bold uppercase">STUDY CENTER:</span><span className="col-span-9 font-bold">{selectedMarksheetForPrint.study_center}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-3 font-bold uppercase">SESSION:</span><span className="col-span-9 font-bold">{selectedMarksheetForPrint.session}</span></div>
              </div>

              {/* Subject Breakdown Table */}
              <table className="w-full border-collapse border border-slate-300 text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300">PAPER CODE</th>
                    <th className="p-2 border-r border-slate-300">COURSE / PAPER NAME</th>
                    <th className="p-2 border-r border-slate-300 text-center">MAX. MARKS</th>
                    <th className="p-2 border-r border-slate-300 text-center">THEORY (100)</th>
                    <th className="p-2 border-r border-slate-300 text-center">PRACTICAL (50)</th>
                    <th className="p-2 text-center">TOTAL MARKS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedMarksheetForPrint.subjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-slate-300 font-mono font-bold">{sub.subject_code}</td>
                      <td className="p-2 border-r border-slate-300 font-medium">{sub.subject_name}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{sub.max_marks}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{sub.theory_marks}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{sub.practical_marks}</td>
                      <td className="p-2 text-center font-bold text-sky-800">{sub.total_marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculated Totals */}
              <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-slate-300">
                <div>GRAND TOTAL: <span className="font-mono text-sky-800">{selectedMarksheetForPrint.grand_total_obtained} / {selectedMarksheetForPrint.grand_total_max}</span></div>
                <div>PER. (%): <span className="font-mono text-emerald-800">{selectedMarksheetForPrint.percentage}%</span></div>
                <div>GRADE: <span className="font-mono text-amber-800">{selectedMarksheetForPrint.grade}</span></div>
              </div>

              {/* Signatures & Footer */}
              <div className="pt-10 flex justify-between items-end">
                <div className="text-center space-y-1">
                  <div className="font-bold text-slate-800">Director (MITM BILARI)</div>
                  <p className="text-[10px] text-slate-500">Authorized Signature</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="font-bold text-slate-800">Chief Exam Controller</div>
                  <p className="text-[10px] text-slate-500">Date Of Issue - {selectedMarksheetForPrint.issue_date}</p>
                </div>
              </div>

              <div className="border-t pt-3 text-[10px] text-slate-500 text-center font-semibold">
                GRADE LEGEND - Ex: 90% & over | A: 80%-89% | B: 70%-79% | C: 60%-69% | D: 40%-59% | F: Less than 40% (Fail)
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-3 no-print">
              <span className="text-xs text-slate-500">Matches official MITM Statement of Marks format.</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMarksheetForPrint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  🖨️ Print Marksheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CERTIFICATE PRINT PREVIEW MODAL */}
      {selectedCertForPrint && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl my-8 relative">
            
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <h3 className="text-base font-bold text-slate-800">🖨️ Certificate Document Print Preview</h3>
              <button
                onClick={() => setSelectedCertForPrint(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Letterhead Toggle Control */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-3 no-print">
              <input
                type="checkbox"
                id="letterheadModeCert"
                checked={isLetterheadMode}
                onChange={(e) => setIsLetterheadMode(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded cursor-pointer"
              />
              <label htmlFor="letterheadModeCert" className="text-xs font-bold text-amber-900 cursor-pointer">
                📄 Print on Pre-Printed Physical Letterhead (Leave ~140px Top Margin Space & Hide Top Logos)
              </label>
            </div>

            {/* PRINTABLE CERTIFICATE DOCUMENT */}
            <div 
              id="printable-doc" 
              className={`bg-white border-4 border-amber-500 rounded-xl p-8 text-slate-900 font-sans text-center space-y-6 shadow-sm ${
                isLetterheadMode ? 'pt-[140px]' : ''
              }`}
            >
              {/* Header Logos (Only when NOT on pre-printed letterhead) */}
              {!isLetterheadMode && (
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <img src="/mitm-logo.png" alt="MITM" className="h-16 object-contain" />
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">MANAVTA INSTITUTE OF EDUCATION</h2>
                    <p className="text-xs text-slate-600 font-semibold mt-1">An ISO 9001:2015 Certified Educational Institution</p>
                  </div>
                  <img src="/iso-certified-badge.png" alt="ISO" className="h-16 object-contain" />
                </div>
              )}

              {/* Title & Serial Bar */}
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-widest text-slate-900 uppercase">CERTIFICATE</h1>
                <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-700 pt-2 border-y py-2">
                  <span>Roll No. - <strong className="font-mono text-slate-900">{selectedCertForPrint.roll_no}</strong></span>
                  <span>Enrollment No. - <strong className="font-mono text-sky-800">{selectedCertForPrint.enrollment_no}</strong></span>
                  <span>Session - <strong className="font-mono">{selectedCertForPrint.session}</strong></span>
                  <span className="font-mono text-amber-800">{selectedCertForPrint.serial_no}</span>
                </div>
              </div>

              {/* Main Award Body Paragraph */}
              <div className="py-6 space-y-4 max-w-xl mx-auto leading-relaxed text-sm sm:text-base font-serif">
                <p>
                  This certificate is awarded to{' '}
                  <strong className="font-sans font-black text-slate-900 uppercase text-lg border-b-2 border-slate-900 px-2">{selectedCertForPrint.student_name}</strong>{' '}
                  S/O <strong className="font-sans font-bold text-slate-800 uppercase border-b border-slate-400 px-2">{selectedCertForPrint.father_name}</strong> in recognition of successful completion of{' '}
                  <strong className="font-sans font-black text-sky-900 uppercase text-lg underline">{selectedCertForPrint.course_name}</strong> conducted in our own campus from{' '}
                  <strong className="font-mono font-bold text-slate-800">{selectedCertForPrint.start_date}</strong> to{' '}
                  <strong className="font-mono font-bold text-slate-800">{selectedCertForPrint.end_date}</strong>.
                </p>
                <p className="text-sm font-sans font-bold text-slate-800 pt-2">
                  His/Her performance was grade <span className="text-lg font-black text-amber-800 border px-2 py-0.5 rounded bg-amber-50">{selectedCertForPrint.grade}</span>.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between items-end text-xs font-bold text-slate-800 px-4">
                <div className="text-center space-y-1">
                  <p>Director ({selectedCertForPrint.institute_name})</p>
                  <p className="text-[10px] text-slate-500 font-normal">Authorized Signature</p>
                </div>
                <div className="text-center space-y-1">
                  <p>Chief Exam Controller</p>
                  <p className="text-[10px] text-slate-500 font-normal">Date Of Issue - {selectedCertForPrint.issue_date}</p>
                </div>
              </div>

              <div className="border-t pt-3 text-[10px] text-slate-500 font-sans font-semibold">
                GRADE LEGEND - Ex: 90% & over | A: 80%-89% | B: 70%-79% | C: 60%-69% | D: 40%-59% | F: Less than 40% (Fail)
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-3 no-print">
              <span className="text-xs text-slate-500">Matches official MITM Certificate format.</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCertForPrint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  🖨️ Print Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
