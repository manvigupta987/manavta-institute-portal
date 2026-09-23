"use client";

import React, { useState } from 'react';

export interface CertificateRecord {
  id: string;
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  start_date: string;
  end_date: string;
  grade: string;
  issue_date: string;
  session: string;
  serial_no: string;
  photo_url: string;
  study_center: string;
  des?: string;
  dob?: string;
}

interface CertificateTabProps {
  studentsList?: any[];
}

export default function CertificateTabComponent({
  studentsList = [],
}: CertificateTabProps) {
  // Pre-configured Award Matter State
  const [awardMatter, setAwardMatter] = useState(
    'This is to certify that the candidate named below has successfully completed the prescribed course of study and passed the final assessment with credit.'
  );

  // Certificates List State
  const [certificatesList, setCertificatesList] = useState<CertificateRecord[]>([
    {
      id: 'c1',
      roll_no: '103774',
      enrollment_no: '1039954671',
      student_name: 'BANTY',
      father_name: 'BATTU',
      course_name: 'Desktop Publishing Course',
      start_date: '01.08.2025',
      end_date: '31.01.2026',
      grade: 'C',
      issue_date: '02.04.2026',
      session: '2025-2026',
      serial_no: 'DN-3762',
      photo_url: 'https://iili.io/3jruEzl.md.jpg',
      study_center: 'MITM BILARI',
      des: 'S/O',
      dob: '12.05.2004',
    },
  ]);

  // Form State for Certificate Generation
  const [rollInput, setRollInput] = useState('');
  const [autoStudent, setAutoStudent] = useState<any>(null);
  const [desVal, setDesVal] = useState('S/O');
  const [startDate, setStartDate] = useState('01.08.2025');
  const [endDate, setEndDate] = useState('31.01.2026');
  const [gradeVal, setGradeVal] = useState('A');
  const [issueDateVal, setIssueDateVal] = useState('02.04.2026');

  // Search, Sort, Checkbox Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'date'>('name');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingCert, setEditingCert] = useState<CertificateRecord | null>(null);
  const [viewingCert, setViewingCert] = useState<CertificateRecord | null>(null);

  // Auto-Fetch Student Details on Roll No Change
  const handleRollSearch = (rollVal: string) => {
    setRollInput(rollVal);
    const found = studentsList.find((s) => s.roll_no === rollVal.trim());
    if (found) {
      setAutoStudent(found);
    } else {
      setAutoStudent(null);
    }
  };

  // Generate Certificate
  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoStudent && !rollInput) {
      alert('Please enter a valid Roll Number to fetch student details');
      return;
    }

    const newCert: CertificateRecord = {
      id: 'c_' + Date.now(),
      roll_no: autoStudent ? autoStudent.roll_no : rollInput,
      enrollment_no: autoStudent ? autoStudent.enrollment_no : 'ENR-' + Date.now().toString().slice(-6),
      student_name: autoStudent ? autoStudent.student_name : 'CANDIDATE NAME',
      father_name: autoStudent ? autoStudent.father_name : 'FATHER NAME',
      course_name: autoStudent ? autoStudent.course_name : 'PROFESSIONAL COURSE',
      start_date: startDate,
      end_date: endDate,
      grade: gradeVal,
      issue_date: issueDateVal,
      session: autoStudent ? (autoStudent.session || '2025-2026') : '2025-2026',
      serial_no: 'DN-' + Math.floor(1000 + Math.random() * 9000),
      photo_url: autoStudent ? (autoStudent.photo_url || 'https://iili.io/3jruEzl.md.jpg') : 'https://iili.io/3jruEzl.md.jpg',
      study_center: autoStudent ? (autoStudent.study_center || 'MITM BILARI') : 'MITM BILARI',
      des: desVal,
      dob: autoStudent ? (autoStudent.dob || '12.05.2004') : '12.05.2004',
    };

    setCertificatesList([newCert, ...certificatesList]);
    alert('🎉 Certificate Generated Successfully!');
  };

  // Bulk CSV Import
  const handleCertCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const newParsed: CertificateRecord[] = [];

      lines.slice(1).forEach((line) => {
        const row = line.split(',').map((cell) => cell.trim());
        if (row.length < 7) return;

        const [sName, fName, cName, stDate, eDate, gr, iDate, roll, enr, sess, docNo, photo, center] = row;

        newParsed.push({
          id: 'c_csv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          student_name: sName,
          father_name: fName,
          course_name: cName,
          start_date: stDate || '01.08.2025',
          end_date: eDate || '31.01.2026',
          grade: gr || 'A',
          issue_date: iDate || '02.04.2026',
          roll_no: roll || '103774',
          enrollment_no: enr || '1039954671',
          session: sess || '2025-2026',
          serial_no: docNo || 'DN-' + Math.floor(1000 + Math.random() * 9000),
          photo_url: photo || 'https://iili.io/3jruEzl.md.jpg',
          study_center: center || 'MITM BILARI',
          des: 'S/O',
          dob: '12.05.2004',
        });
      });

      setCertificatesList([...newParsed, ...certificatesList]);
      alert(`✅ Imported ${newParsed.length} certificates successfully!`);
    };
    reader.readAsText(file);
  };

  // Dedicated Certificate Print Window (No Header Heading, ~48mm Top Margin, Full A4 Proportions)
  const handlePrintCertificateDedicated = (c: CertificateRecord) => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    const qrText = `Verified\nName: ${c.student_name}\nRoll No: ${c.roll_no}\nCourse: ${c.course_name}\nDOB: ${c.dob || '12.05.2004'}\nDate of Issue: ${c.issue_date}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(qrText)}`;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${c.student_name}</title>
          <style>
            body { font-family: 'Georgia', serif; margin: 0; padding: 0; background: #fff; color: #000; }
            .a4-page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 48mm 20mm 20mm 20mm; box-sizing: border-box; position: relative; }
            .top-meta { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; font-family: sans-serif; font-size: 13px; line-height: 1.6; }
            .doc-no { font-weight: 900; color: #000; font-size: 14px; margin-bottom: 4px; }
            .cert-photo { width: 105px; height: 130px; border: 2px solid #000; object-fit: cover; border-radius: 4px; }
            .cert-title { text-align: center; font-size: 30px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #0f172a; margin: 35px 0 30px 0; font-family: sans-serif; text-decoration: underline; }
            .body-text { font-size: 17px; line-height: 2.5; text-align: justify; margin-bottom: 60px; padding: 0 10px; }
            .body-text strong { text-decoration: underline; font-weight: 900; color: #0f172a; }
            .footer-grid { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 80px; font-family: sans-serif; }
            @page { size: A4; margin: 0; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="a4-page">
            <div class="top-meta">
              <div>
                <div class="doc-no">Doc. Serial No: ${c.serial_no}</div>
                <div>Enrollment No: <strong>${c.enrollment_no}</strong></div>
                <div>Roll No: <strong>${c.roll_no}</strong></div>
              </div>
              <div style="text-align: right;">
                <img src="${c.photo_url || 'https://iili.io/3jruEzl.md.jpg'}" class="cert-photo" alt="Candidate Photo" />
              </div>
            </div>

            <div class="cert-title">CERTIFICATE OF COMPLETION</div>

            <div class="body-text">
              ${awardMatter}<br/><br/>
              This is to certify that <strong>${c.student_name}</strong> ${c.des || 'S/O'} <strong>${c.father_name}</strong> has successfully completed the <strong>${c.course_name}</strong> conducted by <strong>${c.study_center || 'MITM Bilari'}</strong> during the period from <strong>${c.start_date}</strong> to <strong>${c.end_date}</strong>. The candidate has satisfied all requirements and has been awarded Grade <strong><span style="font-size: 20px; color: #0284c7;">'${c.grade}'</span></strong>.
            </div>

            <div class="footer-grid">
              <div style="text-align: center;">
                <img src="${qrUrl}" style="width: 100px; height: 100px;" alt="QR Code" />
                <div style="font-size: 9px; font-weight: 800; margin-top: 4px;">SCAN TO VERIFY</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 13px; font-weight: bold; margin-bottom: 6px;">Date of Issue: ${c.issue_date}</div>
                <div style="border-top: 2px solid #000; width: 200px; margin-top: 45px; font-weight: bold; font-size: 13px; text-transform: uppercase;">
                  Authorised Signatory
                </div>
              </div>
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

  // Filtered & Sorted Certificates
  const filteredCertificates = certificatesList
    .filter(
      (c) =>
        !searchQuery ||
        c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.enrollment_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.student_name.localeCompare(b.student_name);
      if (sortBy === 'roll') return a.roll_no.localeCompare(b.roll_no);
      if (sortBy === 'date') return a.issue_date.localeCompare(b.issue_date);
      return 0;
    });

  // Bulk Delete Selected
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} certificates?`)) {
      setCertificatesList(certificatesList.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      alert('Deleted selected certificates!');
    }
  };

  return (
    <div className="space-y-8">
      {/* 📜 TOP PANEL: PRE-CONFIGURED CERTIFICATE AWARD MATTER */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="border-b pb-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span>📜</span> Pre-Configured Certificate Award Matter
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Default verification statement text printed on official certificates.
          </p>
        </div>

        <div>
          <textarea
            value={awardMatter}
            onChange={(e) => setAwardMatter(e.target.value)}
            rows={3}
            className="w-full p-3 border border-slate-300 rounded-xl text-xs font-serif leading-relaxed focus:ring-2 focus:ring-amber-500 bg-amber-50/50"
          />
        </div>
      </div>

      {/* 🎓 GENERATE CERTIFICATE FORM WITH ROLL NO AUTO-FETCH */}
      <form onSubmit={handleGenerateCertificate} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span>🎓</span> Generate Student Certificate (Auto-Fetch by Roll No)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter candidate Roll No to auto-fill details from database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Enter Roll No *</label>
            <input
              type="text"
              value={rollInput}
              onChange={(e) => handleRollSearch(e.target.value)}
              placeholder="e.g. 103774"
              className="w-full px-3 py-2 border-2 border-amber-500 rounded-lg font-mono font-bold text-sm bg-amber-50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Name</label>
            <input
              type="text"
              value={autoStudent ? autoStudent.student_name : ''}
              placeholder="Auto-filled Name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-slate-100 uppercase"
              readOnly
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Father's Name</label>
            <input
              type="text"
              value={autoStudent ? autoStudent.father_name : ''}
              placeholder="Auto-filled Father Name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-slate-100 uppercase"
              readOnly
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Enrollment No</label>
            <input
              type="text"
              value={autoStudent ? autoStudent.enrollment_no : ''}
              placeholder="Auto-filled Enrollment"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold bg-slate-100"
              readOnly
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Course Name</label>
            <input
              type="text"
              value={autoStudent ? autoStudent.course_name : ''}
              placeholder="Auto-filled Course Name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-slate-100 uppercase"
              readOnly
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">DES (S/O, D/O, W/O)</label>
            <select
              value={desVal}
              onChange={(e) => setDesVal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white"
            >
              <option value="S/O">S/O (Son of)</option>
              <option value="D/O">D/O (Daughter of)</option>
              <option value="W/O">W/O (Wife of)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Course Start Date</label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Course End Date</label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Awarded Grade</label>
            <input
              type="text"
              value={gradeVal}
              onChange={(e) => setGradeVal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white uppercase"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Date of Issue</label>
            <input
              type="text"
              value={issueDateVal}
              onChange={(e) => setIssueDateVal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
        >
          🚀 Generate & Save Certificate
        </button>
      </form>

      {/* 📁 BULK CSV UPLOAD */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span>🎓</span> Bulk Upload Student Certificates Excel / CSV
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Import certificate dataset for instant printing.
            </p>
          </div>

          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,Student_Name,Father_Name,Course_Name,Start_Date,End_Date,Grade,Issue_Date,Roll_No,Enrollment_No,Session,Document_No,Photo_URL,Institute_Name\nBANTY,BATTU,Desktop Publishing Course,01.08.2025,31.01.2026,C,02.04.2026,103774,1039954671,2025-2026,DN-3762,https://iili.io/3jruEzl.md.jpg,MITM BILARI';
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', 'Certificate_Import_Sample.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
          >
            📥 Download Certificate CSV Template
          </button>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleCertCSV}
          className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-900 hover:file:bg-amber-600 cursor-pointer"
        />
      </div>

      {/* 📜 CERTIFICATES DIRECTORY TABLE WITH SEARCH, SORT, BULK DELETE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase">
                📜 Generated Student Certificates Directory ({filteredCertificates.length})
              </h3>
              <p className="text-xs text-slate-500">
                Exact award layout without heavy table borders.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search Name, Roll, Enr..."
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="roll">Sort by Roll No</option>
              <option value="date">Sort by Issue Date</option>
            </select>

            {/* Bulk Delete Selected */}
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition"
              >
                🗑️ Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-900 text-white font-semibold">
              <tr>
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredCertificates.length}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? filteredCertificates.map((c) => c.id) : [])
                    }
                    className="rounded text-amber-600"
                  />
                </th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Enrollment No</th>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Course Name</th>
                <th className="p-3 text-center">Grade</th>
                <th className="p-3 text-center">Action Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCertificates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ? [...selectedIds, c.id] : selectedIds.filter((id) => id !== c.id)
                        )
                      }
                      className="rounded text-amber-600"
                    />
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">{c.roll_no}</td>
                  <td className="p-3 font-mono font-bold text-sky-800">{c.enrollment_no}</td>
                  <td className="p-3 font-bold uppercase">{c.student_name}</td>
                  <td className="p-3">{c.course_name}</td>
                  <td className="p-3 text-center font-bold text-emerald-700">{c.grade}</td>
                  <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setEditingCert(c)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setViewingCert(c)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handlePrintCertificateDedicated(c)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                    >
                      🖨️ Print
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this certificate record?')) {
                          setCertificatesList(certificatesList.filter((rec) => rec.id !== c.id));
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

      {/* VIEW CERTIFICATE MODAL */}
      {viewingCert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">📜 Certificate On-Screen Preview</h3>
              <button onClick={() => setViewingCert(null)} className="text-slate-500 hover:text-slate-800 font-bold text-sm">✕ Close</button>
            </div>

            <div className="bg-white border-2 border-slate-300 p-8 rounded-xl space-y-6 font-serif pt-[48mm]">
              <div className="flex justify-between items-start font-sans text-xs">
                <div>
                  <div className="font-black text-sm">Doc Serial No: {viewingCert.serial_no}</div>
                  <div>Enrollment No: <strong>{viewingCert.enrollment_no}</strong></div>
                  <div>Roll No: <strong>{viewingCert.roll_no}</strong></div>
                </div>
                <div>
                  <img src={viewingCert.photo_url || 'https://iili.io/3jruEzl.md.jpg'} className="w-24 h-28 border-2 border-black object-cover rounded" alt="Candidate" />
                </div>
              </div>

              <div className="text-center text-xl font-black font-sans uppercase tracking-widest text-slate-900 underline my-6">
                CERTIFICATE OF COMPLETION
              </div>

              <div className="text-sm leading-relaxed text-justify">
                {awardMatter}<br/><br/>
                This is to certify that <strong>{viewingCert.student_name}</strong> {viewingCert.des || 'S/O'} <strong>{viewingCert.father_name}</strong> has successfully completed the <strong>{viewingCert.course_name}</strong> conducted by <strong>{viewingCert.study_center || 'MITM Bilari'}</strong> during the period from <strong>{viewingCert.start_date}</strong> to <strong>{viewingCert.end_date}</strong>. The candidate has satisfied all requirements and has been awarded Grade <strong><span className="text-sky-600 font-black">'{viewingCert.grade}'</span></strong>.
              </div>

              <div className="flex justify-between items-end pt-12 font-sans">
                <div className="text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(`Verified\nName: ${viewingCert.student_name}\nRoll No: ${viewingCert.roll_no}\nCourse: ${viewingCert.course_name}\nDOB: ${viewingCert.dob || '12.05.2004'}\nDate of Issue: ${viewingCert.issue_date}`)}`}
                    className="w-20 h-20 mx-auto"
                    alt="QR Code"
                  />
                  <div className="text-[9px] font-bold mt-1">SCAN TO VERIFY</div>
                </div>

                <div className="text-center">
                  <div className="text-xs font-bold mb-1">Date of Issue: {viewingCert.issue_date}</div>
                  <div className="border-t-2 border-black w-40 pt-1 font-bold text-xs uppercase">
                    Authorised Signatory
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button onClick={() => setViewingCert(null)} className="px-4 py-2 bg-slate-200 text-xs font-bold rounded-xl">Close</button>
              <button
                onClick={() => {
                  handlePrintCertificateDedicated(viewingCert);
                  setViewingCert(null);
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow"
              >
                🖨️ Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CERTIFICATE MODAL */}
      {editingCert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 uppercase border-b pb-2">✏️ Edit Certificate Record</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={editingCert.student_name}
                  onChange={(e) => setEditingCert({ ...editingCert, student_name: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Father Name</label>
                <input
                  type="text"
                  value={editingCert.father_name}
                  onChange={(e) => setEditingCert({ ...editingCert, father_name: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Grade</label>
                <input
                  type="text"
                  value={editingCert.grade}
                  onChange={(e) => setEditingCert({ ...editingCert, grade: e.target.value })}
                  className="w-full p-2 border rounded font-bold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Issue Date</label>
                <input
                  type="text"
                  value={editingCert.issue_date}
                  onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setEditingCert(null)} className="px-4 py-1.5 bg-slate-200 text-xs font-bold rounded-lg">Cancel</button>
              <button
                onClick={() => {
                  setCertificatesList(certificatesList.map((c) => (c.id === editingCert.id ? editingCert : c)));
                  setEditingCert(null);
                  alert('Updated certificate record!');
                }}
                className="px-4 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
