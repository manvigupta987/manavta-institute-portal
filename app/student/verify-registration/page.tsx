"use client";

import React, { useState } from 'react';

interface StudentData {
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  admission_date: string;
  dob: string;
  institute_name: string;
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
          dob: dob.trim()
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
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-10 px-4 font-sans flex flex-col items-center">
      
      {/* 🖨️ PRINT ONLY STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
          }
          #printable-card, #printable-card * {
            visibility: visible;
          }
          #printable-card {
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            width: 100% !important;
            max-width: 650px !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Main Container */}
      <div className="w-full max-w-2xl">
        
        {/* Title Banner */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black no-print">
          View your Registration Information/ ID Card
        </h1>

        {/* Search Input Bar (Student Name + DOB) */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 no-print">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter Student Name"
            className="w-full sm:w-56 px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
          />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Select DOB"
            className="w-full sm:w-48 px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded transition shadow"
          >
            {loading ? 'Searching...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!student}
            className="w-full sm:w-auto px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Print
          </button>
        </form>

        {/* Error Message */}
        {errorMsg && searched && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center mb-6 no-print">
            {errorMsg}
          </div>
        )}

        {/* 📜 STUDENT ID CARD (Exact Sample Layout) */}
        {student && (
          <div 
            id="printable-card" 
            className="bg-white border border-gray-200 shadow-md rounded-lg p-6 sm:p-8 w-full mx-auto my-4"
          >
            {/* Header 3 Logos */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8 border-b pb-6">
              <img 
                src="/logo.png" 
                alt="MITM Emblem" 
                className="h-16 sm:h-20 object-contain"
              />
              <img 
                src="/logo2.png" 
                alt="MANAVTA Institute" 
                className="h-12 sm:h-16 object-contain"
              />
              <img 
                src="/site.jpg" 
                alt="Badge" 
                className="h-16 sm:h-20 object-contain"
              />
            </div>

            {/* Content Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              
              {/* Left Details */}
              <div className="md:col-span-8 space-y-3.5 text-sm sm:text-base">
                <div className="grid grid-cols-12">
                  <span className="col-span-5 font-bold text-gray-900">Enrollment No:</span>
                  <span className="col-span-7 font-normal text-gray-800">{student.enrollment_no}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 font-bold text-gray-900">Course:</span>
                  <span className="col-span-7 font-normal text-gray-800">{student.course_name}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 font-bold text-gray-900">Name:</span>
                  <span className="col-span-7 font-normal text-gray-800">{student.student_name}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 font-bold text-gray-900">Fathers Name:</span>
                  <span className="col-span-7 font-normal text-gray-800">{student.father_name}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 font-bold text-gray-900">Addmission Date:</span>
                  <span className="col-span-7 font-normal text-gray-800">{student.admission_date}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 font-bold text-gray-900">Institute Name:</span>
                  <span className="col-span-7 font-normal text-gray-800">{student.institute_name}</span>
                </div>
              </div>

              {/* Right Photo & Authorised Signatory */}
              <div className="md:col-span-4 flex flex-col items-center justify-center pt-1 md:pt-0">
                <div className="w-28 h-32 border border-gray-400 p-0.5 bg-white shadow-sm overflow-hidden mb-3">
                  <img 
                    src={student.photo_url || '/student-placeholder.jpg'} 
                    alt={student.student_name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center pt-2 border-t border-gray-300 w-full flex flex-col items-center">
                  <img 
                    src="/authorised-signature.png" 
                    alt="Authorised Signatory" 
                    className="h-10 object-contain mb-1"
                  />
                  <span className="text-xs font-semibold text-gray-700">Authorised Signatory</span>
                  <span className="text-[10px] text-gray-500">Manavta Institute</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
