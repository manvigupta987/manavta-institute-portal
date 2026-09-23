"use client";

import React, { useState } from 'react';

export interface SubjectMarks {
  paper_code: string;
  paper_name: string;
  max_marks: number;
  theory: number;
  practical: number;
  total_marks: number;
}

export interface MarksheetRecord {
  id: string;
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  mother_name?: string;
  dob?: string;
  study_center: string;
  session: string;
  serial_no: string;
  photo_url: string;
  course_name: string;
  subjects: SubjectMarks[];
  grand_total_obtained: number;
  grand_total_max: number;
  percentage: number;
  grade: string;
  issue_date: string;
}

interface StudentRecord {
  id: string;
  enrollment_no: string;
  roll_no: string;
  student_name: string;
  father_name: string;
  mother_name?: string;
  course_name: string;
  dob?: string;
  mobile_no?: string;
  aadhar_no?: string;
  photo_url?: string;
  study_center?: string;
}

interface MarksheetTabProps {
  studentsList?: StudentRecord[];
  isLetterhead?: boolean;
  setIsLetterhead?: (val: boolean) => void;
}

export default function MarksheetTabComponent({
  studentsList = [],
}: MarksheetTabProps) {
  // Marksheets Database State
  const [marksheetsList, setMarksheetsList] = useState<MarksheetRecord[]>([
    {
      id: 'm1',
      roll_no: '103766',
      enrollment_no: '1039954663',
      student_name: 'SHREYA CHUG',
      father_name: 'YOGESH CHUG',
      mother_name: 'SUNITA CHUG',
      dob: '15.08.2005',
      study_center: 'MITM BILARI',
      session: '2025-2027',
      serial_no: 'DN-3754',
      photo_url: 'https://iili.io/CNGWoTG.md.jpg',
      course_name: 'Computerised Professional Accounting Course',
      subjects: [
        { paper_code: 'CPAC 201', paper_name: 'IT TOOLS & BUSINESS SYSTEMS', max_marks: 150, theory: 70, practical: 45, total_marks: 115 },
        { paper_code: 'CPAC 202', paper_name: 'FINANCIAL ACCOUNTING & TALLY PRIME', max_marks: 150, theory: 75, practical: 48, total_marks: 123 },
        { paper_code: 'CPAC 203', paper_name: 'GST & DIRECT TAXATION SYSTEMS', max_marks: 150, theory: 80, practical: 46, total_marks: 126 },
        { paper_code: 'CPAC 204', paper_name: 'PROJECT WORK & VIVA VOCE', max_marks: 150, theory: 82, practical: 48, total_marks: 130 },
      ],
      grand_total_obtained: 494,
      grand_total_max: 600,
      percentage: 82.33,
      grade: 'A',
      issue_date: '02.04.2026',
    },
  ]);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    roll_no: '',
    enrollment_no: '',
    course_name: '',
    student_name: '',
    father_name: '',
    mother_name: '',
    dob: '',
    session: '2025-2027',
    study_center: 'MITM BILARI',
    serial_no: '',
    photo_url: '',
    issue_date: new Date().toISOString().split('T')[0],
  });

  // Dynamic Subjects State
  const [subjects, setSubjects] = useState<SubjectMarks[]>([
    { paper_code: 'CPAC 201', paper_name: 'IT TOOLS', max_marks: 150, theory: 70, practical: 45, total_marks: 115 },
    { paper_code: 'CPAC 202', paper_name: 'FINANCIAL ACCOUNTING', max_marks: 150, theory: 68, practical: 48, total_marks: 116 },
  ]);

  // View Modal State
  const [viewingMarksheet, setViewingMarksheet] = useState<MarksheetRecord | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'percentage'>('roll');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Roll Number Change & Auto-fill
  const handleRollNoChange = (rollVal: string) => {
    setFormData((prev) => ({ ...prev, roll_no: rollVal }));
    if (!rollVal.trim()) return;

    // Check existing marksheets first
    const existing = marksheetsList.find((m) => m.roll_no.trim() === rollVal.trim());
    if (existing && !editingId) {
      handleStartEdit(existing);
      return;
    }

    // Otherwise check students list
    const matched = studentsList.find((s) => s.roll_no.trim() === rollVal.trim());
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        roll_no: matched.roll_no,
        enrollment_no: matched.enrollment_no || prev.enrollment_no,
        course_name: matched.course_name || prev.course_name,
        student_name: matched.student_name || prev.student_name,
        father_name: matched.father_name || prev.father_name,
        mother_name: matched.mother_name || prev.mother_name,
        dob: matched.dob || prev.dob,
        study_center: matched.study_center || prev.study_center,
        photo_url: matched.photo_url || prev.photo_url,
        serial_no: prev.serial_no || `DN-${Math.floor(1000 + Math.random() * 9000)}`,
      }));
    }
  };

  // Add / Remove Dynamic Subject Rows
  const handleAddSubjectRow = () => {
    const nextNum = subjects.length + 1;
    setSubjects([
      ...subjects,
      {
        paper_code: `SUB 10${nextNum}`,
        paper_name: `PAPER ${nextNum}`,
        max_marks: 150,
        theory: 0,
        practical: 0,
        total_marks: 0,
      },
    ]);
  };

  const handleRemoveSubjectRow = (index: number) => {
    if (subjects.length <= 1) {
      alert('At least one subject is required.');
      return;
    }
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, field: keyof SubjectMarks, value: any) => {
    const updated = [...subjects];
    const item = { ...updated[index], [field]: value };

    if (field === 'theory' || field === 'practical') {
      const th = field === 'theory' ? Number(value) || 0 : Number(item.theory) || 0;
      const pr = field === 'practical' ? Number(value) || 0 : Number(item.practical) || 0;
      item.total_marks = th + pr;
    }

    updated[index] = item;
    setSubjects(updated);
  };

  // Calculations
  const grandObtained = subjects.reduce((sum, s) => sum + (Number(s.theory) || 0) + (Number(s.practical) || 0), 0);
  const grandMax = subjects.reduce((sum, s) => sum + (Number(s.max_marks) || 0), 0);
  const percentage = grandMax > 0 ? Number(((grandObtained / grandMax) * 100).toFixed(2)) : 0;

  const calculateGrade = (pct: number) => {
    if (pct >= 90) return 'Ex';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  const currentGrade = calculateGrade(percentage);

  // Edit Trigger
  const handleStartEdit = (m: MarksheetRecord) => {
    setEditingId(m.id);
    setFormData({
      roll_no: m.roll_no,
      enrollment_no: m.enrollment_no,
      course_name: m.course_name,
      student_name: m.student_name,
      father_name: m.father_name,
      mother_name: m.mother_name || '',
      dob: m.dob || '',
      session: m.session,
      study_center: m.study_center,
      serial_no: m.serial_no,
      photo_url: m.photo_url,
      issue_date: m.issue_date,
    });
    setSubjects(m.subjects && m.subjects.length > 0 ? m.subjects : []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      roll_no: '',
      enrollment_no: '',
      course_name: '',
      student_name: '',
      father_name: '',
      mother_name: '',
      dob: '',
      session: '2025-2027',
      study_center: 'MITM BILARI',
      serial_no: '',
      photo_url: '',
      issue_date: new Date().toISOString().split('T')[0],
    });
    setSubjects([
      { paper_code: 'CPAC 201', paper_name: 'IT TOOLS', max_marks: 150, theory: 70, practical: 45, total_marks: 115 },
      { paper_code: 'CPAC 202', paper_name: 'FINANCIAL ACCOUNTING', max_marks: 150, theory: 68, practical: 48, total_marks: 116 },
    ]);
  };

  // Submit Handler
  const handleSaveMarksheet = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roll_no || !formData.student_name || !formData.course_name) {
      alert('Please fill required fields: Roll No, Candidate Name, and Course Name.');
      return;
    }

    const newRecord: MarksheetRecord = {
      id: editingId || `m_${Date.now()}`,
      roll_no: formData.roll_no.trim(),
      enrollment_no: formData.enrollment_no.trim() || `ENR-${Date.now().toString().slice(-6)}`,
      student_name: formData.student_name.trim().toUpperCase(),
      father_name: formData.father_name.trim().toUpperCase(),
      mother_name: formData.mother_name.trim().toUpperCase(),
      dob: formData.dob.trim(),
      study_center: formData.study_center.trim(),
      session: formData.session.trim(),
      serial_no: formData.serial_no.trim() || `DN-${Math.floor(1000 + Math.random() * 9000)}`,
      photo_url: formData.photo_url.trim() || 'https://iili.io/CNGWoTG.md.jpg',
      course_name: formData.course_name.trim(),
      subjects: subjects.map((s) => ({
        ...s,
        total_marks: (Number(s.theory) || 0) + (Number(s.practical) || 0),
      })),
      grand_total_obtained: grandObtained,
      grand_total_max: grandMax,
      percentage,
      grade: currentGrade,
      issue_date: formData.issue_date,
    };

    if (editingId) {
      setMarksheetsList(marksheetsList.map((item) => (item.id === editingId ? newRecord : item)));
      alert('✅ Marksheet Record Updated Successfully!');
    } else {
      setMarksheetsList([newRecord, ...marksheetsList]);
      alert('🎉 Marksheet Generated & Saved Successfully!');
    }

    handleCancelEdit();
  };

  // Dedicated Print Function
  const handlePrintMarksheetDedicated = (m: MarksheetRecord) => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    const qrText = `Verified
Name: ${m.student_name}
Roll No: ${m.roll_no}
Course: ${m.course_name}
DOB: ${m.dob || 'N/A'}
Date of Issue: ${m.issue_date}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrText)}`;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Marksheet - ${m.student_name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; }
            .a4-page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 48mm 15mm 15mm 15mm; box-sizing: border-box; position: relative; }
            .doc-title { font-size: 16px; font-weight: 900; text-align: center; margin-bottom: 15px; text-decoration: underline; text-transform: uppercase; letter-spacing: 1px; }
            .student-info-section { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 20px; border: 1.5px solid #000; padding: 12px; border-radius: 6px; }
            .info-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 15px; font-size: 11px; }
            .info-item { display: flex; }
            .info-lbl { font-weight: 800; width: 110px; flex-shrink: 0; text-transform: uppercase; color: #000; }
            .info-val { font-weight: 700; text-transform: uppercase; color: #0f172a; }
            .photo-box-container { text-align: center; flex-shrink: 0; }
            .doc-no-tag { font-size: 10px; font-weight: 800; margin-bottom: 4px; color: #000; }
            .photo-frame { width: 95px; height: 115px; border: 1.5px solid #000; object-fit: cover; border-radius: 4px; background: #f8fafc; }
            table.marks-tbl { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
            table.marks-tbl th, table.marks-tbl td { border: 1px solid #000; padding: 8px; text-align: center; }
            table.marks-tbl th { background-color: #f1f5f9; font-weight: 800; text-transform: uppercase; }
            .summary-box { display: flex; justify-content: space-between; align-items: center; border: 2px solid #000; padding: 10px 15px; font-weight: 800; font-size: 12px; margin-bottom: 25px; background: #fafafa; }
            .footer-signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; }
            .sign-block { text-align: center; width: 150px; }
            .sign-img { height: 35px; object-fit: contain; margin-bottom: 4px; }
            .sign-title { font-size: 9px; font-weight: 800; text-transform: uppercase; border-top: 1px solid #000; padding-top: 3px; }
            .legend-box { border-top: 1px solid #666; padding-top: 6px; margin-top: 30px; font-size: 8px; color: #444; text-align: center; line-height: 1.4; }
            @page { size: A4; margin: 0; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="a4-page">
            <div class="doc-title">STATEMENT OF MARKS</div>
            <div class="student-info-section">
              <div class="info-grid">
                <div class="info-item"><span class="info-lbl">PROGRAMME:</span><span class="info-val">${m.course_name}</span></div>
                <div class="info-item"><span class="info-lbl">SESSION:</span><span class="info-val">${m.session}</span></div>
                <div class="info-item"><span class="info-lbl">ROLL NO:</span><span class="info-val" style="color:#0284c7;">${m.roll_no}</span></div>
                <div class="info-item"><span class="info-lbl">ENROLLMENT NO:</span><span class="info-val" style="color:#0369a1;">${m.enrollment_no}</span></div>
                <div class="info-item"><span class="info-lbl">CANDIDATE NAME:</span><span class="info-val">${m.student_name}</span></div>
                <div class="info-item"><span class="info-lbl">FATHER'S NAME:</span><span class="info-val">${m.father_name}</span></div>
                <div class="info-item"><span class="info-lbl">MOTHER'S NAME:</span><span class="info-val">${m.mother_name || 'N/A'}</span></div>
                <div class="info-item"><span class="info-lbl">DATE OF BIRTH:</span><span class="info-val">${m.dob || 'N/A'}</span></div>
                <div class="info-item" style="grid-column: span 2;"><span class="info-lbl">STUDY CENTER:</span><span class="info-val">${m.study_center}</span></div>
              </div>
              <div class="photo-box-container">
                <div class="doc-no-tag">DOC NO: ${m.serial_no}</div>
                <img src="${m.photo_url || 'https://iili.io/CNGWoTG.md.jpg'}" class="photo-frame" alt="Student Photo" />
              </div>
            </div>
            <table class="marks-tbl">
              <thead>
                <tr>
                  <th style="width: 15%;">PAPER CODE</th>
                  <th style="width: 40%; text-align: left; padding-left: 10px;">EXAM / PAPER NAME</th>
                  <th style="width: 12%;">MAX MARKS</th>
                  <th style="width: 11%;">THEORY (100)</th>
                  <th style="width: 11%;">PRACTICAL (50)</th>
                  <th style="width: 11%;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${m.subjects
                  .map(
                    (s) => `
                  <tr>
                    <td style="font-weight: 700; font-family: monospace;">${s.paper_code}</td>
                    <td style="text-align: left; padding-left: 10px; font-weight: 600;">${s.paper_name}</td>
                    <td>${s.max_marks}</td>
                    <td>${s.theory}</td>
                    <td>${s.practical}</td>
                    <td style="font-weight: 800;">${s.total_marks}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="summary-box">
              <div>GRAND TOTAL: <span style="color:#0284c7; margin-left: 5px;">${m.grand_total_obtained} / ${m.grand_total_max}</span></div>
              <div>PERCENTAGE: <span style="color:#0f172a; margin-left: 5px;">${m.percentage}%</span></div>
              <div>FINAL GRADE: <span style="color:#15803d; margin-left: 5px;">${m.grade}</span></div>
            </div>
            <div class="footer-signatures">
              <div class="sign-block">
                <img src="/authorised-signature.png" class="sign-img" onError="this.style.display='none'" />
                <div class="sign-title">DIRECTOR (MITM)</div>
              </div>
              <div style="text-align: center;">
                <img src="${qrUrl}" style="width: 70px; height: 70px;" alt="QR Code" />
                <div style="font-size: 8px; font-weight: 800; margin-top: 4px;">SCAN TO VERIFY</div>
              </div>
              <div class="sign-block">
                <div style="font-size: 10px; font-weight: 800; margin-bottom: 25px;">DATE: ${m.issue_date}</div>
                <div class="sign-title">CHIEF EXAM CONTROLLER</div>
              </div>
            </div>
            <div class="legend-box">
              <strong>GRADING SCALE LEGEND:</strong> Ex: 90% & Above | A: 80% - 89% | B: 70% - 79% | C: 60% - 69% | D: 40% - 59% | F: Below 40% (Fail)
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const filteredList = marksheetsList
    .filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        m.student_name.toLowerCase().includes(q) ||
        m.roll_no.toLowerCase().includes(q) ||
        m.enrollment_no.toLowerCase().includes(q) ||
        m.course_name.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.student_name.localeCompare(b.student_name);
      if (sortBy === 'percentage') return b.percentage - a.percentage;
      return a.roll_no.localeCompare(b.roll_no);
    });

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected marksheets?`)) {
      setMarksheetsList(marksheetsList.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-8">
      {/* FORM SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span>📊</span> {editingId ? '✏️ Edit Student Marksheet' : 'Generate Student Marksheet & Upload Marks'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter Roll No to auto-fill candidate details, modify subject papers, and generate official statement of marks.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
            >
              ❌ Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSaveMarksheet} className="space-y-6">
          {/* SECTION 1: CANDIDATE INPUT FIELDS */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
              👤 Candidate & Academic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-sky-800 uppercase mb-1">
                  Roll Number * <span className="text-[10px] text-black">(Auto-fills details)</span>
                </label>
                <input
                  type="text"
                  value={formData.roll_no}
                  onChange={(e) => handleRollNoChange(e.target.value)}
                  placeholder="e.g. 103766"
                  className="w-full px-3 py-2 border-2 border-sky-400 rounded-lg font-mono font-bold bg-white focus:ring-2 text-black focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Enrollment Number</label>
                <input
                  type="text"
                  value={formData.enrollment_no}
                  onChange={(e) => setFormData({ ...formData, enrollment_no: e.target.value })}
                  placeholder="e.g. 1039954663"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-mono font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Course / Programme Name *</label>
                <input
                  type="text"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  placeholder="e.g. Computerised Professional Accounting"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Name *</label>
                <input
                  type="text"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. SHREYA CHUG"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-bold uppercase bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Father's Name</label>
                <input
                  type="text"
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  placeholder="e.g. YOGESH CHUG"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold uppercase bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={formData.mother_name}
                  onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                  placeholder="e.g. SUNITA CHUG"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold uppercase bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  placeholder="e.g. 15.08.2005"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session</label>
                <input
                  type="text"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  placeholder="e.g. 2025-2027"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Study Center</label>
                <input
                  type="text"
                  value={formData.study_center}
                  onChange={(e) => setFormData({ ...formData, study_center: e.target.value })}
                  placeholder="e.g. MITM BILARI"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Document No / Serial No</label>
                <input
                  type="text"
                  value={formData.serial_no}
                  onChange={(e) => setFormData({ ...formData, serial_no: e.target.value })}
                  placeholder="e.g. DN-3754"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-black font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Photo URL</label>
                <input
                  type="text"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Date of Issue</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-black font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SUBJECTS MARKS ENTRY */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                📚 Subject Exam Papers & Marks Entry
              </h3>
              <button
                type="button"
                onClick={handleAddSubjectRow}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow transition cursor-pointer flex items-center gap-1"
              >
                ➕ Add Subject / Paper
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-300 rounded-xl bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-semibold">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5 w-32">Paper Code</th>
                    <th className="p-2.5">Exam / Paper Name</th>
                    <th className="p-2.5 w-24 text-center">Max Marks</th>
                    <th className="p-2.5 w-28 text-center">Theory (100)</th>
                    <th className="p-2.5 w-28 text-center">Practical (50)</th>
                    <th className="p-2.5 w-28 text-center">Total Obtained</th>
                    <th className="p-2.5 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 text-black">
                      <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={sub.paper_code}
                          onChange={(e) => handleSubjectChange(idx, 'paper_code', e.target.value)}
                          placeholder="CPAC 201"
                          className="w-full px-2 py-1 border border-slate-300 rounded font-mono font-bold uppercase text-xs"
                          required
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={sub.paper_name}
                          onChange={(e) => handleSubjectChange(idx, 'paper_name', e.target.value)}
                          placeholder="Subject Name"
                          className="w-full px-2 py-1 border border-slate-300 rounded font-semibold text-xs"
                          required
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          value={sub.max_marks}
                          onChange={(e) => handleSubjectChange(idx, 'max_marks', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-xs"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          max={100}
                          value={sub.theory}
                          onChange={(e) => handleSubjectChange(idx, 'theory', Number(e.target.value))}
                          placeholder="0-100"
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-xs bg-amber-50"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          max={50}
                          value={sub.practical}
                          onChange={(e) => handleSubjectChange(idx, 'practical', Number(e.target.value))}
                          placeholder="0-50"
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-xs bg-sky-50"
                        />
                      </td>
                      <td className="p-2.5 text-center font-mono font-black text-sky-800 text-sm">
                        {(Number(sub.theory) || 0) + (Number(sub.practical) || 0)}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubjectRow(idx)}
                          className="p-1 text-rose-600 hover:text-rose-800 font-bold text-xs rounded hover:bg-rose-50"
                          title="Delete Subject"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SECTION 3: SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 text-xs font-bold">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase">Grand Total:</span>
                <span className="text-base text-amber-400 font-mono">
                  {grandObtained} / {grandMax}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase">Percentage:</span>
                <span className="text-base text-sky-400 font-mono">{percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase">Grade Awarded:</span>
                <span className="text-base text-emerald-400 font-black">{currentGrade}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              💾 {editingId ? 'Update Marksheet Record' : 'Save & Generate Marksheet'}
            </button>
          </div>
        </form>
      </div>

      {/* DIRECTORY TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase">
              📊 Generated Student Marksheets Directory ({marksheetsList.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              View or print official statement of marks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                🗑️ Delete Selected ({selectedIds.length})
              </button>
            )}

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search Name, Roll, Course..."
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-black font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-black border border-slate-300 rounded-lg text-xs font-bold bg-white"
            >
              <option value="roll">Sort by Roll No</option>
              <option value="name">Sort by Name</option>
              <option value="percentage">Sort by Percentage</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-900 text-white font-semibold">
              <tr>
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredList.length}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? filteredList.map((m) => m.id) : [])
                    }
                    className="rounded text-sky-600"
                  />
                </th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Enrollment No</th>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Course Name</th>
                <th className="p-3 text-center">Grand Total</th>
                <th className="p-3 text-center">Percentage</th>
                <th className="p-3 text-center">Grade</th>
                <th className="p-3 text-center">Action Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(m.id)}
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ? [...selectedIds, m.id] : selectedIds.filter((id) => id !== m.id)
                        )
                      }
                      className="rounded text-sky-600"
                    />
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">{m.roll_no}</td>
                  <td className="p-3 font-mono font-bold text-sky-800">{m.enrollment_no}</td>
                  <td className="p-3 font-bold uppercase">{m.student_name}</td>
                  <td className="p-3 font-medium">{m.course_name}</td>
                  <td className="p-3 text-center font-bold">
                    {m.grand_total_obtained} / {m.grand_total_max}
                  </td>
                  <td className="p-3 text-center font-bold text-sky-700">{m.percentage}%</td>
                  <td className="p-3 text-center font-bold text-emerald-700">{m.grade}</td>
                  <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleStartEdit(m)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setViewingMarksheet(m)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handlePrintMarksheetDedicated(m)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                    >
                      🖨️ Print
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this marksheet record?')) {
                          setMarksheetsList(marksheetsList.filter((rec) => rec.id !== m.id));
                        }
                      }}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👁️ VIEW MARKSHEET MODAL (NON-ZOOMING PREVIEW) */}
      {viewingMarksheet && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 my-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2">
                <span>👁️</span> Marksheet Preview - {viewingMarksheet.student_name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintMarksheetDedicated(viewingMarksheet)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow transition"
                >
                  🖨️ Print Now
                </button>
                <button
                  onClick={() => setViewingMarksheet(null)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER WITH TOP MARGIN FOR LETTERHEAD */}
            <div className="pt-12 space-y-6 text-xs font-sans">
              <div className="text-center font-black text-base text-slate-900 underline uppercase tracking-widest">
                STATEMENT OF MARKS
              </div>

              <div className="flex justify-between items-start gap-4 border-2 border-slate-900 p-4 rounded-lg bg-slate-50">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 text-xs">
                  <div><span className="font-extrabold text-slate-700">PROGRAMME:</span> <span className="font-bold text-slate-900">{viewingMarksheet.course_name}</span></div>
                  <div><span className="font-extrabold text-slate-700">SESSION:</span> <span className="font-bold text-slate-900">{viewingMarksheet.session}</span></div>
                  <div><span className="font-extrabold text-slate-700">ROLL NO:</span> <span className="font-black text-sky-700">{viewingMarksheet.roll_no}</span></div>
                  <div><span className="font-extrabold text-slate-700">ENROLLMENT NO:</span> <span className="font-black text-sky-800">{viewingMarksheet.enrollment_no}</span></div>
                  <div><span className="font-extrabold text-slate-700">CANDIDATE NAME:</span> <span className="font-extrabold text-slate-900">{viewingMarksheet.student_name}</span></div>
                  <div><span className="font-extrabold text-slate-700">FATHER'S NAME:</span> <span className="font-bold text-slate-900">{viewingMarksheet.father_name}</span></div>
                  <div><span className="font-extrabold text-slate-700">MOTHER'S NAME:</span> <span className="font-bold text-slate-900">{viewingMarksheet.mother_name || 'N/A'}</span></div>
                  <div><span className="font-extrabold text-slate-700">DATE OF BIRTH:</span> <span className="font-bold text-slate-900">{viewingMarksheet.dob || 'N/A'}</span></div>
                  <div className="col-span-2"><span className="font-extrabold text-slate-700">STUDY CENTER:</span> <span className="font-bold text-slate-900">{viewingMarksheet.study_center}</span></div>
                </div>

                <div className="text-center shrink-0">
                  <div className="text-[10px] font-bold text-slate-800 mb-1">DOC NO: {viewingMarksheet.serial_no}</div>
                  <img
                    src={viewingMarksheet.photo_url || 'https://iili.io/CNGWoTG.md.jpg'}
                    alt="Photo"
                    className="w-20 h-24 object-cover border-2 border-slate-900 rounded bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* MARKS TABLE */}
              <table className="w-full border-collapse border-2 border-slate-900 text-center text-xs">
                <thead className="bg-slate-100 font-extrabold">
                  <tr className="border-b-2 border-slate-900">
                    <th className="p-2 border-r border-slate-900">PAPER CODE</th>
                    <th className="p-2 border-r border-slate-900 text-left pl-3">EXAM / PAPER NAME</th>
                    <th className="p-2 border-r border-slate-900">MAX MARKS</th>
                    <th className="p-2 border-r border-slate-900">THEORY (100)</th>
                    <th className="p-2 border-r border-slate-900">PRACTICAL (50)</th>
                    <th className="p-2">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-slate-900 font-semibold">
                  {viewingMarksheet.subjects.map((sub, i) => (
                    <tr key={i} className="border-b border-slate-900">
                      <td className="p-2 border-r border-slate-900 font-mono font-bold">{sub.paper_code}</td>
                      <td className="p-2 border-r border-slate-900 text-left pl-3 uppercase">{sub.paper_name}</td>
                      <td className="p-2 border-r border-slate-900">{sub.max_marks}</td>
                      <td className="p-2 border-r border-slate-900">{sub.theory}</td>
                      <td className="p-2 border-r border-slate-900">{sub.practical}</td>
                      <td className="p-2 font-bold text-slate-900">{sub.total_marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* SUMMARY BOX */}
              <div className="flex justify-between items-center border-2 border-slate-900 p-3 bg-slate-50 font-extrabold text-xs">
                <div>GRAND TOTAL: <span className="text-sky-700 ml-1">{viewingMarksheet.grand_total_obtained} / {viewingMarksheet.grand_total_max}</span></div>
                <div>PERCENTAGE: <span className="text-slate-900 ml-1">{viewingMarksheet.percentage}%</span></div>
                <div>FINAL GRADE: <span className="text-emerald-700 ml-1">{viewingMarksheet.grade}</span></div>
              </div>

              {/* FOOTER WITH QR CODE */}
              <div className="flex justify-between items-end pt-4">
                <div className="text-center w-36">
                  <img src="/authorised-signature.png" alt="Sign" className="h-8 object-contain mx-auto mb-1" onError={(e: any) => e.target.style.display='none'} />
                  <div className="border-t border-slate-900 pt-1 text-[9px] font-bold uppercase">DIRECTOR (MITM)</div>
                </div>

                <div className="text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                      `Verified
Name: ${viewingMarksheet.student_name}
Roll No: ${viewingMarksheet.roll_no}
Course: ${viewingMarksheet.course_name}
DOB: ${viewingMarksheet.dob || 'N/A'}
Date of Issue: ${viewingMarksheet.issue_date}`
                    )}`}
                    alt="QR"
                    className="w-16 h-16 mx-auto mb-1 border p-1 bg-white"
                  />
                  <div className="text-[8px] font-black uppercase text-slate-700">SCAN TO VERIFY</div>
                </div>

                <div className="text-center w-36">
                  <div className="text-[10px] font-bold mb-4">DATE: {viewingMarksheet.issue_date}</div>
                  <div className="border-t border-slate-900 pt-1 text-[9px] font-bold uppercase">CHIEF EXAM CONTROLLER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
