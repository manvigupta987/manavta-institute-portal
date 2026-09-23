"use client";

import React, { useState } from 'react';

interface StudentData {
  id?: string;
  enrollment_no: string;
  roll_no?: string;
  student_name: string;
  father_name: string;
  mother_name?: string;
  course_name: string;
  admission_date?: string;
  dob: string;
  study_center?: string;
  institute_name?: string;
  photo_url?: string;
}

export default function VerifyRegistrationPage() {
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !dob.trim()) {
      setErrorMsg('Please enter both Student Name and Date of Birth.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setStudent(null);
    setSearched(true);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName.trim(),
          dob: dob.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.student) {
        setStudent(data.student);
      } else {
        setErrorMsg(data.message || 'No matching student record found. Please check Name & DOB.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to database. Please try again.');
    } 
    finally {setLoading(false);
    }
  };

  // Dedicated A4 Print Handler for Exact Aadhar Card Size (85.6mm x 53.9mm)
  const handlePrintA4AadharCard = () => {
    if (!student) return;

    const printWin = window.open('', '_blank');
    if (!printWin) return;

    const photoSrc = student.photo_url || 'https://iili.io/3jruEzl.md.jpg';
    const centerName = student.study_center || student.institute_name || 'MITM BILARI';
    const rollDisplay = student.roll_no || student.enrollment_no;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Card - ${student.student_name}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #fff;
              color: #000;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
            }
            .a4-container {
              width: 100%;
              max-width: 210mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding-top: 15mm;
            }
            .print-instructions {
              font-size: 11px;
              color: #475569;
              margin-bottom: 12px;
              text-align: center;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            /* EXACT AADHAR / CREDIT CARD DIMENSIONS: 85.6mm x 53.9mm */
            .id-card-aadhar {
              width: 85.6mm;
              height: 53.9mm;
              border: 1.5px solid #0284c7;
              border-radius: 4mm;
              padding: 2.5mm 3.5mm;
              background: #ffffff;
              box-sizing: border-box;
              position: relative;
              box-shadow: none;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .card-header {
              border-bottom: 1.2px solid #0284c7;
              padding-bottom: 1.5mm;
              text-align: center;
            }
            .inst-name {
              font-size: 8.5pt;
              font-weight: 900;
              color: #0f172a;
              text-transform: uppercase;
              line-height: 1.1;
              letter-spacing: 0.2px;
            }
            .card-title-sub {
              font-size: 5pt;
              font-weight: 800;
              color: #0369a1;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              margin-top: 0.5mm;
            }
            .card-body-grid {
              display: flex;
              gap: 2.5mm;
              align-items: center;
              margin-top: 1.5mm;
            }
            .photo-frame {
              width: 16.5mm;
              height: 20mm;
              border: 1px solid #94a3b8;
              border-radius: 1mm;
              object-fit: cover;
              flex-shrink: 0;
            }
            .details-list {
              font-size: 5.8pt;
              line-height: 1.35;
              color: #0f172a;
              flex: 1;
              font-weight: 600;
            }
            .details-list div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .details-list label {
              font-weight: 800;
              color: #0284c7;
              display: inline-block;
              width: 14mm;
            }
            .card-footer {
              border-top: 1px solid #cbd5e1;
              padding-top: 1mm;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 1mm;
            }
            .valid-tag {
              font-size: 4.5pt;
              font-weight: 800;
              color: #15803d;
              text-transform: uppercase;
            }
            .sign-block {
              text-align: center;
            }
            .sign-img {
              height: 4.5mm;
              object-fit: contain;
            }
            .sign-lbl {
              font-size: 4.2pt;
              font-weight: 800;
              color: #0f172a;
              text-transform: uppercase;
            }
            @media print {
              .print-instructions {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="a4-container">
            <div class="print-instructions">
              📄 Official Student Identity Card — A4 Print Layout (Standard Aadhar Size: 85.6mm × 53.9mm)
            </div>
            
            <!-- Exact Aadhar Card Size Outer Box -->
            <div class="id-card-aadhar">
              <div class="card-header">
                <div class="inst-name">MANAVTA INSTITUTE</div>
                <div class="card-title-sub">Official Student Identity Card</div>
              </div>

              <div class="card-body-grid">
                <img src="${photoSrc}" class="photo-frame" alt="Student Photo" />
                <div class="details-list">
                  <div><label>NAME:</label> <strong>${student.student_name.toUpperCase()}</strong></div>
                  <div><label>FATHER:</label> ${student.father_name.toUpperCase()}</div>
                  <div><label>ROLL NO:</label> <strong style="color:#0284c7;">${rollDisplay}</strong></div>
                  <div><label>ENROLLMENT:</label> <strong>${student.enrollment_no}</strong></div>
                  <div><label>COURSE:</label> ${student.course_name}</div>
                  <div><label>CENTER:</label> ${centerName}</div>
                </div>
              </div>

              <div class="card-footer">
                <div class="valid-tag">✔ VERIFIED STUDENT</div>
                <div class="sign-block">
                  <img src="/authorised-signature.png" class="sign-img" onError="this.style.display='none'" alt="Sign" />
                  <div class="sign-lbl">Authorised Signatory</div>
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 font-sans flex flex-col items-center">
      {/* Main Container */}
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Title Banner */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">
            🎓 Student Verification & Public ID Card Portal
          </h1>
          <p className="text-xs text-slate-500">
            Enter candidate name (case-insensitive) and Date of Birth to verify student identity and print A4 Aadhar-sized ID Card.
          </p>
        </div>

        {/* Search Input Bar (Student Name + DOB) */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Student Name <span className="text-[10px] text-slate-400">(e.g. manvi / MANVI)</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Student Name"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Date of Birth <span className="text-[10px] text-slate-400">(DOB)</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
            >
              {loading ? '🔍 Searching Record...' : '🔍 Search & Verify Student'}
            </button>

            {student && (
              <button
                type="button"
                onClick={handlePrintA4AadharCard}
                className="w-full sm:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                🖨️ Print ID Card (A4 Aadhar Size)
              </button>
            )}
          </div>
        </form>

        {/* Error Message */}
        {errorMsg && searched && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-bold text-center shadow-sm">
            ❌ {errorMsg}
          </div>
        )}

        {/* 💳 STUDENT ID CARD PREVIEW (Exact Admin Page Layout - Standard Aadhar Size 85.6mm x 53.9mm) */}
        {student && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <span>🪪</span> Official Student Identity Card Preview
              </span>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-md">
                Standard ID / Aadhar Size (85.6mm × 53.9mm)
              </span>
            </div>

            {/* Centered ID Card Display */}
            <div className="flex justify-center py-4 bg-slate-100 rounded-xl border border-slate-200">
              <div className="w-[340px] bg-white border-2 border-sky-600 rounded-xl p-4 shadow-lg text-center space-y-3 relative">
                {/* Header */}
                <div className="border-b-2 border-sky-600 pb-2">
                  <div className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    MANAVTA INSTITUTE
                  </div>
                  <div className="text-[9px] font-extrabold text-sky-700 uppercase tracking-wider">
                    Official Student Identity Card
                  </div>
                </div>

                {/* Photo & Info Grid */}
                <div className="flex items-center gap-3 text-left">
                  <img
                    src={student.photo_url || 'https://iili.io/3jruEzl.md.jpg'}
                    alt={student.student_name}
                    className="w-20 h-24 border border-slate-300 rounded-md object-cover flex-shrink-0 bg-slate-50"
                  />
                  <div className="space-y-1 text-[11px] font-semibold text-slate-800 leading-tight flex-1 min-w-0">
                    <div className="truncate">
                      <span className="font-bold text-sky-700">NAME:</span>{' '}
                      <strong className="text-slate-900 uppercase">{student.student_name}</strong>
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-sky-700">FATHER:</span>{' '}
                      <span className="uppercase">{student.father_name}</span>
                    </div>
                    <div>
                      <span className="font-bold text-sky-700">ROLL NO:</span>{' '}
                      <strong className="text-sky-800 font-mono">{student.roll_no || student.enrollment_no}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-sky-700">ENROLLMENT:</span>{' '}
                      <span className="font-mono font-bold">{student.enrollment_no}</span>
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-sky-700">COURSE:</span> {student.course_name}
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-sky-700">CENTER:</span>{' '}
                      {student.study_center || student.institute_name || 'MITM BILARI'}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 pt-2 flex items-end justify-between text-[9px]">
                  <div className="font-bold text-emerald-700 flex items-center gap-1 uppercase">
                    ✔ Verified Student
                  </div>
                  <div className="text-center">
                    <img
                      src="/authorised-signature.png"
                      alt="Sign"
                      className="h-6 object-contain mx-auto"
                      onError={(e: any) => (e.target.style.display = 'none')}
                    />
                    <div className="font-bold text-slate-900 uppercase text-[8px]">
                      Authorised Signatory
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handlePrintA4AadharCard}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-2"
              >
                🖨️ Print Official Aadhar Size ID Card
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
