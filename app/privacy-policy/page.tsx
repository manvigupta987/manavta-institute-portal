"use client";

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 30, 2026";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            🔒 Official Institutional Policy
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Manavta Institute of Education (MITM) • Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-600 pl-3">
              1. Introduction & Overview
            </h2>
            <p>
              Manavta Institute of Education (MITM) ("we", "our", "us") respects your privacy and is committed to protecting the personal data of our candidates, enrolled students, faculty, and website visitors. This Privacy Policy outlines how we collect, use, store, and safeguard your personal information across our official website, online enrollment portal, and student verification services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-600 pl-3">
              2. Information We Collect
            </h2>
            <p>We collect personal information necessary to facilitate academic enrollment, maintain official registers, and issue digital credentials:</p>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-sky-600">
              <li><strong>Student Identity Data:</strong> Candidate Full Name, Father's Name, Mother's Name, Date of Birth, Gender, and 12-digit Aadhar Number.</li>
              <li><strong>Contact Information:</strong> Primary 10-digit Mobile Number, Alternate Contact Number, Email Address, and Residential Address.</li>
              <li><strong>Academic Details:</strong> Prior Qualification (10th, 12th, Graduation), Course Program Selection (e.g., ADCS, CPAC, ADCA, DEO), and Study Center Branch Choice.</li>
              <li><strong>Media & Documents:</strong> Passport-size photograph uploads for ID cards, roll sheets, and marksheets.</li>
              <li><strong>Technical Logs:</strong> IP address, browser type, device information, and access timestamps when using our verification portals.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-600 pl-3">
              3. How We Use Your Information
            </h2>
            <p>Your data is processed strictly for legitimate educational and administrative purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-sky-600">
              <li>To process direct online admissions and assign unique Enrollment and Roll Numbers.</li>
              <li>To generate official Student Identity Cards, Marksheets, and Course Certificates.</li>
              <li>To enable public online verification of credentials by employers and academic bodies via Name and Date of Birth.</li>
              <li>To send essential SMS or notification alerts regarding examinations, schedules, and certificate readiness.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-600 pl-3">
              4. Data Protection & Security
            </h2>
            <p>
              We implement industry-standard administrative and technological safeguards. Student records are securely stored in encrypted cloud database environments (Supabase DB) with Row Level Security (RLS) policies and restricted administrative access credentials. We do not sell, rent, or commercialize student data to third-party advertisers under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-600 pl-3">
              5. Public Verification & Data Visibility
            </h2>
            <p>
              To protect the authenticity of MITM certifications and prevent credential fraud, basic academic completion details (Candidate Name, Roll Number, Course Name, Grade, and Center) are accessible through our public verification portal upon providing authorized matching search criteria.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-600 pl-3">
              6. Your Rights & Corrections
            </h2>
            <p>
              Students have the right to request correction of inaccurate details in their records (such as spelling corrections in Name or Father's Name) prior to the printing of final marksheets and certificates. Corrections must be submitted with official supporting identity proof to the Head Office administration.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-600 pl-3">
              7. Contact Us for Privacy Concerns
            </h2>
            <p>
              For questions regarding this Privacy Policy or data handling practices, please reach out to our administration desk:
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium space-y-1">
              <p><strong>Head Campus:</strong> Manavta Institute of Education, Station Road, Bilari, Moradabad, Uttar Pradesh - 248101</p>
              <p><strong>Email:</strong> privacy@manavtainstitute.com</p>
              <p><strong>Helpline:</strong> +91 9123456789</p>
            </div>
          </section>

        </div>

        {/* Footer Link Back */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-sky-600 font-bold hover:underline">
            ← Back to Home
          </Link>
          <span className="text-slate-400">ISO 9001:2015 Certified Institution</span>
        </div>

      </div>
    </div>
  );
}
